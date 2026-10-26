import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processWhatsAppAgentMessage, generateAICallSimulation } from '@/lib/gemini';
import { env } from '@/lib/env';
import { checkRateLimit, getClientIp, createRateLimitResponse } from '@/lib/rateLimit';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Meta WhatsApp Cloud API Webhook handshake verification
    if (mode === 'subscribe' && token) {
      if (token === env.WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge || '', { status: 200 });
      }
      return new Response('Forbidden', { status: 403 });
    }

    const messages = await db.getWhatsAppMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 120 webhook requests per minute per IP
    const rateCheck = checkRateLimit(`wa_${ip}`, { limit: 120, windowMs: 60000 });
    if (!rateCheck.success) {
      return createRateLimitResponse(rateCheck.reset);
    }
    const body = await req.json();

    // Check for Meta WhatsApp Cloud API status notification
    if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.statuses) {
      return NextResponse.json({ success: true, status: 'acknowledged' });
    }

    let text = body.text;
    let senderName = body.senderName;
    let senderPhone = body.senderPhone;

    // Parse Meta WhatsApp Cloud API incoming message format
    if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const changeVal = body.entry[0].changes[0].value;
      const metaMsg = changeVal.messages[0];
      const contact = changeVal.contacts?.[0];

      text = metaMsg.text?.body || metaMsg.button?.text || metaMsg.interactive?.button_reply?.title || (metaMsg.type === 'audio' ? 'Voice Note Audio (Transcribed)' : 'Media Message');
      senderPhone = `+${metaMsg.from}`;
      senderName = contact?.profile?.name || senderPhone;
    }

    if (!text) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const business = await db.getBusiness();

    // 1. Record incoming user message
    await db.addWhatsAppMessage({
      senderName: senderName || 'Business Contact',
      senderPhone: senderPhone || '+91 98111 22334',
      text,
      isBot: false,
    });

    // 2. Check if this is a live Business Intelligence query (Attendance by Name, Staff Location, Inventory Value, Bills by Name/Date)
    const intel = await db.queryBusinessIntelligence(text);
    let aiResult: any;

    if (intel.handled) {
      aiResult = {
        reply: intel.reply,
        intent: intel.type === 'attendance' || intel.type === 'location' ? 'employee_status' : intel.type === 'inventory' ? 'sales_inquiry' : 'bill_query',
        actionTaken: {
          type: `QUERY_${intel.type.toUpperCase()}`,
          details: intel.data,
        },
        suggestedAction: `Live ${intel.type} information fetched from BizzUp Database`,
        languageDetected: 'english',
      };
    } else {
      // Process with Gemini AI Agent
      aiResult = await processWhatsAppAgentMessage(
        text,
        senderName || 'Business Contact',
        senderPhone || '+91 98111 22334',
        business.name,
        business.subscriptionTier
      );
    }

    // 3. Execute platform operations based on intent
    if (aiResult.intent === 'employee_status' && !intel.handled) {
      const employees = await db.getEmployees();
      const matched = employees.find(
        (e) =>
          e.phone.includes(senderPhone?.replace(/\D/g, '') || '98111') ||
          e.name.toLowerCase().includes((senderName || '').toLowerCase())
      );
      const staffName = matched ? matched.name : (senderName || 'Site Staff');
      const staffRole = matched ? matched.role : 'Senior Site Project Engineer';
      const locMatch = text.match(/(?:at|in|near|site)\s+([A-Za-z0-9\s,]+?)(?:\.|$|,)/i);
      const location = locMatch ? locMatch[1].trim() : (matched ? matched.currentLocation : 'Sector 62 Site Yard, Noida');
      const projectTender = matched?.projectTender || (text.toLowerCase().includes('iocl') ? 'IOCL Panipat Refinery - Tender #IOCL-88' : 'Metro Rail Phase 4 - Tender #MR-402');
      const repManager = matched?.reportingManagerName || 'Rajesh Khanna (Senior Project Manager)';

      // Extract working hours & overtime if mentioned
      const hoursMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
      const otMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)?\s*(?:ot|overtime)/i);
      const workingHours = hoursMatch ? parseFloat(hoursMatch[1]) : (matched?.workingHoursToday || 8.5);
      const overtimeHours = otMatch ? parseFloat(otMatch[1]) : (matched?.overtimeHoursToday || 0);

      const baseWage = matched?.dailyWageRate || 950;
      const otPay = Math.round(overtimeHours * (matched?.overtimeRate || 140));
      const totalPay = baseWage + otPay;

      await db.addAttendanceRecord({
        employeeId: matched?.id,
        employeeName: staffName,
        role: staffRole,
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOutTime: '05:30 PM',
        workingHours,
        overtimeHours,
        status: 'on_site',
        location,
        projectTender,
        reportingManagerName: repManager,
        dailyWage: baseWage,
        overtimePay: otPay,
        totalPayable: totalPay,
        salaryStatus: 'pending',
        source: 'whatsapp',
        notes: text,
      });

      if (matched) {
        matched.workingHoursToday = workingHours;
        matched.overtimeHoursToday = overtimeHours;
        await db.updateEmployeeStatus(matched.id, 'on_site', location, text);
      } else if (employees.length > 0) {
        await db.updateEmployeeStatus(employees[0].id, 'on_site', location, text);
      }
    } else if (aiResult.intent === 'inventory_update') {
      const qtyMatch = text.match(/(\d+)\s*(?:units?|pcs?|bags?|mt|tonnes?|valves?|pumps?|pipes?)/i) || text.match(/\b(\d+)\b/);
      const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 30;
      const unitMatch = text.match(/\b(bags?|units?|pcs?|mt|tonnes?|boxes?|meters?)\b/i);
      const unit = unitMatch ? unitMatch[1].toLowerCase() : 'units';
      const priceMatch = text.match(/(?:@|₹|rs\.?|inr)\s*(\d[\d,]*)/i);
      const unitPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 3600;
      const totalVal = qty * unitPrice;
      const lower = text.toLowerCase();
      let itemName = 'Industrial Material Stock';
      if (lower.includes('cement')) itemName = 'Portland Pozzolana Cement 50kg Bags';
      else if (lower.includes('valve')) itemName = 'Forged Carbon Steel Ball Valves DN50';
      else if (lower.includes('pump')) itemName = 'Centrifugal Slurry Pumps 15HP';
      else if (lower.includes('pipe')) itemName = 'MS Seamless Flow Pipes (Schedule 40)';
      else if (lower.includes('steel') || lower.includes('tmt')) itemName = 'Fe550D TMT Reinforcement Steel';

      const warehouse = lower.includes('bhiwandi')
        ? 'Bhiwandi Central Logistics Hub'
        : lower.includes('pune')
        ? 'Bhosari Raw Yard, Pune'
        : 'Sector 62 Site Yard, Noida';

      await db.addInventoryItem({
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        name: itemName,
        category: itemName.toLowerCase().includes('pump') ? 'Industrial Pumps' : itemName.toLowerCase().includes('cement') ? 'Raw Materials' : 'Valves & Flow Controls',
        quantity: qty,
        unit,
        unitPrice,
        totalValue: totalVal,
        warehouseLocation: warehouse,
        status: 'in_stock',
      });
    } else if (aiResult.intent === 'sales_inquiry') {
      await db.addLead({
        clientName: senderName || 'Inbound Prospect',
        phone: senderPhone || '+91 99100 88201',
        source: 'whatsapp',
        productName: 'Industrial Valves & Pumps Requirement',
        quantity: 'Batch Requirement',
        estimatedValue: 240000,
        status: 'new',
        aiScore: 88,
        notes: `Inbound WhatsApp lead: "${text}"`,
      });
    } else if (aiResult.intent === 'report_submission') {
      await db.addReport({
        reporterName: senderName || 'Project Manager',
        reporterRole: 'project_manager',
        title: 'Daily WhatsApp Operations Summary',
        summary: text,
        risksAlerts: ['Review inspection timeline before scheduled audit'],
        aiActionItems: ['Update material dispatch status in warehouse inventory'],
        submissionChannel: 'whatsapp',
      });
    } else if (aiResult.intent === 'ai_call_request' && business.subscriptionTier === 'premium') {
      const callData = await generateAICallSimulation({
        recipientName: senderName || 'Hot Lead',
        phone: senderPhone || '+91 99100 88201',
        goal: 'lead_qualification',
        businessName: business.name,
      });

      await db.addCall({
        recipientName: senderName || 'Hot Lead',
        phone: senderPhone || '+91 99100 88201',
        direction: 'outbound',
        goal: 'lead_qualification',
        status: 'completed',
        durationSeconds: callData.durationSeconds,
        transcript: callData.transcript,
        summary: callData.summary,
        sentiment: callData.sentiment,
      });
    }

    // 4. Record Bot Reply
    const botMsg = await db.addWhatsAppMessage({
      senderName: `${business.name} AI Agent`,
      senderPhone: business.whatsappNumber,
      text: aiResult.reply,
      isBot: true,
      intent: aiResult.intent,
      metadata: {
        actionTaken: aiResult.actionTaken,
        suggestedAction: aiResult.suggestedAction,
      },
    });

    // 5. Outbound delivery to Meta Cloud API if credentials are configured
    const waToken = process.env.WHATSAPP_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    let metaDeliveryStatus = 'stored_in_neon';

    if (waToken && waPhoneId && senderPhone) {
      try {
        const cleanRecipient = senderPhone.replace(/\D/g, '');
        const metaRes = await fetch(`https://graph.facebook.com/v21.0/${waPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${waToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanRecipient,
            type: 'text',
            text: { preview_url: true, body: aiResult.reply },
          }),
        });
        if (metaRes.ok) {
          metaDeliveryStatus = 'dispatched_via_meta_cloud_api';
        }
      } catch (e) {
        console.warn('Outbound Meta WhatsApp delivery error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      reply: aiResult.reply,
      intent: aiResult.intent,
      actionTaken: aiResult.actionTaken,
      deliveryStatus: metaDeliveryStatus,
      message: botMsg,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
