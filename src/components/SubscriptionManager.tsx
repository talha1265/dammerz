'use client';

import React, { useState } from 'react';
import { 
  Check, 
  X,
  Sparkles, 
  Zap, 
  PhoneCall, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Video 
} from 'lucide-react';
import { Business, SubscriptionTier } from '@/lib/types';

interface SubscriptionManagerProps {
  business: Business;
  onRefresh: () => void;
}

export default function SubscriptionManager({ business, onRefresh }: SubscriptionManagerProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testModalOrder, setTestModalOrder] = useState<any | null>(null);

  // Helper to load Razorpay checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectTier = async (tier: SubscriptionTier) => {
    setUpdating(tier);
    setNotice(null);
    try {
      // 1. Create Order via Razorpay Order API
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          tier,
          customerEmail: business.email,
          customerPhone: business.phone,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      // 2. If live Razorpay credentials exist, open Razorpay Checkout modal
      if (orderData.isLive) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Could not load Razorpay payment gateway script. Please verify your internet connection.');
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Dammerz AI Operations Suite',
          description: `Subscription Upgrade to ${orderData.planName}`,
          order_id: orderData.orderId,
          prefill: {
            name: business.name,
            email: business.email,
            contact: business.phone,
          },
          theme: {
            color: '#25d366',
          },
          handler: async (response: any) => {
            // Verify payment
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                businessId: business.id,
                tier,
                isLive: true,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setNotice({
                type: 'success',
                text: `Payment Confirmed! Your subscription is now upgraded to ${tier.toUpperCase()}. Transaction ID: ${response.razorpay_payment_id}`,
              });
              onRefresh();
            } else {
              setNotice({ type: 'error', text: verifyData.error || 'Payment verification failed.' });
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setUpdating(null);
        return;
      }

      // 3. If running in simulated test mode (Razorpay keys not yet provided)
      setTestModalOrder(orderData);
    } catch (e: any) {
      console.error('Payment checkout error:', e);
      setNotice({ type: 'error', text: e.message || 'Error initializing subscription checkout.' });
    } finally {
      setUpdating(null);
    }
  };

  const handleConfirmTestPayment = async () => {
    if (!testModalOrder) return;
    setUpdating(testModalOrder.tier);
    try {
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: testModalOrder.orderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'simulated_signature_valid',
          businessId: business.id,
          tier: testModalOrder.tier,
          isLive: false,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setNotice({
          type: 'success',
          text: `Plan activated! Upgraded to ${testModalOrder.tier.toUpperCase()} with full quotas. (Simulated test transaction recorded)`,
        });
        setTestModalOrder(null);
        onRefresh();
      } else {
        setNotice({ type: 'error', text: verifyData.error || 'Verification error' });
      }
    } catch (e: any) {
      setNotice({ type: 'error', text: e.message || 'Payment simulation error' });
    } finally {
      setUpdating(null);
    }
  };

  const callingMinsTotal = business.monthlyQuota.aiCallingMinutes ?? (
    business.subscriptionTier === 'premium' ? 600 : business.subscriptionTier === 'growth' ? 120 : 0
  );
  const callingMinsUsed = business.monthlyQuota.aiCallingMinutesUsed ?? 0;

  const plans = [
    {
      id: 'starter' as SubscriptionTier,
      name: 'Starter Business',
      tagline: 'Ideal for small businesses automating staff check-ins & customer WhatsApp FAQ',
      price: '₹3,999',
      period: '/month',
      badge: 'Starter',
      accent: 'var(--brand-whatsapp)',
      voiceMinutes: '0 Voice Mins (Chatbot only)',
      features: [
        '24/7 WhatsApp Business Bot (Bilingual Hinglish & English)',
        'Staff ID & Password Generator for site laborers & staff',
        'Mobile Check-in & Duty Status Logs via Chatbot',
        '2,000 WhatsApp Operations Messages / month',
        'Bills & GST Expense Ingestion',
        'Catalog FAQ & Instant Customer Product Lookup',
        'Standard Email & Ticket Support',
      ],
      notIncluded: [
        'No Autonomous AI Voice Calling',
        'No IndiaMart / Google Merchant Lead Sync',
        'No Meta Video Ads AI',
      ],
    },
    {
      id: 'growth' as SubscriptionTier,
      name: 'Growth Enterprise',
      tagline: 'For manufacturers & contractors scaling sales, field labor & lead response',
      price: '₹9,999',
      period: '/month',
      badge: 'Most Popular',
      accent: 'var(--brand-primary)',
      voiceMinutes: '120 Minutes (2 Hours) Included',
      features: [
        'Everything in Starter Plan',
        '120 Minutes (2 Hours) of Autonomous AI Voice Calling',
        'Inbound & Outbound Calling for Lead Qualification',
        'IndiaMart Direct BuyLead Auto-Sync & Instant Quotation',
        'Google Merchant & Shopping Feed Connector',
        '10,000 WhatsApp Messages / month',
        'Tender Reports & Gemini AI Risk Alerts Digest',
        'Multi-Site Attendance & Labor Inspection Tracking',
        'Excel & GST ITC Accounts Reconciliation Export',
      ],
      notIncluded: [
        'No Autonomous Meta Video Ads Autopilot',
      ],
    },
    {
      id: 'premium' as SubscriptionTier,
      name: 'Premium Autonomous Suite',
      tagline: 'Full AI Autopilot: Meta Video Ads, Deep Voice Dialing & Dedicated Ops Desk',
      price: '₹19,999',
      period: '/month',
      badge: 'Full Autopilot',
      accent: 'var(--brand-amber)',
      voiceMinutes: '600 Minutes (10 Hours) Included',
      features: [
        'Everything in Growth Plan',
        '600 Minutes (10 Hours) of Autonomous AI Voice Calling',
        'Meta Video Ads AI Autonomous Manager (Reels & Feed Creative)',
        'Click-to-WhatsApp Video Ads & AI Budget Scaling',
        '35,000 WhatsApp Messages / month',
        '1,000 Tender & Project Reports with Executive Summaries',
        'Autonomous Follow-up on Overdue Invoices & PO Verification',
        'Custom Webhooks for IndiaMart, TradeIndia & GeM Portal',
        'Dedicated Cloud Pipeline & Priority 24/7 SLA',
      ],
      notIncluded: [],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {notice && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: notice.type === 'success' ? 'rgba(37, 211, 102, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: notice.type === 'success' ? '1px solid rgba(37, 211, 102, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
          color: notice.type === 'success' ? 'var(--brand-whatsapp)' : '#ef4444',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          {notice.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Current Quota Consumption Meters */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-main)' }}>
            <CreditCard size={20} color="var(--brand-whatsapp)" />
            Active Subscription & Usage Quota
          </h3>
          <span className="badge badge-premium" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {business.subscriptionTier} PLAN ACTIVE
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          
          {/* WhatsApp Messages Meter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>WhatsApp Messages</span>
              <strong style={{ color: 'var(--text-main)' }}>
                {business.monthlyQuota.whatsappMessagesUsed} / {business.monthlyQuota.whatsappMessages}
              </strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(128, 128, 128, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (business.monthlyQuota.whatsappMessagesUsed / Math.max(1, business.monthlyQuota.whatsappMessages)) * 100)}%`,
                height: '100%',
                background: 'var(--brand-whatsapp)',
              }} />
            </div>
          </div>

          {/* AI Voice Calling Minutes Meter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>AI Voice Calling Time</span>
              <strong style={{ color: callingMinsTotal > 0 ? 'var(--brand-amber)' : 'var(--text-dim)' }}>
                {callingMinsUsed} / {callingMinsTotal} Minutes
              </strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(128, 128, 128, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${callingMinsTotal > 0 ? Math.min(100, (callingMinsUsed / callingMinsTotal) * 100) : 0}%`,
                height: '100%',
                background: 'var(--brand-amber)',
              }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              {business.subscriptionTier === 'starter' ? 'Upgrade to Growth (120m) or Premium (600m) to unlock Voice AI' : `${callingMinsTotal - callingMinsUsed} minutes remaining this cycle`}
            </div>
          </div>

          {/* Tender & Project Reports Meter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tender & Manager Reports</span>
              <strong style={{ color: 'var(--text-main)' }}>
                {business.monthlyQuota.managerReportsUsed} / {business.monthlyQuota.managerReports}
              </strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(128, 128, 128, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (business.monthlyQuota.managerReportsUsed / Math.max(1, business.monthlyQuota.managerReports)) * 100)}%`,
                height: '100%',
                background: 'var(--brand-primary-light)',
              }} />
            </div>
          </div>

        </div>
      </div>

      {/* Plan Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
        {plans.map((p) => {
          const isCurrent = business.subscriptionTier === p.id;
          return (
            <div
              key={p.id}
              className="vibe-card"
              style={{
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCurrent ? `2px solid ${p.accent}` : '1px solid var(--border-subtle)',
                background: isCurrent ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-card)',
                position: 'relative',
                borderRadius: '16px',
              }}
            >
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: p.accent,
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  Current Active Plan
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>{p.name}</h3>
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>{p.badge}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', minHeight: '36px' }}>
                  {p.tagline}
                </p>

                {/* Voice Calling Minutes Highlight */}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--brand-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '16px',
                }}>
                  <PhoneCall size={14} />
                  <span>{p.voiceMinutes}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '22px' }}>
                  <span style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-main)' }}>{p.price}</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>{p.period}</span>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {p.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                      <Check size={16} color="var(--brand-whatsapp)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {p.notIncluded.map((notFeat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      <X size={14} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '3px' }} />
                      <span>{notFeat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => handleSelectTier(p.id)}
                  disabled={isCurrent || updating === p.id}
                  className={p.id === 'premium' ? 'btn btn-premium' : p.id === 'growth' ? 'btn btn-primary' : 'btn btn-whatsapp'}
                  style={{ width: '100%', padding: '12px', fontWeight: 700 }}
                >
                  {updating === p.id ? (
                    'Switching Plan...'
                  ) : isCurrent ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Check size={16} /> Current Plan Active
                    </span>
                  ) : (
                    `Switch to ${p.name}`
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Payment Security & Trust Banner */}
      <div className="vibe-card" style={{ padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(37, 211, 102, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="var(--brand-whatsapp)" />
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.96rem' }}>
              Bank-Grade Payment Security & GST Compliance
            </strong>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              100% Secure Checkout via Razorpay. UPI (GooglePay, PhonePe, Paytm), All Major Debit/Credit Cards, NetBanking, and Corporate Invoicing accepted.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="var(--brand-whatsapp)" /> 7-Day Money Back Guarantee
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="var(--brand-whatsapp)" /> GST Input Tax Credit (ITC)
          </span>
        </div>
      </div>

      {/* Simulated / Test Payment Modal (Shown when RAZORPAY_KEY_ID is not configured in .env yet) */}
      {testModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div className="vibe-card" style={{ maxWidth: '480px', width: '100%', padding: '32px', position: 'relative' }}>
            <button
              onClick={() => setTestModalOrder(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={20} color="var(--brand-whatsapp)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Subscription Checkout</h3>
                <span className="badge badge-amber" style={{ fontSize: '0.68rem', marginTop: '3px' }}>
                  TEST / SANDBOX READY
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              {testModalOrder.notice}
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Plan:</span>
                <strong style={{ color: 'var(--text-main)' }}>{testModalOrder.planName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--brand-amber)' }}>{testModalOrder.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Total Amount:</span>
                <strong style={{ color: 'var(--brand-whatsapp)', fontSize: '1.15rem' }}>
                  ₹{(testModalOrder.amount / 100).toLocaleString('en-IN')} / month
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleConfirmTestPayment}
                disabled={Boolean(updating)}
                className="btn btn-whatsapp"
                style={{ width: '100%', padding: '12px', fontWeight: 700 }}
              >
                {updating ? 'Activating Plan...' : 'Confirm Test Payment (Instant Sandbox Upgrade)'}
              </button>
              <button
                onClick={() => setTestModalOrder(null)}
                className="btn btn-outline"
                style={{ width: '100%', padding: '10px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
