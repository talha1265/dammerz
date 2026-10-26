'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  Zap, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  HardHat, 
  FileSpreadsheet, 
  Activity,
  Play,
  Cpu,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState('Aaj site pe 18 labor hain, foundation concrete pouring complete');
  const [demoResponse, setDemoResponse] = useState(
    '✅ *Duty Status & Site Update Log Ho Gaya*\n\nNamaste Vikram,\nSector 62 Metro Depot Site ka daily progress log ho gaya:\n📍 *Site:* Sector 62 Metro Depot Site\n👷 *Labor Count:* 18 Mazdoor Active\n⏰ *Time:* 10:05 AM\n\n_Project Director ko daily briefing me add kar diya gaya hai!_'
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('bizzup_user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          if (parsed && (parsed.phone || parsed.email)) {
            setIsLoggedIn(true);
          }
        } catch (e) {}
      }
      const savedTheme = (localStorage.getItem('bizzup_theme') as 'dark' | 'light') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizzup_theme', next);
      document.documentElement.setAttribute('data-theme', next);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bizzup_user');
      document.cookie = 'bizzup_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setIsLoggedIn(false);
    }
  };

  const samplePrompts = [
    {
      title: '👷 Site Engineer (Hinglish)',
      text: 'Aaj site pe 18 labor hain, foundation concrete pouring shuru ho gaya. ReadyMix mixer aa gaya.',
      reply: '✅ *Duty Status & Site Log Recorded*\n📍 Site: Sector 62 Metro Depot Site\n👷 Labor Count: 18 Mazdoor Active\n⏰ Time: Just now\n📋 Task marked in progress. Owner informed via WhatsApp.',
    },
    {
      title: '📦 IndiaMart Buyer Inquiry',
      text: 'Need 150 Butterfly Valves DN200 urgent delivery. What is best rate with GST invoice?',
      reply: '👋 *Greetings from Apex Industrial*\n📦 Catalog Item: DN200 PN16 Valve\n💰 Unit Rate: ₹3,230 + GST\n📄 Quotation #Q-948 drafted & dispatched to your WhatsApp!',
    },
    {
      title: '📑 Tender Manager (Hinglish/English)',
      text: 'NTPC Super Thermal tender bid submitted. EMD bank guarantee verified. Commercial auction next Tuesday.',
      reply: '📊 *Tender Operations Log Ingested*\n🔍 Summary: NTPC STPP-2026 bid validated.\n⚠️ Risk: Mild steel hedging recommended for raw material buffer.\n📌 Action: Commercial reverse auction scheduled for Tuesday 11:00 AM.',
    },
    {
      title: '💰 Bills & Kharcha Inquiry',
      text: 'Kaveri Steel Mills ka pending bill kitna hai aur payment due kab hai?',
      reply: '💰 *Bills & Accounts Ledger*\n📄 Bill #INV-2026-892\n💵 Pending Amount: ₹1,75,000\n🗓️ Due Date: 15-Oct\n📊 GST Input Tax Credit: Reconciled.',
    },
    {
      title: '🎙️ Autonomous Voice Call (Premium)',
      text: 'Client Harish ko call lagao aur 150 valves ka advance payment confirm karo.',
      reply: '🎙️ *AI Voice Caller Dialing*\n📞 Calling: +91 99100 88201 (Harish Chandra)\n🎯 Goal: Advance payment confirmation\n⏳ Call connected! Live speech synthesis & audio transcript generated.',
    },
  ];

  const handleTestDemo = (text: string, reply: string) => {
    setDemoInput(text);
    setIsTyping(true);
    setTimeout(() => {
      setDemoResponse(reply);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="vibe-bg-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Live Operational Ticker */}
      <div style={{
        background: 'rgba(13, 17, 28, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '6px 20px',
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
          <strong style={{ color: 'var(--brand-whatsapp)' }}>Live Autopilot:</strong>
          <span>1,280+ WhatsApp Operations Handled Today</span>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={12} color="var(--brand-primary-light)" />
          <span>Gemini 3.8 Flash Bilingual Engine (Hinglish/English)</span>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={12} color="var(--brand-amber)" />
          <span>Instant IndiaMart & Google Lead Scoring</span>
        </div>
      </div>

      {/* Top Navigation */}
      <header className="top-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-main)' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(37, 211, 102, 0.4)',
            }}>
              <Bot size={24} color="#fff" />
            </div>
            <div>
              <span className="font-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Dammerz<span style={{ color: 'var(--brand-whatsapp)' }}>.ai</span>
              </span>
              <span className="badge badge-whatsapp" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>
                AI Operations Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <a href="#what-we-do" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              What We Do
            </a>
            <a href="#demo" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              WhatsApp Demo
            </a>
            <a href="#pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Pricing Plans
            </a>
            <Link href="/deck" style={{ color: 'var(--brand-primary-light)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              1-Page Proposal
            </Link>
          </nav>

          {/* CTAs & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            <button
              onClick={handleToggleTheme}
              className="btn btn-outline"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
            </button>

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="btn btn-whatsapp" style={{ fontSize: '0.85rem', padding: '8px 18px', gap: '6px' }}>
                  <LayoutDashboard size={15} />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  title="Sign Out"
                  style={{ fontSize: '0.82rem', padding: '8px 12px', color: 'var(--brand-rose)' }}
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login?tab=staff" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px', borderColor: 'var(--brand-amber)', color: '#fbbf24' }}>
                  <HardHat size={14} />
                  Staff Login
                </Link>
                <Link href="/login" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Client Sign In
                </Link>
                <Link href="/onboard" className="btn btn-whatsapp" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                  Onboard Business
                  <ArrowRight size={15} />
                </Link>
              </>
            )}

          </div>

        </div>
      </header>

      {/* Hero Section with Vibe Aura */}
      <section style={{ padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '6px 16px', borderRadius: '9999px', marginBottom: '24px' }}>
            <span className="pulse-indicator" style={{ width: '8px', height: '8px' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-whatsapp)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Autonomous Business Operations Engine • Gemini AI + WhatsApp
            </span>
          </div>

          <h1 style={{ fontSize: '3.8rem', lineHeight: '1.12', fontWeight: 800, marginBottom: '22px', letterSpacing: '-0.03em' }}>
            Run Your Whole Business Operations <br />
            <span className="gradient-text">Through WhatsApp Messages & AI Agents</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '860px', margin: '0 auto 36px', lineHeight: '1.6' }}>
            Onboard your company, generate unique Staff IDs & passwords for your site engineers and tender managers. Your staff reports daily progress in Hinglish or English on WhatsApp or the mobile portal, while IndiaMart & Google leads, GST bills, and autonomous phone calls run automatically.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link href="/onboard" className="btn btn-whatsapp" style={{ padding: '14px 34px', fontSize: '1.05rem', fontWeight: 700 }}>
              Onboard Your Business Now
              <ArrowRight size={18} />
            </Link>

            <Link href="/login" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Client Business Sign In
            </Link>

            <Link href="/login?tab=staff" className="btn btn-outline" style={{ padding: '14px 24px', fontSize: '1.05rem', borderColor: 'var(--brand-amber)', color: '#fbbf24' }}>
              <HardHat size={16} />
              Staff & Manager Sign In
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--brand-whatsapp)" />
              <span>Bilingual Support (Hinglish & English)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#eb5757" />
              <span>IndiaMart & Google Merchant Connectors</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} color="var(--brand-primary-light)" />
              <span>GST Bills & Excel Ledger Hub</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={18} color="var(--brand-amber)" />
              <span>Autonomous AI Voice Calling Agent</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: Bilingual Interactive WhatsApp Showcase */}
      <section id="demo" style={{ padding: '70px 24px', background: 'rgba(11, 15, 24, 0.7)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="vibe-live-pill" style={{ marginBottom: '10px' }}>INTERACTIVE BILINGUAL DEMO</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '10px', fontWeight: 800 }}>Chat in Hinglish or English — The AI Handles Everything</h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)' }}>
              Click any scenario below to see how staff, clients, and managers communicate with the bot:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 480px) 1fr', gap: '36px', alignItems: 'center' }}>
            
            {/* WhatsApp Phone Mock with Vibe Frame */}
            <div className="vibe-card phone-mockup-frame" style={{
              background: '#0c1317',
              borderRadius: '24px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={22} color="#000" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>BizzUp Operations Bot</div>
                  <div style={{ fontSize: '0.72rem', color: '#25d366' }}>● Online 24/7 • Speaks Hinglish & English</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '260px' }}>
                <div style={{ alignSelf: 'flex-end', background: '#005c4b', color: '#fff', padding: '12px 16px', borderRadius: '16px 4px 16px 16px', maxWidth: '85%', fontSize: '0.88rem', lineHeight: '1.4' }}>
                  {demoInput}
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textAlign: 'right', marginTop: '4px' }}>10:04 AM ✓✓</div>
                </div>

                <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '14px 18px', borderRadius: '4px 16px 16px 16px', maxWidth: '90%', fontSize: '0.88rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {isTyping ? '⚡ Gemini AI is analyzing and logging update...' : demoResponse}
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>10:05 AM</div>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 700 }}>
                Click to Test Common Business Messages:
              </h3>

              {samplePrompts.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleTestDemo(p.text, p.reply)}
                  className={`vibe-card ${demoInput === p.text ? 'vibe-card-glow-green' : ''}`}
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    borderColor: demoInput === p.text ? 'var(--brand-whatsapp)' : 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    &quot;{p.text}&quot;
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: What We Do (Core Pillars Bento Grid) */}
      <section id="what-we-do" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-ai" style={{ marginBottom: '8px' }}>THE OPERATIONS SUITE</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '12px', fontWeight: 800 }}>Engineered for Indian Businesses & Field Operations</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto' }}>
              Site engineers, tender documentation officers, sales reps, and buyers all connect seamlessly.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* Pillar 1 */}
            <div className="vibe-card vibe-card-glow-green" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HardHat size={24} color="var(--brand-whatsapp)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Staff IDs & Chatbot Reporting</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Create staff members with specific roles (Site Engineer @ Noida Depot, Tender Manager @ NTPC Bids). System generates unique Staff IDs and passwords. Staff logs in and reports in Hinglish or English via chatbot.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="vibe-card vibe-card-glow-amber" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(235, 87, 87, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={24} color="#eb5757" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>IndiaMart & Google Connectors</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Connectors automatically pull IndiaMart BuyLeads, Google Shopping inquiries, and GeM bids into your pipeline. Instant quotation calculation and WhatsApp dispatch with GST breakdowns.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="vibe-card vibe-card-glow-indigo" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={24} color="var(--brand-primary-light)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Bills, GST & Excel Hub</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Log vendor invoices, site expenses, and sales bills. Check pending dues over WhatsApp, reconcile 18% GST Input Tax Credits, and export full accounting ledgers as Excel/CSV sheets with 1 click.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="vibe-card vibe-card-glow-amber" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={24} color="var(--brand-amber)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Autonomous AI Voice Caller</h3>
                <span className="badge badge-premium">GROWTH & PREMIUM</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Autonomous phone caller dials IndiaMart leads, answers technical questions, negotiates bulk orders, and confirms purchase orders with speech synthesis and live audio transcripts. Includes 120 mins in Growth and 600 mins in Premium.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: How It Works */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'var(--bg-card-glass)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-whatsapp" style={{ marginBottom: '8px' }}>SIMPLE WORKFLOW</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '12px', fontWeight: 800 }}>How to Put Your Operations on Autopilot</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            <div className="vibe-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-whatsapp)', marginBottom: '8px' }}>01</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>Onboard & Choose Subscription</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Register your business profile, specify product catalogs, and select Starter, Growth, or Premium.
              </p>
            </div>

            <div className="vibe-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary-light)', marginBottom: '8px' }}>02</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>Create Staff IDs & Passwords</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Assign site engineers or tender managers. The engine auto-generates IDs and passwords so staff can log in and update progress via chatbot.
              </p>
            </div>

            <div className="vibe-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-amber)', marginBottom: '8px' }}>03</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>Manage via WhatsApp & Portal</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                As business owner, check staff attendance, leads, bills, and research on WhatsApp or the full web portal.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: Subscription Plans & Pricing */}
      <section id="pricing" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-premium" style={{ marginBottom: '8px' }}>TRANSPARENT PLANS</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '12px', fontWeight: 800 }}>Select Your Business Plan</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
              Transparent pricing with no hidden charges. Upgrade anytime.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            
            {/* Starter */}
            <div className="vibe-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>Starter Business</h3>
                  <span className="badge badge-whatsapp">STARTER</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  For small businesses automating staff check-ins & customer WhatsApp FAQ
                </p>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px' }}>
                  ₹3,999 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-whatsapp)" /> 24/7 WhatsApp Operations Bot</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-whatsapp)" /> Staff ID & Password Generator</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-whatsapp)" /> Bilingual Hinglish & English Chatbot</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-whatsapp)" /> 2,000 WhatsApp Messages / mo</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-whatsapp)" /> Bills & Expense Logging</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>✕ No IndiaMart Lead Sync</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>✕ No AI Voice Calling Agent</div>
                </div>
              </div>

              <Link href="/onboard" className="btn btn-whatsapp" style={{ width: '100%', padding: '12px' }}>
                Enroll in Starter
              </Link>
            </div>

            {/* Growth */}
            <div className="vibe-card vibe-card-glow-indigo" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid var(--brand-primary)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>Growth Enterprise</h3>
                  <span className="badge badge-ai">MOST POPULAR</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  For scaling manufacturers, suppliers & EPC tender contractors
                </p>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--brand-primary-light)', marginBottom: '20px' }}>
                  ₹9,999 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-amber)' }}><Check size={16} color="var(--brand-amber)" /> 🎙️ 120 Mins (2 Hours) AI Voice Calling</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-primary-light)" /> Everything in Starter Plan</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-primary-light)" /> IndiaMart BuyLeads Live Sync</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-primary-light)" /> Google Shopping Feed Sync</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-primary-light)" /> Tender & PM Daily Risk Analysis</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-primary-light)" /> Excel & CSV Ledger Export</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-primary-light)" /> 10,000 WhatsApp Messages / mo</div>
                </div>
              </div>

              <Link href="/onboard" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Enroll in Growth
              </Link>
            </div>

            {/* Premium */}
            <div className="vibe-card vibe-card-glow-amber" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid var(--brand-amber)', background: 'rgba(245, 158, 11, 0.04)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>Premium Autonomous</h3>
                    <Sparkles size={16} color="var(--brand-amber)" />
                  </div>
                  <span className="badge badge-premium">FULL AUTOPILOT</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Full autonomy with AI phone calling and Meta Video Ads Autopilot
                </p>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--brand-amber)', marginBottom: '20px' }}>
                  ₹19,999 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-amber)' }}><Check size={16} color="var(--brand-amber)" /> 🎙️ 600 Mins (10 Hours) AI Voice Calling</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#60a5fa' }}><Check size={16} color="#60a5fa" /> Meta Video Ads AI Autonomous Manager</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-amber)" /> Click-to-WhatsApp Video Reels Generation</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-amber)" /> 35,000 WhatsApp Messages / mo</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-amber)" /> Dedicated Neon PostgreSQL DB</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}><Check size={16} color="var(--brand-amber)" /> Priority Gemini 3.8 Flash LLM</div>
                </div>
              </div>

              <Link href="/onboard" className="btn btn-premium" style={{ width: '100%', padding: '12px' }}>
                Enroll in Premium Suite
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '48px 32px 36px', background: 'rgba(7, 9, 14, 0.98)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
            {/* Brand Col */}
            <div style={{ maxWidth: '340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#fff" />
                </div>
                <span className="font-heading" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  Dammerz<span style={{ color: 'var(--brand-whatsapp)' }}> AI</span>
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 16px' }}>
                Autonomous AI Operations Platform for modern businesses. Bilingual WhatsApp operational chatbots, field staff duty check-ins, sales lead qualification, and tender intelligence.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                📍 Sector 62, Noida, Uttar Pradesh, India - 201309
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Platform
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <a href="#what-we-do" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>What We Do</a>
                <a href="#demo" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>WhatsApp Demo</a>
                <a href="#pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing Plans</a>
                <Link href="/onboard" style={{ color: 'var(--brand-whatsapp)', textDecoration: 'none', fontWeight: 600 }}>Onboard Business</Link>
                <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Client Login</Link>
                <Link href="/login?tab=staff" style={{ color: '#fbbf24', textDecoration: 'none' }}>Staff Portal</Link>
              </div>
            </div>

            {/* Legal & Compliance (Mandatory for Payment Gateways & Meta) */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Legal & Policies
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms & Conditions</Link>
                <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link href="/refund-policy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cancellation & Refund Policy</Link>
                <Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & Grievance Desk</Link>
              </div>
            </div>

            {/* Contact & Support */}
            <div style={{ maxWidth: '280px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Customer Support
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>Email Support:</strong>
                  <a href="mailto:support@dammerz.in" style={{ color: 'var(--brand-whatsapp)', textDecoration: 'none' }}>support@dammerz.in</a>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>Helpline / WhatsApp:</strong>
                  <span>+91 98712 34567</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Mon - Sat: 9:30 AM to 7:00 PM IST
                </div>
              </div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <div>
              © 2026 Dammerz Technologies India Pvt. Ltd. All rights reserved. Registered Indian Business Entity.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms</Link>
              <span>•</span>
              <Link href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy</Link>
              <span>•</span>
              <Link href="/refund-policy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Refunds</Link>
              <span>•</span>
              <Link href="/contact" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
