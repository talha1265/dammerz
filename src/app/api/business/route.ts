import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const business = await db.getBusiness();
    return NextResponse.json({ success: true, business });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, tier, businessDetails } = body;

    if (action === 'update_tier') {
      const updated = await db.updateBusinessTier(tier);
      return NextResponse.json({ success: true, business: updated });
    }

    if (action === 'update_profile') {
      const updated = await db.updateBusinessProfile('', body.profile || {});
      return NextResponse.json({ success: true, business: updated });
    }

    if (action === 'onboard') {
      const newBusiness = await db.createBusiness({
        name: businessDetails.name || 'New Enterprise Client',
        category: businessDetails.category || 'General Manufacturing',
        phone: businessDetails.phone || '+91 98000 00000',
        email: businessDetails.email || 'operations@client.com',
        whatsappNumber: businessDetails.whatsappNumber || businessDetails.phone || '+91 98000 00000',
        gstNumber: businessDetails.gstNumber || 'GST-PENDING',
        address: businessDetails.address || 'Corporate Facility',
        subscriptionTier: businessDetails.subscriptionTier || 'growth',
        catalogSize: Number(businessDetails.catalogSize) || 50,
      });

      // Provision initial owner staff account for them
      await db.addEmployee({
        name: businessDetails.name.split(' ')[0] + ' (Owner)',
        role: 'Managing Director & Business Owner',
        roleCategory: 'business_owner',
        siteName: 'Corporate Headquarters',
        phone: businessDetails.phone || '+91 98000 00000',
        businessId: newBusiness.id,
      });

      return NextResponse.json({ success: true, business: newBusiness });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
