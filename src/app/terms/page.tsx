import React from 'react';
import Link from 'next/link';
import { Bot, ArrowLeft, Shield, Scale, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions — Dammerz AI',
  description: 'Terms of Service and Customer Agreement for Dammerz Autonomous Operations Suite.',
};

export default function TermsPage() {
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

      {/* Content */}
      <main style={{ flex: 1, maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Scale size={14} /> Legal Documentation
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-main)' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Last Updated: January 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        <div className="vibe-card" style={{ padding: '36px', lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--brand-primary-light)" /> 1. Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong>Dammerz</strong> (&ldquo;Service&rdquo;, &ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By signing up, subscribing, or using the Dammerz AI Operations Suite web application, WhatsApp integration, or APIs, you (&ldquo;Customer&rdquo;, &ldquo;User&rdquo;, or &ldquo;Merchant&rdquo;) agree to be legally bound by these Terms and Conditions. If you are entering into this agreement on behalf of a company or entity, you represent that you have legal authority to bind that entity.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--brand-whatsapp)" /> 2. Description of Service
            </h2>
            <p>
              Dammerz provides an AI-powered autonomous operations platform for businesses, including:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Automated WhatsApp operational chatbots & duty tracking for staff and field workers.</li>
              <li>Lead ingestion & scoring from third-party channels (IndiaMART, Google Shopping, Meta Ads).</li>
              <li>Autonomous AI voice calling assistants, speech transcription, and sentiment analysis.</li>
              <li>Attendance management, daily project/tender reports, and expense/bill reconciliation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              3. User Accounts & Responsibilities
            </h2>
            <p>
              You must provide accurate, complete, and current information during registration. You are solely responsible for maintaining the confidentiality of your master admin PIN, credentials, and staff passwords. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              4. Subscription, Billing & Taxes
            </h2>
            <p>
              <strong>Fees:</strong> Services are billed on a recurring monthly or annual basis as per your selected tier (Starter, Growth, or Premium).
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>Payment Processing:</strong> Payments are processed via authorized payment gateways (including Razorpay, Stripe, or Cashfree). By subscribing, you authorize our payment processor to automatically charge your designated payment method at each billing cycle.
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>Taxes:</strong> All fees are subject to applicable Goods and Services Tax (GST) as per Indian tax laws. A valid GST Tax Invoice will be generated upon each successful transaction.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              5. Acceptable Use & WhatsApp Policy
            </h2>
            <p>
              You agree to comply with all applicable local, national, and international laws, including Meta&apos;s WhatsApp Business Policy. You agree NOT to use Dammerz to:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Send unsolicited bulk messages (SPAM) to numbers without prior business relationship or opt-in.</li>
              <li>Transmit deceptive, defamatory, pornographic, or fraudulent content.</li>
              <li>Interfere with or breach the security of the server infrastructure or APIs.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              6. Intellectual Property & Client Data
            </h2>
            <p>
              <strong>Your Data:</strong> You retain complete ownership of all customer data, staff logs, bills, and lead records uploaded to Dammerz. We do not sell your proprietary business data.
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>Platform IP:</strong> The Dammerz platform, software algorithms, prompt structures, interfaces, and branding remain the exclusive intellectual property of Dammerz.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              7. Limitation of Liability & Warranty Disclaimer
            </h2>
            <p>
              The platform is provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;. While we strive for 99.9% uptime, Dammerz is not liable for disruptions resulting from third-party outages (such as Meta WhatsApp Cloud API downtime, telecom network failures, or AI foundation model latency).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              8. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any legal dispute or controversy arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Contacting Legal & Support
            </h2>
            <p>
              If you have any questions regarding these Terms, please reach out to:
              <br />
              <strong>Email:</strong> support@dammerz.in
              <br />
              <strong>Address:</strong> Dammerz Technologies India Pvt. Ltd., Sector 62, Noida, Uttar Pradesh, India - 201309
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
