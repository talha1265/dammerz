'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Bot, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Phone, 
  Mail, 
  FileText,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { SubscriptionTier } from '@/lib/types';

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    name: 'Bharat Electro-Tech & Valve Works',
    category: 'Industrial Valves & Piping Solutions',
    phone: '+91 98100 55443',
    email: 'contact@bharatvalves.com',
    whatsappNumber: '+91 98100 55443',
    gstNumber: '27AABCB9876Q1Z2',
    address: 'Plot 18, MIDC Bhosari Industrial Area, Pune, Maharashtra - 411026',
    catalogSize: 85,
    subscriptionTier: 'growth' as SubscriptionTier,
    integrations: ['indiamart', 'whatsapp', 'google_shop'],
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'onboard',
          businessDetails: formData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      // Redirect immediately to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="vibe-bg-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Top Bar */}
      <header style={{
        padding: '18px 32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <span className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            Dammerz<span style={{ color: 'var(--brand-whatsapp)' }}>.ai</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already onboarded?
          </span>
          <Link href="/login" className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
            Client Login
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '820px', width: '100%', margin: '40px auto', padding: '0 24px', flex: 1 }}>
        
        {/* Progress Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step >= 1 ? 'var(--brand-whatsapp)' : 'rgba(255, 255, 255, 0.1)',
              color: step >= 1 ? '#000' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}>
              1
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: step >= 1 ? '#fff' : 'var(--text-dim)' }}>
              Business Profile
            </span>
          </div>

          <div style={{ width: '40px', height: '2px', background: step === 2 ? 'var(--brand-whatsapp)' : 'rgba(255, 255, 255, 0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === 2 ? 'var(--brand-whatsapp)' : 'rgba(255, 255, 255, 0.1)',
              color: step === 2 ? '#000' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}>
              2
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: step === 2 ? '#fff' : 'var(--text-dim)' }}>
              Subscription & Channels
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.88rem',
          }}>
            {error}
          </div>
        )}

        <div className="vibe-card" style={{ padding: '36px' }}>
          
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Onboard Your Business Profile</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Provide your official business identity. Our AI agents will use this context for customer quotations and employee logging.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Company / Entity Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Apex Industrial Solutions"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Industry / Vertical *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                    placeholder="e.g. EPC Tenders / Industrial Valves"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Official Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="operations@company.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+91 98..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Dedicated WhatsApp Business Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="input-field"
                    placeholder="+91 98..."
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Where employees report check-ins and leads send inquiries
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    GSTIN / Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="input-field"
                    placeholder="27AABCB..."
                  />
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Registered Factory / Office Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  placeholder="Plot number, industrial estate, city, state"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Continue to Subscription & Channels
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCompleteOnboarding}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Select AI Agent Subscription Plan</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Enroll your business into the appropriate tier. AI Calling is included in Growth (120 Mins) and Premium (600 Mins).
                </p>
              </div>

              {/* Plans selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {/* Starter */}
                <div
                  onClick={() => setFormData({ ...formData, subscriptionTier: 'starter' })}
                  style={{
                    border: formData.subscriptionTier === 'starter' ? '2px solid var(--brand-whatsapp)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    cursor: 'pointer',
                    background: formData.subscriptionTier === 'starter' ? 'rgba(37, 211, 102, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    position: 'relative',
                  }}
                >
                  {formData.subscriptionTier === 'starter' && (
                    <Check size={16} color="var(--brand-whatsapp)" style={{ position: 'absolute', top: '12px', right: '12px' }} />
                  )}
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Starter</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-whatsapp)' }}>₹3,999<span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span></div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>✓ WhatsApp Bot 24/7</li>
                    <li>✓ Employee Status updates</li>
                    <li>✓ 2,000 messages/mo</li>
                    <li style={{ color: 'var(--text-dim)' }}>✕ No AI Voice Calling</li>
                  </ul>
                </div>

                {/* Growth */}
                <div
                  onClick={() => setFormData({ ...formData, subscriptionTier: 'growth' })}
                  style={{
                    border: formData.subscriptionTier === 'growth' ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    cursor: 'pointer',
                    background: formData.subscriptionTier === 'growth' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    position: 'relative',
                  }}
                >
                  {formData.subscriptionTier === 'growth' && (
                    <Check size={16} color="var(--brand-primary)" style={{ position: 'absolute', top: '12px', right: '12px' }} />
                  )}
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Growth Enterprise</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>₹9,999<span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span></div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ color: 'var(--brand-whatsapp)', fontWeight: 600 }}>✓ 120 Mins (2 Hrs) AI Calling</li>
                    <li>✓ IndiaMart & Google Sync</li>
                    <li>✓ 10,000 messages/mo</li>
                    <li>✓ Tender & PM AI Reports</li>
                  </ul>
                </div>

                {/* Premium */}
                <div
                  onClick={() => setFormData({ ...formData, subscriptionTier: 'premium' })}
                  style={{
                    border: formData.subscriptionTier === 'premium' ? '2px solid var(--brand-amber)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    cursor: 'pointer',
                    background: formData.subscriptionTier === 'premium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    position: 'relative',
                  }}
                >
                  {formData.subscriptionTier === 'premium' && (
                    <Check size={16} color="var(--brand-amber)" style={{ position: 'absolute', top: '12px', right: '12px' }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                    <span>Premium Suite</span>
                    <Sparkles size={14} color="var(--brand-amber)" />
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-amber)' }}>₹19,999<span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span></div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ color: 'var(--brand-amber)', fontWeight: 600 }}>✓ 600 Mins (10 Hrs) AI Calling</li>
                    <li>✓ Meta Video Ads Autopilot</li>
                    <li>✓ 35,000 WhatsApp msgs</li>
                    <li>✓ Dedicated VIP Account Mgr</li>
                  </ul>
                </div>
              </div>

              {/* Catalog Size Input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Product Catalog SKU Count
                </label>
                <input
                  type="number"
                  value={formData.catalogSize}
                  onChange={(e) => setFormData({ ...formData, catalogSize: Number(e.target.value) })}
                  className="input-field"
                  style={{ maxWidth: '240px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                  style={{ padding: '12px 20px' }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-whatsapp"
                  style={{ padding: '12px 30px' }}
                >
                  {loading ? 'Activating AI Agents...' : 'Deploy & Open Dashboard'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
