'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  FileText, 
  MapPin, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
  Sparkles,
  Server,
  Key,
  Copy,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { Business, SubscriptionTier } from '@/lib/types';

interface ProfileAndSettingsProps {
  business: Business;
  onRefresh: () => void;
  onNavigateBilling: () => void;
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  currentTheme?: 'dark' | 'light';
}

export default function ProfileAndSettings({
  business,
  onRefresh,
  onNavigateBilling,
  onToggleTheme,
  currentTheme = 'dark',
}: ProfileAndSettingsProps) {
  const [profile, setProfile] = useState({
    name: business.name || '',
    category: business.category || '',
    phone: business.phone || '',
    whatsappNumber: business.whatsappNumber || '',
    email: business.email || '',
    gstNumber: business.gstNumber || '',
    address: business.address || '',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showAdvancedDiagnostics, setShowAdvancedDiagnostics] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  useEffect(() => {
    setProfile({
      name: business.name || '',
      category: business.category || '',
      phone: business.phone || '',
      whatsappNumber: business.whatsappNumber || '',
      email: business.email || '',
      gstNumber: business.gstNumber || '',
      address: business.address || '',
    });
  }, [business]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          profile,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update business profile');
      }
      setSaveSuccess(true);
      onRefresh();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const copyWebhook = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/api/whatsapp` : 'https://bizzup.ai/api/whatsapp';
    navigator.clipboard.writeText(url);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bizzup_user');
      document.cookie = 'bizzup_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
  };

  const voiceMinsTotal = business.monthlyQuota.aiCallingMinutes ?? (
    business.subscriptionTier === 'premium' ? 600 : business.subscriptionTier === 'growth' ? 120 : 0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Profile Summary Banner */}
      <div className="vibe-card" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #25d366, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: 800,
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)',
          }}>
            {business.name ? business.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {business.name || 'Your Business Profile'}
              </h2>
              <span className="badge badge-premium" style={{ textTransform: 'uppercase' }}>
                {business.subscriptionTier} PLAN
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {business.category || 'Operations Platform'} • WhatsApp Hotline: <strong style={{ color: 'var(--brand-whatsapp)' }}>{business.whatsappNumber || 'Not Configured'}</strong>
            </p>
          </div>
        </div>

        {/* Quick Actions in Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onToggleTheme && (
            <button
              onClick={() => onToggleTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="btn btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px' }}
            >
              {currentTheme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
              <span>{currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ fontSize: '0.82rem', padding: '8px 14px', color: 'var(--brand-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(37, 211, 102, 0.12)',
          border: '1px solid rgba(37, 211, 102, 0.35)',
          color: 'var(--brand-whatsapp)',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <CheckCircle2 size={18} />
          <span>Company profile updated successfully and synced with Neon database!</span>
        </div>
      )}

      {saveError && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          color: 'var(--brand-rose)',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <AlertCircle size={18} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Grid: Company Details + Subscription Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Editable Business Information */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Building2 size={20} color="var(--brand-primary-light)" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
              Company & Identity Settings
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Registered Business / Brand Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="input-field"
                placeholder="e.g. Apex Industrial Solutions"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Industry / Category
                </label>
                <input
                  type="text"
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Manufacturing & Tenders"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  GSTIN / Tax ID
                </label>
                <input
                  type="text"
                  value={profile.gstNumber}
                  onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 07AAACA1234F1Z8"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Official Contact Phone
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  WhatsApp Hotline Number
                </label>
                <input
                  type="text"
                  value={profile.whatsappNumber}
                  onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                  className="input-field"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Primary Operations Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="input-field"
                placeholder="e.g. operations@company.in"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Registered Plant / Head Office Address
              </label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={2}
                className="input-field"
                placeholder="Plot / Facility address, Industrial Area, City, State"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 700, gap: '8px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Active Plan & Quota Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--brand-amber)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
                  Subscription & Allowances
                </h3>
              </div>
              <span className="badge badge-whatsapp">ACTIVE</span>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              marginBottom: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                    {business.subscriptionTier} Plan
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Billed monthly • Includes full AI agent suite
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>
                  {business.subscriptionTier === 'premium' ? '₹19,999' : business.subscriptionTier === 'growth' ? '₹9,999' : '₹3,999'}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/mo</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>WhatsApp Messages:</span>
                <strong style={{ color: 'var(--text-main)' }}>{business.monthlyQuota.whatsappMessagesUsed} / {business.monthlyQuota.whatsappMessages}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Voice Calling Minutes:</span>
                <strong style={{ color: voiceMinsTotal > 0 ? 'var(--brand-amber)' : 'var(--text-dim)' }}>
                  {business.monthlyQuota.aiCallingMinutesUsed || 0} / {voiceMinsTotal} Mins
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tender & Operations Reports:</span>
                <strong style={{ color: 'var(--text-main)' }}>{business.monthlyQuota.managerReportsUsed} / {business.monthlyQuota.managerReports}</strong>
              </div>
            </div>

            <button
              onClick={onNavigateBilling}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem', borderColor: 'var(--brand-amber)', color: 'var(--brand-amber)' }}
            >
              <Sparkles size={15} />
              <span>Change Plan or Manage Billing</span>
            </button>
          </div>

          {/* Theme Preference Box */}
          {onToggleTheme && (
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                Visual Appearance
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Select between crisp high-contrast Light Theme and Cyber Dark Luxe mode.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => onToggleTheme('light')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: currentTheme === 'light' ? '2px solid #6366f1' : '1px solid var(--border-subtle)',
                    background: currentTheme === 'light' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: currentTheme === 'light' ? '#6366f1' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                  }}
                >
                  <Sun size={16} /> Light Theme
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTheme('dark')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: currentTheme === 'dark' ? '2px solid #25d366' : '1px solid var(--border-subtle)',
                    background: currentTheme === 'dark' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: currentTheme === 'dark' ? '#25d366' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                  }}
                >
                  <Moon size={16} /> Dark Luxe
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Collapsible Cloud & Diagnostics Drawer */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <button
          type="button"
          onClick={() => setShowAdvancedDiagnostics(!showAdvancedDiagnostics)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: 0,
            color: 'var(--text-main)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={18} color="var(--brand-primary-light)" />
            <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>
              System Integrations & Cloud Engine Status
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <span>{showAdvancedDiagnostics ? 'Hide Technical Details' : 'View Integration Details'}</span>
            {showAdvancedDiagnostics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showAdvancedDiagnostics && (
          <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Database Persistence</span>
                <span className="badge badge-whatsapp" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Neon Serverless PostgreSQL
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                All leads, staff, bills & chats are saved in live tables
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Reasoning Core</span>
                <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Google Gemini 3.8 Flash
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Bilingual Hinglish/English natural comprehension active
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp Webhook URL</span>
                <button
                  type="button"
                  onClick={copyWebhook}
                  className="btn btn-outline"
                  style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                >
                  <Copy size={11} /> {copiedWebhook ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--brand-whatsapp)', wordBreak: 'break-all' }}>
                /api/whatsapp
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Meta Cloud API & webhook callback endpoint
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
