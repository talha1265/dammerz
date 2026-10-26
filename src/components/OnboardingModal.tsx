'use client';

import React, { useState } from 'react';
import { Building2, X, CheckCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { SubscriptionTier } from '@/lib/types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBusinessUpdated: (biz: any) => void;
}

export default function OnboardingModal({ isOpen, onClose, onBusinessUpdated }: OnboardingModalProps) {
  const [formData, setFormData] = useState({
    name: 'Bharat Electro-Tech & Valve Works',
    category: 'Industrial Valves & Pumps Manufacturing',
    phone: '+91 98100 55443',
    email: 'contact@bharatelectro.in',
    whatsappNumber: '+91 98100 55443',
    catalogSize: 85,
    subscriptionTier: 'growth' as SubscriptionTier,
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      if (data.success) {
        onBusinessUpdated(data.business);
        onClose();
      }
    } catch (err) {
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #25d366, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Building2 size={20} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.45rem' }}>Business Onboarding & AI Agent Deployment</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Configure your enterprise details, connect WhatsApp Business API, and select your AI Agent tier.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Business Profile */}
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              1. Business Profile Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Company / Legal Business Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Industry / Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Official Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  WhatsApp Operations Agent Number *
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Catalog & Channels */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              2. Catalog & Sales Channels
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  SKU / Catalog Size
                </label>
                <input
                  type="number"
                  value={formData.catalogSize}
                  onChange={(e) => setFormData({ ...formData, catalogSize: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Marketplace Integrations
                </label>
                <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                  <span className="badge badge-whatsapp">IndiaMart Live</span>
                  <span className="badge badge-ai">Google Shopping</span>
                  <span className="badge badge-premium">WhatsApp API</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Subscription Selection */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              3. Select AI Agent Subscription Tier
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {/* Starter */}
              <div
                onClick={() => setFormData({ ...formData, subscriptionTier: 'starter' })}
                style={{
                  border: formData.subscriptionTier === 'starter' ? '2px solid var(--brand-whatsapp)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  cursor: 'pointer',
                  background: formData.subscriptionTier === 'starter' ? 'rgba(37, 211, 102, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  position: 'relative',
                }}
              >
                {formData.subscriptionTier === 'starter' && (
                  <Check size={16} color="var(--brand-whatsapp)" style={{ position: 'absolute', top: '10px', right: '10px' }} />
                )}
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>Starter</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-whatsapp)' }}>₹4,999<span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span></div>
                <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', listStyle: 'none', padding: 0 }}>
                  <li>✓ WhatsApp Operations Agent</li>
                  <li>✓ Employee Status updates</li>
                  <li>✓ 1,500 messages/mo</li>
                  <li style={{ color: 'var(--text-dim)' }}>✗ No AI Voice Calling</li>
                </ul>
              </div>

              {/* Growth */}
              <div
                onClick={() => setFormData({ ...formData, subscriptionTier: 'growth' })}
                style={{
                  border: formData.subscriptionTier === 'growth' ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  cursor: 'pointer',
                  background: formData.subscriptionTier === 'growth' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  position: 'relative',
                }}
              >
                {formData.subscriptionTier === 'growth' && (
                  <Check size={16} color="var(--brand-primary)" style={{ position: 'absolute', top: '10px', right: '10px' }} />
                )}
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>Growth</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>₹14,999<span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span></div>
                <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', listStyle: 'none', padding: 0 }}>
                  <li>✓ IndiaMart & Google Sync</li>
                  <li>✓ Tender & PM AI Reports</li>
                  <li>✓ 5,000 messages/mo</li>
                  <li style={{ color: 'var(--text-dim)' }}>✗ No Calling Agent</li>
                </ul>
              </div>

              {/* Premium */}
              <div
                onClick={() => setFormData({ ...formData, subscriptionTier: 'premium' })}
                style={{
                  border: formData.subscriptionTier === 'premium' ? '2px solid var(--brand-amber)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  cursor: 'pointer',
                  background: formData.subscriptionTier === 'premium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  position: 'relative',
                }}
              >
                {formData.subscriptionTier === 'premium' && (
                  <Check size={16} color="var(--brand-amber)" style={{ position: 'absolute', top: '10px', right: '10px' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                  <span>Premium</span>
                  <Sparkles size={12} color="var(--brand-amber)" />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-amber)' }}>₹34,999<span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span></div>
                <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', listStyle: 'none', padding: 0 }}>
                  <li>✓ <strong>Autonomous AI Calling</strong></li>
                  <li>✓ Outbound phone negotiations</li>
                  <li>✓ 25,000 WhatsApp msgs</li>
                  <li>✓ 500 AI Voice Calls</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '10px 24px' }}>
              {loading ? 'Activating Agent System...' : 'Deploy Business AI Agents'}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
