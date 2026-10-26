'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Printer, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  PhoneCall, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function PitchDeckPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Dammerz AI Operations Suite — 1-Page Solution Overview*\n\n` +
      `Automate site labor check-ins, IndiaMART buy-leads, and invoice follow-ups via bilingual WhatsApp & Voice AI.\n\n` +
      `📌 *View interactive pitch & plans:* ${typeof window !== 'undefined' ? window.location.origin : ''}/deck\n\n` +
      `Pricing starts at ₹3,999/month with a 7-day money-back guarantee.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="deck-container" style={{ minHeight: '100vh', background: '#0b0f19', color: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Action Bar (Hidden on print) */}
      <div className="no-print" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 15, 25, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="#fff" />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>Dammerz AI — 1-Pager Executive Proposal</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleShareWhatsApp}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#25d366',
              color: '#070a0e',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Share2 size={15} /> Share via WhatsApp
          </button>
          
          <button
            onClick={handlePrint}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Printer size={15} /> Save / Print as PDF
          </button>

          <Link
            href="/onboard"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Start Free Trial &rarr;
          </Link>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="print-sheet" style={{
        maxWidth: '960px',
        margin: '24px auto',
        padding: '40px',
        background: '#111827',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      }}>
        
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(255, 255, 255, 0.08)', paddingBottom: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ background: '#25d366', color: '#070a0e', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Executive 1-Pager
              </span>
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Commercial Proposition</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '4px 0 8px', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Dammerz AI Operations Suite
            </h1>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.92rem' }}>
              Autonomous WhatsApp & Voice AI Platform for SME Manufacturers, Contractors & Suppliers.
            </p>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#9ca3af', lineHeight: '1.5' }}>
            <strong style={{ color: '#25d366', display: 'block' }}>Dammerz Technologies India Pvt. Ltd.</strong>
            <span>Sector 62, Noida, UP - 201309</span><br />
            <span>sales@dammerz.in • +91 98712 34567</span>
          </div>
        </div>

        {/* The Problem vs Solution (2 Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          
          {/* Problem */}
          <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#f87171', fontWeight: 800, fontSize: '0.95rem' }}>
              <AlertTriangle size={18} /> THE 3 DAILY OPERATIONAL BOTTLENECKS
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: '#d1d5db', lineHeight: '1.45' }}>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>1. Unmonitored Remote Labor & Sites:</strong>
                Supervisors take hours to report attendance. Overtime disputes and ghost worker wage theft cost ~₹25,000+ per site monthly.
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>2. Lost IndiaMART & Website BuyLeads:</strong>
                72% of buyers buy from the first responder. Inquiries get answered 4+ hours late on personal staff WhatsApps and go cold.
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>3. Uncollected Bills & Chaotic Ledgers:</strong>
                Pending vendor payments and customer invoices get buried in WhatsApp chat history, damaging cash flow and missing GST ITC.
              </div>
            </div>
          </div>

          {/* Solution */}
          <div style={{ padding: '20px', background: 'rgba(37, 211, 102, 0.06)', borderRadius: '12px', border: '1px solid rgba(37, 211, 102, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#25d366', fontWeight: 800, fontSize: '0.95rem' }}>
              <Zap size={18} /> THE DAMMERZ 24/7 AI AUTOPILOT
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: '#d1d5db', lineHeight: '1.45' }}>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>1. Hinglish/English WhatsApp Duty Bot:</strong>
                Staff text their daily headcount or site update. The AI automatically logs attendance, hours, and wage calculations without manual data entry.
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>2. Instant Lead Ingestion & Scoring:</strong>
                IndiaMART, Google Shopping & Meta Ads leads are scored in seconds. Automated quotations dispatched to the buyer within 60 seconds.
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>3. Autonomous Voice Calling & Daily Owner Brief:</strong>
                AI phone calls qualify leads and politely remind overdue accounts. Business owners get a daily 8:00 AM WhatsApp executive briefing.
              </div>
            </div>
          </div>

        </div>

        {/* Quantified Business ROI */}
        <div style={{ padding: '18px 24px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>Proven Client Impact</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '1.15rem', color: '#ffffff' }}>Quantified Monthly Return on Investment (ROI)</h3>
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#25d366', display: 'block' }}>₹28,000+</span>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Saved in Wage Leakage</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', display: 'block' }}>40+ Hours</span>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Owner Time Saved / Mo</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa', display: 'block' }}>+35%</span>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Faster RFQ Turnaround</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Subscription Packages */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Predictable Monthly Plans (No Hidden Fees)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            
            {/* Starter */}
            <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#fff' }}>Starter</strong>
                  <span style={{ fontSize: '0.68rem', color: '#25d366', fontWeight: 700 }}>ESSENTIAL</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  ₹3,999 <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>/ mo</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: '0 0 16px', fontSize: '0.78rem', color: '#9ca3af', lineHeight: '1.6' }}>
                  <li>24/7 WhatsApp Operations Bot</li>
                  <li>Staff Check-ins & Attendance</li>
                  <li>Auto Staff ID & Password Generator</li>
                  <li>2,000 Messages / month</li>
                  <li>GST Bills & Expense Ledger</li>
                </ul>
              </div>
              <div style={{ fontSize: '0.75rem', textAlign: 'center', color: '#6b7280' }}>Best for 5-15 field staff</div>
            </div>

            {/* Growth */}
            <div style={{ padding: '18px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '2px solid #6366f1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#fff' }}>Growth</strong>
                  <span style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 800, background: 'rgba(99, 102, 241, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>MOST POPULAR</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8', marginBottom: '8px' }}>
                  ₹9,999 <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>/ mo</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: '0 0 16px', fontSize: '0.78rem', color: '#e5e7eb', lineHeight: '1.6' }}>
                  <li><strong>120 Mins (2 Hours) Voice AI Calling</strong></li>
                  <li>IndiaMART BuyLead Instant Sync</li>
                  <li>Google Shopping Feed Ingestion</li>
                  <li>10,000 WhatsApp Messages / mo</li>
                  <li>Multi-Site Labor Inspection Ledger</li>
                  <li>Daily Risk & Executive Briefing</li>
                </ul>
              </div>
              <div style={{ fontSize: '0.75rem', textAlign: 'center', color: '#818cf8', fontWeight: 700 }}>Best for Contractors & Manufacturers</div>
            </div>

            {/* Premium */}
            <div style={{ padding: '18px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#fff' }}>Premium</strong>
                  <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 800 }}>FULL AUTOPILOT</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginBottom: '8px' }}>
                  ₹19,999 <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>/ mo</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: '0 0 16px', fontSize: '0.78rem', color: '#9ca3af', lineHeight: '1.6' }}>
                  <li><strong>600 Mins (10 Hours) Voice AI Calling</strong></li>
                  <li>Meta Video Ads AI Autonomous Manager</li>
                  <li>Click-to-WhatsApp Reel Ad Generation</li>
                  <li>35,000 WhatsApp Messages / mo</li>
                  <li>Autonomous Overdue Payment Follow-ups</li>
                  <li>Dedicated Pipeline & 24/7 SLA</li>
                </ul>
              </div>
              <div style={{ fontSize: '0.75rem', textAlign: 'center', color: '#6b7280' }}>For Large EPC & Enterprise Units</div>
            </div>

          </div>
        </div>

        {/* Footer Guarantee & Next Step */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#25d366" />
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              <strong style={{ color: '#fff', display: 'block' }}>100% Risk-Free: 7-Day Full Money-Back Guarantee</strong>
              <span>GST Input Tax Credit (ITC) tax invoices provided with every subscription.</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
            <span style={{ color: '#9ca3af' }}>Ready to deploy? </span>
            <strong style={{ color: '#25d366' }}>Call / WhatsApp +91 98712 34567</strong>
          </div>
        </div>

      </div>

      {/* Global CSS for Print Mode */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body, .deck-container {
            background: #ffffff !important;
            color: #111827 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-sheet {
            background: #ffffff !important;
            color: #111827 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            max-width: 100% !important;
          }
          h1, h2, h3, strong {
            color: #111827 !important;
          }
          p, span, li {
            color: #374151 !important;
          }
        }
      `}</style>

    </div>
  );
}
