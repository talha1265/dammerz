import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { SubscriptionTier } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('Invalid Razorpay webhook signature received.');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const event = payload.event;

    console.log(`Razorpay Webhook Event Received: ${event}`);

    if (event === 'order.paid' || event === 'payment.captured' || event === 'subscription.charged') {
      const paymentEntity = payload.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const businessId = notes.businessId;
      const tier = (notes.tier as SubscriptionTier) || 'growth';

      if (businessId) {
        await db.updateBusinessTier(tier, businessId);
        console.log(`Webhook successfully renewed/activated ${tier} tier for business ${businessId}`);
      }
    }

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
