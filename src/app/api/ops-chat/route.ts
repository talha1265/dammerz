import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (query) {
      const intel = await db.queryBusinessIntelligence(query);
      return NextResponse.json({ success: true, result: intel });
    }

    const [messages, inventory, attendance, bills] = await Promise.all([
      db.getTeamChat(),
      db.getInventory(),
      db.getAttendance(),
      db.getBills(),
    ]);

    const inventorySummary = await db.getInventorySummary();

    return NextResponse.json({
      success: true,
      messages,
      inventory,
      attendance,
      bills,
      inventorySummary,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderName, senderRole, text, category } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const result = await db.parseAndExecuteOpsChat(
      senderName || 'Staff Member',
      senderRole || 'staff',
      text,
      category
    );

    return NextResponse.json({
      success: true,
      userMsg: result.userMsg,
      botReply: result.botReply,
      action: result.action,
      data: result.data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
