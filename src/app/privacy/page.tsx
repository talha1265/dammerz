import React from 'react';
import Link from 'next/link';
import { Bot, ArrowLeft, ShieldCheck, Lock, Database, Eye } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Dammerz AI',
  description: 'Privacy Policy and Data Protection practices for Dammerz Autonomous Operations Suite.',
};

export default function PrivacyPage() {
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
          <span className="badge badge-whatsapp" style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Data Protection & Compliance
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-main)' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Last Updated: January 2026 • Compliant with Indian DPDP Act 2023 & Meta Developer Policies
          </p>
        </div>

        <div className="vibe-card" style={{ padding: '36px', lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="var(--brand-whatsapp)" /> 1. Overview
            </h2>
            <p>
              At <strong>Dammerz</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we take your privacy and business data security seriously. This Privacy Policy describes how we collect, store, process, and protect your information when you access our web application, deploy our WhatsApp bot, and connect business integrations (such as IndiaMART or Meta Ads).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--brand-primary-light)" /> 2. Information We Collect
            </h2>
            <p>We collect information you provide directly and data generated through service usage:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Account & Profile Data:</strong> Business name, registered address, GSTIN, owner/manager contact phone numbers, and email address.
              </li>
              <li>
                <strong>Staff & Operational Records:</strong> Employee names, assigned roles, phone numbers, location check-in logs, daily duty reports, and wage calculation parameters.
              </li>
              <li>
                <strong>WhatsApp & Communication Data:</strong> Messages received or sent via the WhatsApp Business API webhook, customer inquiry texts, call logs, and voice transcription summaries.
              </li>
              <li>
                <strong>Billing & Transaction Details:</strong> Invoices generated, vendor purchase records, and payment receipt tokens (note: sensitive credit/debit card numbers are never stored on our servers; they are processed securely by PCI-DSS certified payment gateways such as Razorpay).
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--brand-amber)" /> 3. How We Use Your Information
            </h2>
            <p>We use the collected information strictly to fulfill our contract with you:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>To operate your automated WhatsApp assistant and process natural language queries in Hindi/English.</li>
              <li>To ingest, score, and alert you regarding sales leads from IndiaMART, Google Shopping, or Meta Ads.</li>
              <li>To synthesize daily manager and site progress briefing reports using Gemini AI.</li>
              <li>To calculate monthly working hours, overtime, and salary ledgers for your staff.</li>
              <li>To process your recurring subscription billing and generate GST tax invoices.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              4. Meta WhatsApp Business API Compliance
            </h2>
            <p>
              Dammerz integrates directly with the Meta WhatsApp Cloud API. We adhere strictly to the Meta Business Developer Policies. We only dispatch automated WhatsApp templates and operational messages to numbers that have engaged with your business or opted in to receive work/order notifications. We do not sell or broker customer phone numbers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              5. Data Storage & Security
            </h2>
            <p>
              All customer database records are stored in high-security, encrypted cloud infrastructure (Neon PostgreSQL) with SSL in-transit encryption (TLS 1.3) and AES-256 encryption at rest. Multi-tenant database queries are isolated per business organization.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              6. Third-Party Service Providers
            </h2>
            <p>
              To deliver our AI services, we interface with trusted enterprise infrastructure providers:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Neon Database Inc.</strong> — Managed PostgreSQL cloud database.</li>
              <li><strong>Google Cloud (Gemini API)</strong> — AI natural language parsing and voice script intelligence.</li>
              <li><strong>Meta Platforms Inc.</strong> — WhatsApp Cloud API messaging infrastructure.</li>
              <li><strong>Razorpay Software Private Limited</strong> — Secure payment gateway and subscription billing.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              7. Your Rights & Data Deletion
            </h2>
            <p>
              Under the Digital Personal Data Protection Act (DPDP), you have the right to request a complete export of your business data or request account termination and permanent database deletion. To request data deletion, contact us at <strong>privacy@dammerz.in</strong>.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Data Protection Grievance Officer
            </h2>
            <p>
              For privacy inquiries or grievance redressal, contact:
              <br />
              <strong>Grievance Officer:</strong> Dammerz Privacy & Compliance Desk
              <br />
              <strong>Email:</strong> privacy@dammerz.in
              <br />
              <strong>Physical Address:</strong> Dammerz Technologies India Pvt. Ltd., Sector 62, Noida, Uttar Pradesh, India - 201309
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
