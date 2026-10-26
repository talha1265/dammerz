import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const leads = await db.getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, lead } = body;

    if (action === 'sync_indiamart') {
      // Simulate live incoming webhook sync from IndiaMart lead manager API
      const newLead = await db.addLead({
        clientName: 'Dynamic Infrastructure & Fab',
        phone: '+91 97200 44109',
        source: 'indiamart',
        productName: 'Heavy Industrial Forged Flanges & Gate Valves',
        quantity: '200 Units',
        estimatedValue: 560000,
        status: 'new',
        aiScore: 92,
        notes: 'IndiaMart Direct BuyLead: "Urgent need for 200 forged flanges for thermal boiler plant. Immediate payment upon dispatch".',
      });
      return NextResponse.json({ success: true, lead: newLead, message: 'IndiaMart lead synced successfully' });
    }

    if (action === 'sync_google_shop') {
      // Simulate live Google Shopping / Merchant Center order/inquiry
      const newLead = await db.addLead({
        clientName: 'Apex Green Energy Ltd',
        phone: '+91 98450 12890',
        source: 'google_shop',
        productName: 'Solar Water Pump Inverter System 10HP',
        quantity: '10 Sets',
        estimatedValue: 420000,
        status: 'contacted',
        aiScore: 86,
        notes: 'Google Merchant Feed click-to-WhatsApp converted inquiry.',
      });
      return NextResponse.json({ success: true, lead: newLead, message: 'Google Shopping inquiry synced' });
    }

    if (action === 'create' && lead) {
      const created = await db.addLead(lead);
      return NextResponse.json({ success: true, lead: created });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
