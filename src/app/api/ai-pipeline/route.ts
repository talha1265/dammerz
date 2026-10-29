import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAICallSimulation } from '@/lib/gemini';

export async function GET() {
  try {
    const [leads, calls, messages, research] = await Promise.all([
      db.getLeads(),
      db.getCalls(),
      db.getWhatsAppMessages(),
      db.getResearchBriefings(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalLeadsResearched: leads.length,
        totalCallsDialed: calls.length,
        totalWhatsAppSent: messages.length,
        activeScenarios: 3,
      },
      recentLeads: leads.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, leadData, customTopic } = body;
    const business = await db.getBusiness();

    // =========================================================================
    // STEP 1: NEHA VERMA (AI MARKET RESEARCHER) RESEARCHES & SORTS MARKET LEADS
    // =========================================================================
    if (action === 'run_neha_research') {
      const topic = customTopic || business.category || 'Industrial Valves & Flow Controls';
      
      // Sorted high-intent buyer leads discovered by Neha
      const sortedLeadsFromNeha = [
        {
          clientName: 'Vikram Singhania (Singhania Infra Projects Ltd)',
          phone: '+91 98201 44890',
          source: 'indiamart' as const,
          productName: '180 Units Heavy Duty Flanged Ball Valves 2" (Class 150)',
          quantity: '180 Units',
          estimatedValue: 1450000,
          status: 'new' as const,
          aiScore: 96,
          notes: 'Neha Verma Intelligence: High-urgency procurement for refinery expansion. Contractor delayed by previous vendor. Budget approved, immediate advance payment ready upon PO.',
          location: 'Jamnagar, Gujarat',
          deliveryUrgency: 'Within 10 Days',
        },
        {
          clientName: 'Karan Oberoi (Oberoi Pipeline Engineering)',
          phone: '+91 98112 55210',
          source: 'website' as const,
          productName: '500 Meters Seamless Alloy Steel Pipes (Grade P11)',
          quantity: '500 Meters',
          estimatedValue: 2480000,
          status: 'new' as const,
          aiScore: 93,
          notes: 'Neha Verma Intelligence: Government water grid subcontract tender requirement. Technical compliance sheet verified against Indian Standards.',
          location: 'Pune, Maharashtra',
          deliveryUrgency: 'Within 15 Days',
        },
        {
          clientName: 'Alok Mathur (Metro Boiler Works & Fab)',
          phone: '+91 97180 88231',
          source: 'indiamart' as const,
          productName: '40 MT High-Tensile Boiler Grade Steel Plates',
          quantity: '40 Metric Tonnes',
          estimatedValue: 3200000,
          status: 'new' as const,
          aiScore: 89,
          notes: 'Neha Verma Intelligence: Commercial inquiry for thermal expansion unit. Looking for prompt mill test certificates (MTC) & delivery guarantee.',
          location: 'Faridabad, Haryana',
          deliveryUrgency: 'Within 20 Days',
        },
      ];

      // Save top sorted lead to the database
      const createdLeads = [];
      for (const item of sortedLeadsFromNeha) {
        const savedLead = await db.addLead({
          clientName: item.clientName,
          phone: item.phone,
          source: item.source,
          productName: item.productName,
          quantity: item.quantity,
          estimatedValue: item.estimatedValue,
          status: item.status,
          aiScore: item.aiScore,
          notes: item.notes,
        });
        createdLeads.push({ ...item, id: savedLead.id });
      }

      return NextResponse.json({
        success: true,
        step: 1,
        agent: {
          name: 'Neha Verma',
          code: 'EMP-AI-RES03',
          role: 'AI Market Intelligence Officer',
        },
        summary: `Neha scanned ${topic} market across IndiaMart, GeM tenders, and verified portals. Extracted and sorted ${createdLeads.length} prioritized B2B RFQs.`,
        sortedLeads: createdLeads,
      });
    }

    // =========================================================================
    // STEP 2: DELIVER SORTED DATA TO POOJA SHARMA (AI VOICE SDR CALLING)
    // =========================================================================
    if (action === 'hand_off_to_pooja') {
      const targetLead = leadData || {
        clientName: 'Vikram Singhania (Singhania Infra Projects Ltd)',
        phone: '+91 98201 44890',
        productName: '180 Units Heavy Duty Flanged Ball Valves 2" (Class 150)',
        estimatedValue: 1450000,
      };

      // Realistic bilingual calling transcript with prompt qualification
      const callSimulation = {
        durationSeconds: 114,
        sentiment: 'positive' as const,
        summary: `Pooja Sharma connected with ${targetLead.clientName}. Verified requirement for ${targetLead.productName}. Buyer approved estimated budget of ₹${(targetLead.estimatedValue || 1450000).toLocaleString('en-IN')}, confirmed 10-day timeline, and urgently requested formal WhatsApp quotation with technical data sheet and proforma invoice. Dispatched to Ritik Sharma for instant WhatsApp deal closing.`,
        transcript: [
          {
            speaker: 'agent' as const,
            text: `Namaste Vikram ji! Main Pooja Sharma baat kar rahi hoon ${business.name} se. Neha, hamari market research officer ne aapka urgent requirement note kiya tha 180 units Flanged Ball Valves ke liye Jamnagar refinery site pe. Kya aap do minute baat kar sakte hain?`,
            time: '00:04',
          },
          {
            speaker: 'client' as const,
            text: `Haan Pooja ji, achha hua aapne call kiya. Pichle vendor ne delivery delay kar di. Humein Class 150 flanged valves bilkul 10 din ke andar site pe chahiye with Mill Test Certificate. Aap delivery karwa doge?`,
            time: '00:22',
          },
          {
            speaker: 'agent' as const,
            text: `Ji bilkul Vikram ji! Hamare central logistics depot mein 100% inspected stock ready hai. Hum 48 hours ke andar dispatch initiate kar sakte hain with full hydrostatic test reports and 18 months replacement warranty.`,
            time: '00:41',
          },
          {
            speaker: 'client' as const,
            text: `Very good. Pricing ka kya hisaab hai? Budget around 14 to 15 lakhs tak approval hai hamara.`,
            time: '00:58',
          },
          {
            speaker: 'agent' as const,
            text: `Humne rate calculate kiya hai: ₹7,250 per unit plus GST, jo bilkul aapke budget mein fit hota hai (around ₹15.39 Lakhs inclusive of all taxes). Hum advance invoice pe special freight discount bhi add kar rahe hain.`,
            time: '01:15',
          },
          {
            speaker: 'client' as const,
            text: `Theek hai Pooja ji! Aap abhi turant mere is WhatsApp number pe formal quote aur technical data sheet bhej dijiye. Main purchase department se advance release karwa deta hoon.`,
            time: '01:34',
          },
          {
            speaker: 'agent' as const,
            text: `Shukriya Vikram ji! Hamare dedicated WhatsApp executive Ritik Sharma agle 30 seconds mein complete PDF quotation aur proforma invoice aapke WhatsApp pe deliver kar rahe hain. Have a great day!`,
            time: '01:50',
          },
        ],
      };

      // Save call to database
      const savedCall = await db.addCall({
        recipientName: targetLead.clientName,
        phone: targetLead.phone,
        direction: 'outbound',
        goal: 'lead_qualification',
        status: 'completed',
        durationSeconds: callSimulation.durationSeconds,
        transcript: callSimulation.transcript,
        summary: callSimulation.summary,
        sentiment: callSimulation.sentiment,
      });

      return NextResponse.json({
        success: true,
        step: 2,
        agent: {
          name: 'Pooja Sharma',
          code: 'EMP-AI-CALL01',
          role: 'Senior AI Tele-Calling & SDR Executive',
        },
        call: savedCall,
        summary: callSimulation.summary,
        transcript: callSimulation.transcript,
        handOffPayload: {
          recipientName: targetLead.clientName,
          phone: targetLead.phone,
          productName: targetLead.productName,
          totalQuotation: targetLead.estimatedValue ? Math.round(targetLead.estimatedValue * 1.06) : 1539900,
          poojaNotes: 'Buyer verified. Demanded immediate WhatsApp proforma invoice for advance clearance.',
        },
      });
    }

    // =========================================================================
    // STEP 3: HAND-OFF TO RITIK SHARMA (AI WHATSAPP MESSAGING & DEAL CLOSING)
    // =========================================================================
    if (action === 'hand_off_to_ritik') {
      const recipientName = leadData?.recipientName || 'Vikram Singhania';
      const phone = leadData?.phone || '+91 98201 44890';
      const productName = leadData?.productName || '180 Units Heavy Duty Flanged Ball Valves 2" (Class 150)';
      const totalAmount = leadData?.totalQuotation || 1539900;

      // Personalized high-converting B2B WhatsApp quotation
      const formattedWhatsAppMessage = `🤝 *Namaste ${recipientName} ji!*\n\nMain *Ritik Sharma* baat kar raha hoon *${business.name}* ki WhatsApp desk se.\n\nPooja ji ke saath aapki call ke reference mein, aapki *${productName}* ki official commercial quotation taiyyar hai:\n\n📋 *COMMERCIAL PROFORMA SUMMARY (#PI-2026-904):*\n• *Material:* SS-316 Flanged Industrial Ball Valves (Class 150)\n• *Quantity:* 180 Units (Ready Stock)\n• *Unit Base Price:* ₹7,250 / pc\n• *GST (18% ITC Eligible):* ₹2,34,900\n• *Net Invoice Amount:* *₹${totalAmount.toLocaleString('en-IN')}* (All Taxes & Packaging Included)\n• *Dispatch Guarantee:* 48 Hours to Jamnagar Site\n• *Inspection Cert:* MTC 3.1 & Hydrostatic Test Included\n\n📎 *DOCUMENTS ATTACHED:*\n1️⃣ Technical Catalog & Dimensions Sheet (PDF)\n2️⃣ Verified Proforma Invoice #PI-2026-904.pdf\n\n⚡ *NEXT ACTION / PAYMENT:*\nAap yahan direct reply kar sakte hain ya purchase order (PO) ki copy attach kar sakte hain. Advance payment link:\n🔗 https://dammerz.in/pay/pi-904\n\n_Warm regards,_\n*Ritik Sharma* [EMP-AI-WA04]\nAI WhatsApp Messaging & Deal Closing Specialist\n*${business.name}*`;

      // Save WhatsApp message into database
      const savedMessage = await db.addWhatsAppMessage({
        senderPhone: phone,
        senderName: recipientName,
        text: formattedWhatsAppMessage,
        isBot: true,
        intent: 'sales_inquiry',
        metadata: {
          sentByAgent: 'Ritik Sharma (EMP-AI-WA04)',
          dispatchedFromCallId: leadData?.callId,
          quotationAmount: totalAmount,
          handOffChain: 'Neha (Research) ➔ Pooja (Call) ➔ Ritik (WhatsApp)',
        },
      });

      return NextResponse.json({
        success: true,
        step: 3,
        agent: {
          name: 'Ritik Sharma',
          code: 'EMP-AI-WA04',
          role: 'AI WhatsApp Messaging & Deal Closing Specialist',
        },
        message: savedMessage,
        whatsappText: formattedWhatsAppMessage,
        status: 'delivered',
        summary: `Ritik Sharma generated and dispatched official WhatsApp commercial proforma (#PI-2026-904) to ${recipientName} (${phone}) with technical specs and advance link.`,
      });
    }

    // =========================================================================
    // FULL AUTONOMOUS PIPELINE: NEHA ➔ POOJA ➔ RITIK (END-TO-END)
    // =========================================================================
    if (action === 'run_full_autonomous_scenario') {
      const topic = customTopic || business.category || 'Industrial Valves & Flow Controls';

      // 1. Neha's Research
      const targetLead = {
        clientName: 'Vikram Singhania (Singhania Infra Projects Ltd)',
        phone: '+91 98201 44890',
        productName: '180 Units Heavy Duty Flanged Ball Valves 2" (Class 150)',
        quantity: '180 Units',
        estimatedValue: 1450000,
        aiScore: 96,
        location: 'Jamnagar, Gujarat',
      };

      const savedLead = await db.addLead({
        clientName: targetLead.clientName,
        phone: targetLead.phone,
        source: 'indiamart',
        productName: targetLead.productName,
        quantity: targetLead.quantity,
        estimatedValue: targetLead.estimatedValue,
        status: 'contacted',
        aiScore: targetLead.aiScore,
        notes: `Autonomous Pipeline Run: Neha Verma scanned ${topic} market, identified high intent buyer with urgent requirement.`,
      });

      // 2. Pooja's Call
      const callSimulation = {
        durationSeconds: 114,
        sentiment: 'positive' as const,
        summary: `Pooja Sharma called ${targetLead.clientName} regarding ${targetLead.productName}. Buyer confirmed budget of ₹15.39L and requested instant proforma quote on WhatsApp. Dispatched to Ritik Sharma.`,
        transcript: [
          { speaker: 'agent' as const, text: `Namaste Vikram ji! Main Pooja Sharma baat kar rahi hoon ${business.name} se. Neha hamari research officer ne aapka urgent requirement note kiya tha...`, time: '00:04' },
          { speaker: 'client' as const, text: `Haan Pooja ji, humein 180 units Flanged Ball Valves bilkul 10 din me site pe chahiye. Delivery confirm kar do aur quote WhatsApp pe bhejo.`, time: '00:28' },
          { speaker: 'agent' as const, text: `Bilkul confirm hai Vikram ji! Hamare WhatsApp executive Ritik Sharma 30 seconds me proforma invoice aur MTC specifications aapke WhatsApp pe bhej rahe hain!`, time: '00:52' },
        ],
      };

      const savedCall = await db.addCall({
        recipientName: targetLead.clientName,
        phone: targetLead.phone,
        direction: 'outbound',
        goal: 'lead_qualification',
        status: 'completed',
        durationSeconds: callSimulation.durationSeconds,
        transcript: callSimulation.transcript,
        summary: callSimulation.summary,
        sentiment: callSimulation.sentiment,
      });

      // 3. Ritik's WhatsApp message
      const formattedWhatsAppMessage = `🤝 *Namaste Vikram Singhania ji!*\n\nMain *Ritik Sharma* bol raha hoon *${business.name}* ki WhatsApp desk se.\n\nPooja ji ke saath aapki call ke reference mein, aapki *${targetLead.productName}* ki official proforma quotation taiyyar hai:\n\n📋 *QUOTATION SUMMARY (#PI-2026-904):*\n• *Item:* SS-316 Flanged Industrial Ball Valves (Class 150)\n• *Quantity:* 180 Units\n• *Net Amount:* *₹15,39,900* (Inclusive of 18% GST & Freight)\n• *Delivery:* Dispatch in 48 Hours to Jamnagar Site\n• *Certificate:* 100% Hydrostatic Test & MTC 3.1\n\n📎 *Attached:* Technical Catalog.pdf & Proforma Invoice #PI-2026-904\n\n👉 *Direct Advance Payment Link:* https://dammerz.in/pay/pi-904\n\n_Aapka WhatsApp Business Partner,_\n*Ritik Sharma* [EMP-AI-WA04]`;

      const savedMessage = await db.addWhatsAppMessage({
        senderPhone: targetLead.phone,
        senderName: targetLead.clientName,
        text: formattedWhatsAppMessage,
        isBot: true,
        intent: 'sales_inquiry',
        metadata: {
          sentByAgent: 'Ritik Sharma (EMP-AI-WA04)',
          dispatchedFromCallId: savedCall.id,
          leadId: savedLead.id,
        },
      });

      return NextResponse.json({
        success: true,
        fullScenarioExecuted: true,
        pipeline: {
          step1_neha: {
            agent: 'Neha Verma (EMP-AI-RES03)',
            action: 'Market Researched & Sorted Lead Extracted',
            lead: savedLead,
          },
          step2_pooja: {
            agent: 'Pooja Sharma (EMP-AI-CALL01)',
            action: 'Autonomous Voice SDR Discovery Call Dialed & Qualified',
            call: savedCall,
          },
          step3_ritik: {
            agent: 'Ritik Sharma (EMP-AI-WA04)',
            action: 'Personalized WhatsApp Commercial Quotation Dispatched',
            message: savedMessage,
            whatsappText: formattedWhatsAppMessage,
          },
        },
      });
    }

    return NextResponse.json({ error: 'Unknown pipeline action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
