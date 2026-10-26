import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAICallSimulation } from '@/lib/gemini';

export async function GET() {
  try {
    const calls = await db.getCalls();
    const business = await db.getBusiness();
    return NextResponse.json({
      success: true,
      calls,
      subscriptionTier: business.subscriptionTier,
      isPremium: business.subscriptionTier === 'premium',
      callsUsed: business.monthlyQuota.aiCallsUsed,
      callsLimit: business.monthlyQuota.aiCalls,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipientName, phone, goal } = body;

    const business = await db.getBusiness();

    // Enforce subscription tier gate: AI Calling is ONLY available on Premium subscription!
    if (business.subscriptionTier !== 'premium') {
      return NextResponse.json(
        {
          error: 'AI Voice Calling is an exclusive Premium Subscription feature. Please upgrade your business plan to unlock autonomous voice agents.',
          requiresUpgrade: true,
          currentTier: business.subscriptionTier,
        },
        { status: 403 }
      );
    }

    if (!recipientName || !phone) {
      return NextResponse.json({ error: 'Recipient name and phone number are required' }, { status: 400 });
    }

    // Generate dynamic AI Call transcript & evaluation
    const callResult = await generateAICallSimulation({
      recipientName,
      phone,
      goal: goal || 'lead_qualification',
      businessName: business.name,
    });

    const newCall = await db.addCall({
      recipientName,
      phone,
      direction: 'outbound',
      goal: goal || 'lead_qualification',
      status: 'completed',
      durationSeconds: callResult.durationSeconds,
      transcript: callResult.transcript,
      summary: callResult.summary,
      sentiment: callResult.sentiment,
    });

    return NextResponse.json({
      success: true,
      call: newCall,
      message: `AI Voice Call completed with ${recipientName}. Summary & audio transcript recorded.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
