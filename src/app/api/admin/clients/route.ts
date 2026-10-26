import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { env } from '@/lib/env';

export async function GET() {
  try {
    const clients = await db.getAllBusinesses();
    const stats = await db.getAdminStats();
    return NextResponse.json({ success: true, clients, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, clientId, status, tier, pin } = body;

    // Verify Admin PIN
    if (action === 'verify_pin') {
      const configuredPin = process.env.ADMIN_SECURITY_PIN || env.ADMIN_SECURITY_PIN;
      // In production, strictly enforce configured environment PIN without hardcoded bypasses
      const isValid = Boolean(configuredPin && pin === configuredPin);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid Administrator Security PIN' }, { status: 401 });
      }
      return NextResponse.json({ success: true, token: `admin_session_${Date.now()}` });
    }

    if (action === 'update_status') {
      const updated = await db.updateBusinessStatus(clientId, status);
      return NextResponse.json({ success: true, client: updated });
    }

    if (action === 'update_tier') {
      const updated = await db.updateBusinessTier(tier, clientId);
      return NextResponse.json({ success: true, client: updated });
    }

    if (action === 'switch_active') {
      db.setActiveBusiness(clientId);
      const activeBiz = await db.getBusiness(clientId);
      return NextResponse.json({ success: true, activeBusiness: activeBiz });
    }

    return NextResponse.json({ error: 'Unknown admin action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
