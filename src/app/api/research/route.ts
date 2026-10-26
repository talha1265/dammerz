import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const research = await db.getResearchBriefings();
    return NextResponse.json({ success: true, research });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
