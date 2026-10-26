'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

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
      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-whatsapp" style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={14} /> We&apos;re Here to Help
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-main)' }}>
            Contact Dammerz Customer Operations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Have questions about integrating your WhatsApp business number, IndiaMART lead feeds, or selecting the right plan? Reach out directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="vibe-card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="var(--brand-primary-light)" /> Registered Corporate Office
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.92rem' }}>
                
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color="var(--brand-primary-light)" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '2px' }}>Headquarters Address</strong>
                    <span style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      Dammerz Technologies India Pvt. Ltd.<br />
                      Tower B, Technopark Campus, Sector 62,<br />
                      Noida, Uttar Pradesh - 201309, India
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} color="var(--brand-whatsapp)" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '2px' }}>Support & Sales Email</strong>
                    <a href="mailto:support@dammerz.in" style={{ color: 'var(--brand-whatsapp)', textDecoration: 'none' }}>
                      support@dammerz.in
                    </a>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Billing: billing@dammerz.in
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} color="var(--brand-amber)" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '2px' }}>Direct Phone & WhatsApp Desk</strong>
                    <span style={{ color: 'var(--text-main)' }}>+91 98712 34567 / +91 99100 88200</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Mon - Sat: 9:30 AM to 7:00 PM IST
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} color="#60a5fa" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '2px' }}>Response Time Guarantee</strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Email queries answered within 2 hours. 24/7 AI Chatbot desk active for immediate queries.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div className="vibe-card" style={{ padding: '24px', background: 'rgba(37, 211, 102, 0.05)', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <ShieldCheck size={20} color="var(--brand-whatsapp)" />
                <strong style={{ color: 'var(--text-main)' }}>Verified Business Entity</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                GSTIN Registered Enterprise. Tax Invoices with Input Tax Credit (ITC) eligibility automatically provided with all business plans.
              </p>
            </div>

          </div>

          {/* Contact Inquiry Form */}
          <div className="vibe-card" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              Send an Operational Inquiry
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Fill in your business details and our technical deployment team will reach out.
            </p>

            {submitted ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                <CheckCircle2 size={44} color="var(--brand-whatsapp)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '6px' }}>Message Dispatched!</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Thank you, {formData.name}. Our integration specialist will call or message your WhatsApp at <strong>{formData.phone || formData.email}</strong> shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="vibe-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="vibe-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="vibe-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industrial Valves & Fab"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="vibe-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="vibe-input"
                    style={{ width: '100%' }}
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Starter Plan Integration">Starter Plan Setup & WhatsApp Bot</option>
                    <option value="Growth Plan Setup">Growth Plan (IndiaMART + AI Voice Calling)</option>
                    <option value="Premium Custom Enterprise">Premium Suite & Custom Meta Video Ads</option>
                    <option value="Billing & Invoicing">Billing, GST Invoices & Refunds</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    How can our AI team assist you? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your current business operations, number of field staff, or daily lead volume..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="vibe-input"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-whatsapp"
                  style={{ width: '100%', padding: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading ? (
                    'Transmitting Inquiry...'
                  ) : (
                    <>
                      <Send size={16} /> Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        © 2026 Dammerz AI. All rights reserved.
      </footer>
    </div>
  );
}
