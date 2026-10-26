import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const connectors = await db.getMarketingConnectors();
    return NextResponse.json({ success: true, connectors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    const updated = await db.updateConnector(id, updates);
    return NextResponse.json({ success: true, connector: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
