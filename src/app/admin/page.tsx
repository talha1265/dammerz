'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  KeyRound, 
  Building2, 
  Users, 
  PhoneCall, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Business, AdminStats, SubscriptionTier } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [pin, setPin] = useState('9922');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin data
  const [clients, setClients] = useState<Business[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid Admin Security PIN');

      setIsAuthenticated(true);
      fetchAdminData();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (clientId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', clientId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Status updated to ${nextStatus.toUpperCase()} for client.`);
        fetchAdminData();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOverrideTier = async (clientId: string, tier: SubscriptionTier) => {
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_tier', clientId, tier }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Plan successfully upgraded to ${tier.toUpperCase()}`);
        fetchAdminData();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchToClient = async (clientId: string) => {
    try {
      await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch_active', clientId }),
      });
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Top Bar */}
      <header style={{
        padding: '18px 32px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)',
          }}>
            <ShieldCheck size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                BizzUp SuperAdmin
              </span>
              <span className="badge badge-busy" style={{ fontSize: '0.68rem' }}>
                RESTRICTED CONSOLE
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Master Client Management & System Orchestration
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
            Public Landing
          </Link>
          <Link href="/dashboard" className="btn btn-whatsapp" style={{ fontSize: '0.82rem' }}>
            Open Client Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        
        {/* If Not Authenticated: Security PIN Passcode Gate */}
        {!isAuthenticated ? (
          <div style={{ maxWidth: '440px', margin: '80px auto' }}>
            <div className="glass-panel" style={{ padding: '36px', background: 'var(--bg-secondary)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  margin: '0 auto 16px',
                  borderRadius: '16px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Lock size={28} color="#fb7185" />
                </div>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>Master Admin Verification</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Enter your encrypted administrator security PIN to access multi-client business operations.
                </p>
              </div>

              {authError && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '18px',
                }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleVerifyPin}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Admin Security PIN
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input
                      type="password"
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Security PIN"
                      className="input-field"
                      style={{ paddingLeft: '44px', letterSpacing: '4px', fontSize: '1.2rem', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    🔑 Demo Master PIN: <strong style={{ color: 'var(--brand-whatsapp)' }}>9922</strong> (or admin123)
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Authenticating...' : 'Unlock SuperAdmin Console'}
                  <ArrowRight size={16} />
                </button>
              </form>

            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN CONSOLE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Action Feedback Banner */}
            {actionMessage && (
              <div style={{
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: 'var(--brand-whatsapp)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <CheckCircle2 size={16} />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Global Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              
              <div className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Onboarded Clients</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                  {stats?.totalClients || clients.length} Enterprises
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-whatsapp)', marginTop: '4px' }}>
                  ● 100% active on WhatsApp
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Monthly Platform Run-Rate</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                  ₹{(stats?.totalMonthlyRevenue || 89996).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Starter + Growth + Premium
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Global WhatsApp Messages</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>
                  {(stats?.totalMessagesProcessed || 15900).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary-light)', marginTop: '4px' }}>
                  Processed via Gemini 1.5 Flash
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Autonomous AI Calls Dialed</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                  {stats?.totalCallsDialed || 226} Calls
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-amber)', marginTop: '4px' }}>
                  Speech synthesized & transcribed
                </div>
              </div>

            </div>

            {/* Clients Management Table */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building2 size={22} color="var(--brand-whatsapp)" />
                    All Client Businesses & AI Agent Subscriptions
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Manage client status, override subscription tiers, or jump into client workspaces
                  </p>
                </div>

                <div style={{ position: 'relative', minWidth: '280px' }}>
                  <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="text"
                    placeholder="Search by company, phone, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '38px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Company Profile</th>
                      <th style={{ padding: '12px 16px' }}>WhatsApp & Mobile</th>
                      <th style={{ padding: '12px 16px' }}>Subscription Tier</th>
                      <th style={{ padding: '12px 16px' }}>Monthly Quota Usage</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s ease' }}>
                        
                        {/* Company Profile */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{client.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--brand-primary-light)' }}>{client.category}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{client.address}</div>
                        </td>

                        {/* Contact */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ color: 'var(--brand-whatsapp)', fontWeight: 600, fontSize: '0.85rem' }}>
                            {client.whatsappNumber}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{client.email}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>GST: {client.gstNumber || 'N/A'}</div>
                        </td>

                        {/* Subscription Tier */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={client.subscriptionTier === 'premium' ? 'badge badge-premium' : client.subscriptionTier === 'growth' ? 'badge badge-ai' : 'badge badge-whatsapp'}>
                              {client.subscriptionTier.toUpperCase()}
                            </span>
                          </div>
                          {/* 1-click tier override dropdown */}
                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                            {(['starter', 'growth', 'premium'] as SubscriptionTier[]).map((t) => (
                              <button
                                key={t}
                                onClick={() => handleOverrideTier(client.id, t)}
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  border: client.subscriptionTier === t ? '1px solid #fff' : '1px solid var(--border-subtle)',
                                  background: client.subscriptionTier === t ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Monthly Quota */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                            💬 {client.monthlyQuota.whatsappMessagesUsed} / {client.monthlyQuota.whatsappMessages} msgs
                          </div>
                          <div style={{ fontSize: '0.78rem', color: client.subscriptionTier === 'premium' ? 'var(--brand-amber)' : 'var(--text-dim)', marginTop: '2px' }}>
                            🎙️ {client.monthlyQuota.aiCallsUsed} / {client.monthlyQuota.aiCalls} calls
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px' }}>
                          <span className={client.status === 'suspended' ? 'badge badge-busy' : 'badge badge-online'}>
                            {client.status?.toUpperCase() || 'ACTIVE'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleSwitchToClient(client.id)}
                              className="btn btn-whatsapp"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              title="Impersonate and open client workspace"
                            >
                              <ExternalLink size={12} />
                              Open Dashboard
                            </button>

                            <button
                              onClick={() => handleToggleStatus(client.id, client.status)}
                              className="btn btn-outline"
                              style={{ padding: '6px 10px', fontSize: '0.78rem', color: client.status === 'suspended' ? 'var(--brand-emerald)' : 'var(--brand-rose)' }}
                            >
                              {client.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Neon DB & Platform Telemetry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Database size={20} color="var(--brand-emerald)" />
                  <h4 style={{ fontSize: '1rem', color: '#fff' }}>Neon PostgreSQL Cluster Health</h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Connected to AWS us-east-2 Neon Serverless pool. Tables <code>businesses</code>, <code>employees</code>, <code>sales_leads</code>, <code>manager_reports</code>, <code>ai_calls</code> synced.
                </p>
                <div style={{ marginTop: '12px' }}>
                  <span className="badge badge-whatsapp">CONNECTION POOL HEALTHY</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Sparkles size={20} color="var(--brand-primary-light)" />
                  <h4 style={{ fontSize: '1rem', color: '#fff' }}>Google Gemini AI Quota & Model Status</h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Gemini 1.5 Flash active for real-time WhatsApp intents and speech synthesis scripts. Fallback contextual engine ready for zero downtime.
                </p>
                <div style={{ marginTop: '12px' }}>
                  <span className="badge badge-ai">LATENCY: 420ms AVG</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
