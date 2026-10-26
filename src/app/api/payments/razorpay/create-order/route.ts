import { NextResponse } from 'next/server';
import crypto from 'crypto';

const PLAN_PRICING: Record<string, { amount: number; name: string }> = {
  starter: { amount: 399900, name: 'Dammerz Starter Business' }, // In paise (₹3,999)
  growth: { amount: 999900, name: 'Dammerz Growth Enterprise' }, // In paise (₹9,999)
  premium: { amount: 1999900, name: 'Dammerz Premium Autonomous Suite' }, // In paise (₹19,999)
};

export async function POST(req: Request) {
  try {
    const { businessId, tier = 'starter', customerEmail, customerPhone } = await req.json();

    const plan = PLAN_PRICING[tier] || PLAN_PRICING.starter;
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay keys are provided, invoke Razorpay Orders API
    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const orderPayload = {
        amount: plan.amount,
        currency: 'INR',
        receipt: `rcpt_${businessId?.slice(0, 8) || 'bz'}_${Date.now().toString().slice(-6)}`,
        notes: {
          businessId: businessId || 'unassigned',
          tier,
          planName: plan.name,
        },
      };

      const rzResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!rzResponse.ok) {
        const errorText = await rzResponse.text();
        console.error('Razorpay Order Creation API Error:', errorText);
        return NextResponse.json(
          { success: false, error: 'Payment gateway rejected order creation. Please check API credentials.' },
          { status: 502 }
        );
      }

      const orderData = await rzResponse.json();
      return NextResponse.json({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId,
        tier,
        planName: plan.name,
        isLive: true,
      });
    }

    // Sandbox / Test fallback if keys have not yet been placed in .env
    const simulatedOrderId = `order_test_${crypto.randomBytes(8).toString('hex')}`;
    return NextResponse.json({
      success: true,
      orderId: simulatedOrderId,
      amount: plan.amount,
      currency: 'INR',
      keyId: keyId || 'rzp_test_simulated_placeholder',
      tier,
      planName: plan.name,
      isLive: false,
      notice: 'Running in simulated sandbox test mode until live RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET are added to .env.local',
    });
  } catch (error: any) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while creating payment order.' },
      { status: 500 }
    );
  }
}
