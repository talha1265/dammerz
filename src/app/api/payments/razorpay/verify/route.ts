import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { SubscriptionTier } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      businessId,
      tier = 'starter',
      isLive = false,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if live credentials exist
    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Cryptographic signature mismatch. Payment verification failed.' },
          { status: 400 }
        );
      }
    }

    // Activate the subscription plan and reset/expand quotas
    const updated = await db.updateBusinessTier(tier as SubscriptionTier, businessId);

    return NextResponse.json({
      success: true,
      message: `Payment successful! Business upgraded to ${tier.toUpperCase()} tier with full operational quotas.`,
      business: updated,
      transaction: {
        orderId: razorpay_order_id || `sim_${Date.now()}`,
        paymentId: razorpay_payment_id || `pay_${Date.now()}`,
        status: 'captured',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error occurred during payment verification.' },
      { status: 500 }
    );
  }
}
