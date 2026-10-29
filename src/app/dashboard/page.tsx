'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CommandPalette from '@/components/CommandPalette';
import QuickVibeDock from '@/components/QuickVibeDock';
import WhatsAppSimulator from '@/components/WhatsAppSimulator';
import EmployeeManager from '@/components/EmployeeManager';
import SalesPipeline from '@/components/SalesPipeline';
import TenderReports from '@/components/TenderReports';
import SubscriptionManager from '@/components/SubscriptionManager';
import ProfileAndSettings from '@/components/ProfileAndSettings';
import BillsAndExcelHub from '@/components/BillsAndExcelHub';
import TeamOpsChatHub from '@/components/TeamOpsChatHub';
import OperationsGuideModal from '@/components/OperationsGuideModal';
import AIEmployeeHub from '@/components/AIEmployeeHub';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  Users, 
  Zap, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  HardHat, 
  FileSpreadsheet, 
  Globe, 
  BookOpen, 
  Video, 
  Activity, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  Clock, 
  Sparkle, 
  Layers,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { Business, SalesLead } from '@/lib/types';

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeLeadForCall, setActiveLeadForCall] = useState<SalesLead | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Quick stats
  const [employeesCount, setEmployeesCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [pipelineTotal, setPipelineTotal] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [callsCount, setCallsCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('bizzup_theme') as 'dark' | 'light') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleToggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizzup_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Live Activity Stream
  const [liveEvents] = useState<any[]>([]);

  const fetchBusiness = async () => {
    try {
      const res = await fetch('/api/business');
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const [empRes, leadsRes, repRes, callRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/leads'),
        fetch('/api/reports'),
        fetch('/api/calls'),
      ]);

      const [empData, leadsData, repData, callData] = await Promise.all([
        empRes.json(),
        leadsRes.json(),
        repRes.json(),
        callRes.json(),
      ]);

      if (empData.success) setEmployeesCount(empData.employees.length);
      if (leadsData.success) {
        setLeadsCount(leadsData.leads.length);
        const sum = leadsData.leads.reduce((a: number, b: any) => a + (b.estimatedValue || 0), 0);
        setPipelineTotal(sum);
      }
      if (repData.success) setReportsCount(repData.reports.length);
      if (callData.success) setCallsCount(callData.calls.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchStats();
  }, []);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefreshAll = () => {
    fetchBusiness();
    fetchStats();
  };

  const handleTriggerCallFromLead = (lead: SalesLead) => {
    setActiveLeadForCall(lead);
    setActiveTab('calling');
  };

  if (!business) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #25d366, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(37, 211, 102, 0.4)',
        }}>
          <Bot size={32} color="#fff" />
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading BizzUp Operations Dashboard...</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Syncing Staff IDs, Neon DB, and Marketing Connectors</div>
      </div>
    );
  }

  return (
    <div className="vibe-bg-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Top Navbar with Vibe Coded Sub-bar & Command trigger */}
      <Navbar
        business={business}
        isLoggedIn={true}
        userPhone={business.phone}
        onOpenLogin={() => {}}
        onOpenOnboard={() => {}}
        onOpenUpgrade={() => setShowUpgradeModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onLogout={() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('bizzup_user');
            document.cookie = 'bizzup_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
          window.location.href = '/login';
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Area */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 24px 80px', flex: 1, position: 'relative', zIndex: 1 }}>
        
        {/* TAB 1: FLEET OVERVIEW (Vibe Coded Mission Control) */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Header Status Strip with Vibe Aesthetics */}
            <div className="vibe-card" style={{
              padding: '26px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              background: 'linear-gradient(135deg, rgba(20, 27, 44, 0.85) 0%, rgba(13, 17, 28, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span className="vibe-live-pill" style={{ padding: '3px 10px' }}>
                    <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                    AUTOPILOT RUNNING
                  </span>
                  <span className="badge badge-ai" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Cpu size={12} /> Gemini 3.8 Flash Engine
                  </span>
                  <span className="badge badge-premium" style={{ fontSize: '0.72rem' }}>
                    {business.subscriptionTier.toUpperCase()} SUITE
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    Press <span className="vibe-kbd">⌘K</span> for rapid launcher
                  </span>
                </div>

                <h1 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.03em', margin: '2px 0 6px' }}>
                  {business.name}
                </h1>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                  WhatsApp Agent: <strong style={{ color: 'var(--brand-whatsapp)' }}>{business.whatsappNumber}</strong> • Catalog: <strong style={{ color: 'var(--text-main)' }}>{business.catalogSize} SKUs</strong> • Vertical: <strong style={{ color: 'var(--text-main)' }}>{business.category}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  onClick={() => setShowCommandPalette(true)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.82rem', borderColor: 'rgba(99, 102, 241, 0.4)', color: 'var(--brand-primary-light)' }}
                >
                  <Sparkle size={14} /> Quick Menu <span className="vibe-kbd">⌘K</span>
                </button>
                <button 
                  onClick={() => setShowGuideModal(true)} 
                  className="btn btn-outline" 
                  style={{ fontSize: '0.82rem' }}
                >
                  <BookOpen size={14} /> Playbook
                </button>
                <Link href="/staff" className="btn btn-outline" style={{ fontSize: '0.82rem', borderColor: 'var(--brand-amber)', color: '#fbbf24' }}>
                  <HardHat size={14} /> Staff Portal
                </Link>
                <button onClick={handleRefreshAll} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
                  <RefreshCw size={14} /> Sync Now
                </button>
              </div>
            </div>

            {/* Quick-Launch Interactive Pills Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflowX: 'auto',
              padding: '6px 2px',
            }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkle size={13} color="var(--brand-primary-light)" />
                Quick Launch:
              </span>
              {[
                { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageSquare, color: 'var(--brand-whatsapp)' },
                { id: 'ops_chat', label: 'Team Ops Chat', icon: Users, color: 'var(--brand-primary-light)' },
                { id: 'meta_ads', label: 'Meta Video Ads', icon: Video, color: '#60a5fa' },
                { id: 'employees', label: 'Staff Roster', icon: HardHat, color: '#fbbf24' },
                { id: 'sales', label: 'IndiaMart Leads', icon: Zap, color: '#f59e0b' },
                { id: 'bills', label: 'Ledger & Bills', icon: FileSpreadsheet, color: '#a78bfa' },
                { id: 'calling', label: 'Voice AI Studio', icon: PhoneCall, color: '#fb7185' },
              ].map((pill) => {
                const PillIcon = pill.icon;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveTab(pill.id)}
                    className="vibe-quick-pill"
                    style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  >
                    <PillIcon size={14} color={pill.color} />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Metrics Grid with Vibe Depth */}
            {/* Metrics Grid with Vibe Depth - Clickable Quick Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
              
              <div 
                onClick={() => setActiveTab('employees')}
                role="button"
                tabIndex={0}
                className="vibe-stat-card vibe-card-glow-green" 
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)', 
                  position: 'relative',
                }}
                title="Click to open Staff ID Generator & Role Roster Engine"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Staff IDs & Roster</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HardHat size={18} color="var(--brand-whatsapp)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {employeesCount} Staff
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--brand-whatsapp)' }}>
                    <TrendingUp size={13} />
                    <span>Hinglish & English Duty Logs synced</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-whatsapp)', fontWeight: 700 }}>Open Tab →</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('sales')}
                role="button"
                tabIndex={0}
                className="vibe-stat-card vibe-card-glow-amber" 
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)', 
                  position: 'relative',
                }}
                title="Click to view IndiaMart & Google Leads Sales Pipeline"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>IndiaMart & Google Leads</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} color="var(--brand-amber)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--brand-amber)', letterSpacing: '-0.03em' }}>
                  ₹{(pipelineTotal / 100000).toFixed(1)} Lakhs
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                    <TrendingUp size={13} />
                    <span>{leadsCount} Active buyer inquiries auto-scored</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-amber)', fontWeight: 700 }}>Open Tab →</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('bills')}
                role="button"
                tabIndex={0}
                className="vibe-stat-card vibe-card-glow-indigo" 
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)', 
                  position: 'relative',
                }}
                title="Click to open Bills & Excel Ledger Hub"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Ledger Bills</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileSpreadsheet size={18} color="var(--brand-primary-light)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--brand-primary-light)', letterSpacing: '-0.03em' }}>
                  3 Invoices
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--brand-primary-light)' }}>
                    <CheckCircle2 size={13} />
                    <span>GST ITC & Excel exports reconciled</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary-light)', fontWeight: 700 }}>Open Tab →</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('calling')}
                role="button"
                tabIndex={0}
                className="vibe-stat-card vibe-card-glow-amber" 
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)', 
                  position: 'relative',
                }}
                title="Click to open Pooja Sharma's Calling Cockpit"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pooja Sharma (AI SDR)</span>
                    <span style={{ fontSize: '0.66rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontWeight: 700 }}>EMP-AI-01</span>
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneCall size={18} color={business.subscriptionTier !== 'starter' ? '#ec4899' : 'var(--text-dim)'} />
                  </div>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: business.subscriptionTier !== 'starter' ? '#ec4899' : 'var(--text-dim)', letterSpacing: '-0.03em' }}>
                  {business.subscriptionTier !== 'starter' ? `${business.monthlyQuota?.aiCallingMinutesUsed || 0} / ${business.monthlyQuota?.aiCallingMinutes || (business.subscriptionTier === 'premium' ? 600 : 120)} Mins` : 'Locked'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: business.subscriptionTier !== 'starter' ? 'var(--text-muted)' : 'var(--text-dim)' }}>
                    <Activity size={13} color="#ec4899" />
                    <span>{business.subscriptionTier !== 'starter' ? `${callsCount} Calls Dialed • Bilingual Voice` : 'Included in Growth (120m) & Premium'}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 700 }}>Open Desk →</span>
                </div>
              </div>

            </div>

            {/* Live Operational Ticker Feed & Quick Launcher Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              
              {/* Live Autonomous Operations Stream */}
              <div className="vibe-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="var(--brand-whatsapp)" />
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>Live Autonomous Operations Stream</h3>
                  </div>
                  <span className="vibe-live-pill" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    STREAMING
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {liveEvents.map((evt) => {
                    const EvtIcon = evt.icon;
                    return (
                      <div
                        key={evt.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.025)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: `${evt.color}22`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}>
                          <EvtIcon size={14} color={evt.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: evt.color, textTransform: 'uppercase' }}>
                              {evt.tag}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={11} /> {evt.time}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.45' }}>
                            {evt.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Spotlight: Team Ops Chat & Intelligence */}
              <div className="vibe-card vibe-card-glow-indigo" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={20} color="var(--brand-primary-light)" />
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>Team Ops Chat & Intelligence</h3>
                    </div>
                    <span className="badge badge-ai">LIVE INTEL</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '16px' }}>
                    All-in-one mission control chat: site engineers and tender managers chat in Hinglish or English, while Gemini AI automatically extracts:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--brand-whatsapp)', fontWeight: 700 }}>📍 Attendance & GPS</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Extracts attendance by name & site location</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--brand-primary-light)', fontWeight: 700 }}>📊 Live Inventory Value</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Current stock valuation & low-material alerts</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--brand-amber)', fontWeight: 700 }}>🧾 Bill Retrieval</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Look up invoice amount by vendor or date</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>📈 Charts & Heatmaps</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Visual labor attendance and expense graphs</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('ops_chat')} 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  Open Team Chat & Intelligence <ArrowRight size={16} />
                </button>
              </div>

            </div>

            {/* Operation Launch Modules Bento Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              <div className="vibe-card vibe-card-glow-green" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <MessageSquare size={20} color="var(--brand-whatsapp)" />
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>WhatsApp Simulator</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                    Test real bilingual Hinglish/English queries. Simulate site engineers logging 18 labor or buyers requesting valve quotations.
                  </p>
                </div>
                <button onClick={() => setActiveTab('whatsapp')} className="btn btn-whatsapp" style={{ width: '100%', fontSize: '0.82rem' }}>
                  Open Simulator <ArrowRight size={14} />
                </button>
              </div>

              <div className="vibe-card vibe-card-glow-indigo" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Bot size={20} color="var(--brand-primary-light)" />
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>Autonomous AI Employees</h3>
                    </div>
                    <span className="badge badge-ai" style={{ fontSize: '0.62rem' }}>3 ON DUTY</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                    Your dedicated AI team: <strong>Pooja</strong> (Voice Calling SDR), <strong>Kabir</strong> (Performance Ads Manager), and <strong>Neha</strong> (Market Intelligence Officer).
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>📞 Pooja: Voice SDR</span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>📹 Kabir: Video Ads</span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>🌐 Neha: Research</span>
                  </div>
                </div>
                <button onClick={() => setActiveTab('ai_agents')} className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem', borderColor: 'rgba(99, 102, 241, 0.4)', color: 'var(--brand-primary-light)' }}>
                  Manage AI Employees Roster <ArrowRight size={14} />
                </button>
              </div>

              <div className="vibe-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <HardHat size={20} color="#fbbf24" />
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>Staff IDs & Role Engine</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                    Issue credentials (EMP-NOIDA-401) with auto-passwords for site supervisors and tender coordinators.
                  </p>
                </div>
                <button onClick={() => setActiveTab('employees')} className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem' }}>
                  Manage Staff Roster <ArrowRight size={14} />
                </button>
              </div>

              <div className="vibe-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <FileSpreadsheet size={20} color="var(--brand-primary-light)" />
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>Bills & Excel Ledger Hub</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                    Track vendor dues, project kharcha, and download commercial ledgers with one-click Excel/CSV export.
                  </p>
                </div>
                <button onClick={() => setActiveTab('bills')} className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem' }}>
                  Open Accounts Ledger <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB: TEAM OPS CHAT & INTELLIGENCE HUB */}
        {activeTab === 'ops_chat' && (
          <TeamOpsChatHub
            business={business}
            onRefreshData={handleRefreshAll}
          />
        )}

        {/* TAB 2: WHATSAPP SIMULATOR (Bilingual Hinglish / English) */}
        {activeTab === 'whatsapp' && (
          <WhatsAppSimulator
            business={business}
            onRefreshData={handleRefreshAll}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
          />
        )}

        {/* TAB 3: STAFF & ROLE ENGINE */}
        {activeTab === 'employees' && (
          <EmployeeManager onRefresh={handleRefreshAll} />
        )}

        {/* TAB: AUTONOMOUS AI EMPLOYEE AGENTS DEPARTMENT */}
        {(activeTab === 'ai_agents' || activeTab === 'pipeline' || activeTab === 'calling' || activeTab === 'meta_ads' || activeTab === 'connectors' || activeTab === 'ritik') && (
          <AIEmployeeHub
            business={business}
            onRefreshData={handleRefreshAll}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
            initialAgent={
              activeTab === 'pipeline' ? 'pipeline' :
              activeTab === 'calling' ? 'pooja' :
              activeTab === 'meta_ads' ? 'kabir' :
              activeTab === 'connectors' ? 'neha' :
              activeTab === 'ritik' ? 'ritik' : 'all'
            }
            activeLeadForCall={activeLeadForCall}
            onTriggerCallFromLead={handleTriggerCallFromLead}
          />
        )}

        {/* TAB 5: BILLS, GST & EXCEL HUB */}
        {activeTab === 'bills' && (
          <BillsAndExcelHub onRefresh={handleRefreshAll} />
        )}

        {/* TAB 6: SALES PIPELINE */}
        {activeTab === 'sales' && (
          <SalesPipeline
            onRefresh={handleRefreshAll}
            onTriggerCall={handleTriggerCallFromLead}
          />
        )}

        {/* TAB 7: TENDER REPORTS */}
        {activeTab === 'reports' && (
          <TenderReports onRefresh={handleRefreshAll} />
        )}

        {/* TAB 9: SUBSCRIPTIONS & PLANS */}
        {activeTab === 'billing' && (
          <SubscriptionManager
            business={business}
            onRefresh={handleRefreshAll}
          />
        )}

        {/* TAB 10: PROFILE & BUSINESS SETTINGS */}
        {(activeTab === 'profile' || activeTab === 'settings') && (
          <ProfileAndSettings
            business={business}
            onRefresh={handleRefreshAll}
            onNavigateBilling={() => setActiveTab('billing')}
            onToggleTheme={handleToggleTheme}
            currentTheme={theme}
          />
        )}

      </main>

      {/* Floating Vibe Navigation Dock */}
      <QuickVibeDock
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Raycast/Linear Style Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectTab={setActiveTab}
        onTriggerAction={(actionId) => {
          if (actionId === 'guide') setShowGuideModal(true);
        }}
      />

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="vibe-card" style={{ maxWidth: '960px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', background: 'var(--bg-secondary)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Select Business Plan & Unlock Autonomous Voice Agents</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Choose the tier that matches your monthly volume and automation requirements</p>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="btn btn-outline" style={{ padding: '6px 12px' }}>
                Close
              </button>
            </div>
            <SubscriptionManager
              business={business}
              onRefresh={() => {
                handleRefreshAll();
                setShowUpgradeModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Operations Playbook Guide Modal */}
      <OperationsGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* Mobile Bottom Navigation Dock (Visible on Mobile <= 768px) */}
      <nav className="mobile-bottom-nav">
        <button
          onClick={() => setActiveTab('overview')}
          className={`mobile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          aria-label="Fleet Overview"
        >
          <Bot size={20} />
          <span>Fleet</span>
        </button>

        <button
          onClick={() => setActiveTab('ops_chat')}
          className={`mobile-nav-item ${activeTab === 'ops_chat' ? 'active' : ''}`}
          aria-label="Team Ops Chat"
        >
          <Users size={20} />
          <span>Team Ops</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`mobile-nav-item ${activeTab === 'whatsapp' ? 'active' : ''}`}
          aria-label="WhatsApp Simulator"
        >
          <MessageSquare size={20} />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`mobile-nav-item ${activeTab === 'sales' ? 'active' : ''}`}
          aria-label="IndiaMart Leads"
        >
          <Zap size={20} />
          <span>Leads</span>
        </button>

        <button
          onClick={() => setShowCommandPalette(true)}
          className="mobile-nav-item"
          aria-label="More Modules"
        >
          <Layers size={20} />
          <span>More</span>
        </button>
      </nav>

    </div>
  );
}
