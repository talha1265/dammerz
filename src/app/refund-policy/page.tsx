import React from 'react';
import Link from 'next/link';
import { Bot, ArrowLeft, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Cancellation and Refund Policy — Dammerz AI',
  description: 'Cancellation and Refund Policy for Dammerz subscription tiers.',
};

export default function RefundPolicyPage() {
  return (
    <div className="vibe-bg-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="top-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-main)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="#fff" />
            </div>
            <span className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              Dammerz<span style={{ color: 'var(--brand-whatsapp)' }}>.ai</span>
            </span>
          </Link>
          <Link href="/" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Customer Assurance
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-main)' }}>
            Cancellation & Refund Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Last Updated: January 2026 • Clear, Fair & Transparent SaaS Refund Policy
          </p>
        </div>

        <div className="vibe-card" style={{ padding: '36px', lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--brand-whatsapp)" /> 1. Subscription Cancellation
            </h2>
            <p>
              At <strong>Dammerz</strong>, we believe in giving our business clients full flexibility. You may cancel your subscription at any time directly through your Dammerz Dashboard under <strong>Settings &rarr; Active Subscription</strong> or by emailing us at <strong>billing@dammerz.in</strong>.
            </p>
            <p style={{ marginTop: '8px' }}>
              Upon cancellation, your subscription will remain active until the end of your current paid billing period. You will retain full access to your WhatsApp bots, staff attendance logs, and reports until that date. No further renewal charges will be applied.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} color="var(--brand-primary-light)" /> 2. 7-Day Money-Back Guarantee
            </h2>
            <p>
              We want you to be completely confident in Dammerz. If you are a new subscriber to any of our paid plans (Starter, Growth, or Premium) and find that the platform does not meet your business operational requirements, you are eligible for a <strong>100% full refund</strong> within <strong>7 days</strong> of your initial purchase date.
            </p>
            <p style={{ marginTop: '8px' }}>
              To claim your 7-day refund, simply send an email to <strong>refunds@dammerz.in</strong> with your registered business phone number and reason for cancellation. We will process your refund without complicated conditions.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              3. Refund Processing Timelines
            </h2>
            <p>
              Once your refund request is received and approved by our billing desk:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Refunds are initiated back to the original source payment method (UPI, Debit Card, Credit Card, or NetBanking).</li>
              <li>Bank processing typically reflects the credit within <strong>5 to 7 business days</strong> depending on your issuing bank&apos;s settlement schedule.</li>
              <li>A confirmation receipt and credit note will be dispatched to your registered billing email address.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="var(--brand-amber)" /> 4. Exceptions & Usage-Based Charges
            </h2>
            <p>
              Refunds apply to software platform subscriptions. Third-party direct disbursements incurred at your explicit request (such as direct Meta ad spends recharged directly to Meta Facebook Ad Manager or dedicated telecom caller trunk lease fees) are pass-through expenses and non-refundable.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Need Assistance with Billing?
            </h2>
            <p>
              Our dedicated billing & support desk is available Monday through Saturday:
              <br />
              <strong>Billing Helpdesk:</strong> billing@dammerz.in
              <br />
              <strong>Phone Support:</strong> +91 98712 34567
              <br />
              <strong>Office:</strong> Dammerz Technologies India Pvt. Ltd., Sector 62, Noida, Uttar Pradesh, India - 201309
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        © 2026 Dammerz AI. All rights reserved.
      </footer>
    </div>
  );
}
