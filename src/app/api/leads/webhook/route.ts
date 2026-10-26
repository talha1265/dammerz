import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processWhatsAppAgentMessage } from '@/lib/gemini';

// IndiaMart & Omnichannel CRM Buy-Lead Push Webhook Endpoint
// Compatible with IndiaMart CRM Push API, Google Forms, TradeIndia, and Custom Webhooks
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any = {};

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = value.toString();
      });
    } else {
      payload = await req.json().catch(() => ({}));
    }

    // IndiaMart Push API fields mapping with universal fallback
    const clientName = 
      payload.SENDER_NAME || 
      payload.sender_name || 
      payload.clientName || 
      payload.name || 
      'Verified IndiaMart Buyer';

    const phone = 
      payload.SENDER_MOBILE || 
      payload.sender_phone || 
      payload.mobile || 
      payload.phone || 
      '+91 99100 00000';

    const productName = 
      payload.QUERY_PRODUCT_NAME || 
      payload.product_name || 
      payload.productName || 
      payload.subject || 
      'Industrial Equipment & Supplies';

    const quantity = 
      payload.QUANTITY || 
      payload.quantity || 
      payload.qty || 
      'Bulk / Commercial Order';

    const notes = 
      payload.QUERY_MESSAGE || 
      payload.message || 
      payload.notes || 
      `Inbound buy lead for ${productName} (${quantity})`;

    const source = (payload.source || payload.SOURCE || 'indiamart').toLowerCase();

    // AI Hotness Scoring (Higher for specific SKU inquiries and phone numbers)
    let aiScore = 78;
    if (phone && phone.length >= 10) aiScore += 10;
    if (quantity && (quantity.includes('Unit') || quantity.includes('Ton') || quantity.includes('100') || quantity.includes('50'))) aiScore += 8;
    if (notes && notes.length > 20) aiScore += 4;
    aiScore = Math.min(aiScore, 98);

    const business = await db.getBusiness();

    // 1. Ingest Lead into Neon PostgreSQL
    const newLead = await db.addLead({
      clientName,
      phone: phone.startsWith('+') ? phone : `+91 ${phone}`,
      source: source as any,
      productName,
      quantity,
      estimatedValue: payload.estimatedValue || (aiScore > 85 ? 320000 : 150000),
      status: 'new',
      aiScore,
      notes,
    });

    // 2. Generate Autonomous AI Quotation & Instant WhatsApp Dispatch
    const quotePrompt = `Generate a 30-second rapid professional quotation for a hot B2B buyer inquiry:
Buyer: ${clientName}
Product: ${productName}
Quantity: ${quantity}
Requirement: ${notes}
Company: ${business.name}`;

    const aiQuote = await processWhatsAppAgentMessage(
      quotePrompt,
      clientName,
      phone,
      business.name,
      business.subscriptionTier
    );

    // 3. Log Outbound WhatsApp message
    await db.addWhatsAppMessage({
      senderName: `${business.name} Sales AI`,
      senderPhone: business.whatsappNumber,
      text: aiQuote.reply || `Namaste ${clientName},\nThank you for your IndiaMart inquiry for *${productName}* (${quantity}). Our quotation has been drafted and our team is ready to dispatch material test certificates.`,
      isBot: true,
      intent: 'sales_inquiry',
      metadata: {
        leadId: newLead.id,
        autoDispatched: true,
        channel: 'indiamart_instant_quote',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead successfully ingested into BizzUp Pipeline & instant WhatsApp quote dispatched.',
      lead: newLead,
      quotationReply: aiQuote.reply,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/leads/webhook',
    protocol: 'IndiaMart Push API v2 & Omnichannel CRM Webhook',
    supportedSources: ['indiamart', 'tradeindia', 'justdial', 'google_shop', 'meta_ads'],
  });
}
