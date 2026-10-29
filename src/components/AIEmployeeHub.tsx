'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  PhoneCall, 
  Video, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Clock, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  HardHat, 
  ShieldCheck, 
  ChevronRight, 
  UserCheck, 
  MessageSquare, 
  Play, 
  Pause,
  Sliders, 
  Award,
  Layers,
  Send,
  FileText,
  Volume2,
  Check,
  RefreshCw,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Business, SalesLead } from '@/lib/types';
import AICallingStudio from '@/components/AICallingStudio';
import MetaAdsManagerHub from '@/components/MetaAdsManagerHub';
import MarketingConnectorsHub from '@/components/MarketingConnectorsHub';
import WhatsAppSimulator from '@/components/WhatsAppSimulator';

export type AIAgentId = 'all' | 'pipeline' | 'pooja' | 'kabir' | 'neha' | 'ritik';

interface AIEmployeeHubProps {
  business: Business;
  onRefreshData: () => void;
  onOpenUpgrade?: () => void;
  initialAgent?: AIAgentId;
  activeLeadForCall?: SalesLead | null;
  onTriggerCallFromLead?: (lead: SalesLead) => void;
}

export interface AIAgentProfile {
  id: AIAgentId;
  code: string;
  name: string;
  role: string;
  department: string;
  avatarBg: string;
  avatarIcon: any;
  status: 'active' | 'dialing' | 'optimizing' | 'researching';
  statusText: string;
  statusColor: string;
  shift: string;
  specialties: string[];
  bio: string;
  currentTask: string;
  metrics: { label: string; value: string; hint?: string }[];
}

export default function AIEmployeeHub({
  business,
  onRefreshData,
  onOpenUpgrade,
  initialAgent = 'all',
  activeLeadForCall,
  onTriggerCallFromLead,
}: AIEmployeeHubProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgentId>(initialAgent);

  // Sync if initialAgent changes externally
  useEffect(() => {
    if (initialAgent) {
      setSelectedAgent(initialAgent);
    }
  }, [initialAgent]);

  const isPremium = business.subscriptionTier === 'premium';
  const hasVoiceAccess = business.subscriptionTier === 'growth' || business.subscriptionTier === 'premium';
  const callingMinsUsed = business.monthlyQuota?.aiCallingMinutesUsed || 0;
  const callingMinsTotal = business.monthlyQuota?.aiCallingMinutes || (
    business.subscriptionTier === 'premium' ? 600 : business.subscriptionTier === 'growth' ? 120 : 0
  );

  // =========================================================================
  // LIVE AUTONOMOUS SCENARIO STATE: NEHA -> POOJA -> RITIK
  // =========================================================================
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | null>(null);
  const [marketTopic, setMarketTopic] = useState(business.category || 'Industrial Valves & Flow Controls');
  const [step1Result, setStep1Result] = useState<any>(null);
  const [step2Result, setStep2Result] = useState<any>(null);
  const [step3Result, setStep3Result] = useState<any>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [isPlayingAudioSim, setIsPlayingAudioSim] = useState(false);

  // Step 1: Neha Researches & Sorts Market Data
  const handleRunNehaResearch = async () => {
    setPipelineRunning(true);
    setActiveStep(1);
    setPipelineError(null);
    try {
      const res = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_neha_research', customTopic: marketTopic }),
      });
      const data = await res.json();
      if (data.success) {
        setStep1Result(data);
      } else {
        setPipelineError(data.error || 'Failed during Neha market research');
      }
    } catch (e: any) {
      setPipelineError(e.message);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Step 2: Deliver Sorted Data to Pooja (Voice Call)
  const handleDeliverToPooja = async (selectedLead?: any) => {
    setPipelineRunning(true);
    setActiveStep(2);
    setPipelineError(null);
    try {
      const leadPayload = selectedLead || (step1Result?.sortedLeads?.[0]) || {
        clientName: 'Vikram Singhania (Singhania Infra Projects Ltd)',
        phone: '+91 98201 44890',
        productName: '180 Units Heavy Duty Flanged Ball Valves 2" (Class 150)',
        estimatedValue: 1450000,
      };

      const res = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hand_off_to_pooja', leadData: leadPayload }),
      });
      const data = await res.json();
      if (data.success) {
        setStep2Result(data);
        onRefreshData();
      } else {
        setPipelineError(data.error || 'Failed during Pooja call dispatch');
      }
    } catch (e: any) {
      setPipelineError(e.message);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Step 3: Deliver Qualified Lead to Ritik (WhatsApp Messaging)
  const handleDeliverToRitik = async () => {
    setPipelineRunning(true);
    setActiveStep(3);
    setPipelineError(null);
    try {
      const leadPayload = step2Result?.handOffPayload || {
        recipientName: 'Vikram Singhania',
        phone: '+91 98201 44890',
        productName: '180 Units Heavy Duty Flanged Ball Valves 2" (Class 150)',
        totalQuotation: 1539900,
        callId: step2Result?.call?.id,
      };

      const res = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hand_off_to_ritik', leadData: leadPayload }),
      });
      const data = await res.json();
      if (data.success) {
        setStep3Result(data);
        onRefreshData();
      } else {
        setPipelineError(data.error || 'Failed during Ritik WhatsApp dispatch');
      }
    } catch (e: any) {
      setPipelineError(e.message);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Run End-to-End Autonomous Pipeline
  const handleRunFullAutonomousPipeline = async () => {
    setPipelineRunning(true);
    setPipelineError(null);
    setActiveStep(1);

    try {
      // 1. Neha
      const res1 = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_neha_research', customTopic: marketTopic }),
      });
      const data1 = await res1.json();
      if (!data1.success) throw new Error(data1.error || 'Neha step failed');
      setStep1Result(data1);

      // Brief delay for realism
      await new Promise(r => setTimeout(r, 800));
      setActiveStep(2);

      // 2. Pooja
      const res2 = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hand_off_to_pooja', leadData: data1.sortedLeads[0] }),
      });
      const data2 = await res2.json();
      if (!data2.success) throw new Error(data2.error || 'Pooja step failed');
      setStep2Result(data2);

      await new Promise(r => setTimeout(r, 800));
      setActiveStep(3);

      // 3. Ritik
      const res3 = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hand_off_to_ritik', leadData: data2.handOffPayload }),
      });
      const data3 = await res3.json();
      if (!data3.success) throw new Error(data3.error || 'Ritik step failed');
      setStep3Result(data3);

      onRefreshData();
    } catch (e: any) {
      setPipelineError(e.message);
    } finally {
      setPipelineRunning(false);
    }
  };

  // 4 AI Employees Roster
  const agents: AIAgentProfile[] = [
    {
      id: 'neha',
      code: 'EMP-AI-RES03',
      name: 'Neha Verma',
      role: 'AI Market Intelligence & Lead Research Officer',
      department: 'Market Research & Strategic Sourcing',
      avatarBg: 'linear-gradient(135deg, #10b981, #059669)',
      avatarIcon: Globe,
      status: 'researching',
      statusText: isPremium 
        ? 'Active • Scanning IndiaMart B2B & Google Shop (Premium Unlocked)' 
        : 'Active • Scanning Google Shop & Google Search (Base Plan)',
      statusColor: '#10b981',
      shift: '24/7 Autonomous',
      specialties: isPremium
        ? ['IndiaMart B2B BuyLeads (Unlocked 💎)', 'Google Shopping / Merchant Feed', 'Google Organic Search RFQs', 'GeM Tender Opportunity Scouting']
        : ['Google Shopping / Merchant Feed (Active)', 'Google Organic Search Inquiries', 'IndiaMart B2B BuyLeads (🔒 Premium Locked)'],
      bio: isPremium
        ? 'Neha conducts multi-channel research across both IndiaMart B2B BuyLeads and Google Shop/Google simultaneously (Premium Subscription). She priority-sorts verified buyer RFQs and hands them off directly to Pooja.'
        : 'Neha scans Google Shop and Google Search for buyer inquiries on the Base Subscription. Upgrading to Premium unlocks IndiaMart B2B BuyLeads and government tender RFQs, providing high-value procurement RFQs directly to Pooja and Ritik.',
      currentTask: isPremium
        ? 'Researching both IndiaMart and Google Shop; priority-sorting hot buyer RFQs for Pooja.'
        : 'Researching Google Shop & Google Search; IndiaMart BuyLeads locked on Base Plan.',
      metrics: [
        { label: 'Active Channels', value: isPremium ? 'IndiaMart + Google' : 'Google Shop & Search', hint: isPremium ? 'Full B2B access' : 'Base plan scope' },
        { label: 'IndiaMart B2B', value: isPremium ? 'Unlocked 💎' : 'Locked 🔒 (Upgrade)', hint: isPremium ? 'Active scanning' : 'Requires Premium' },
        { label: 'Dispatched to Pooja', value: 'Continuous Hand-off', hint: 'Zero latency' },
      ],
    },
    {
      id: 'pooja',
      code: 'EMP-AI-CALL01',
      name: 'Pooja Sharma',
      role: 'Senior AI Tele-Calling & SDR Executive',
      department: 'Autonomous Sales & Voice Engagement',
      avatarBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      avatarIcon: PhoneCall,
      status: 'active',
      statusText: 'Online • Autonomous Voice Engine Ready',
      statusColor: '#ec4899',
      shift: '24/7 Autonomous (Zero Latency)',
      specialties: ['Bilingual Speech (Hindi + English)', 'Lead Qualification & B2B Discovery', 'Payment & Kharcha Follow-ups', 'Warm Hand-off to WhatsApp'],
      bio: 'Pooja receives sorted buyer leads from Neha and immediately dials them with natural bilingual speech. She verifies project requirements, technical specifications, and delivery urgency. Once verified, she instantly transfers the hot deal to Ritik for WhatsApp closing.',
      currentTask: 'Dialing inbound/outbound leads, qualifying purchase urgency, and dispatching to Ritik.',
      metrics: [
        { label: 'Voice Quota', value: hasVoiceAccess ? `${callingMinsUsed} / ${callingMinsTotal} Mins` : 'Locked (Requires Growth/Prem)', hint: hasVoiceAccess ? `${callingMinsTotal - callingMinsUsed} mins remaining` : 'Plan gated' },
        { label: 'Speech Synthesis', value: 'Bilingual (Hindi/Eng)', hint: 'Natural tonality' },
        { label: 'Hand-off Target', value: 'Ritik (WhatsApp Desk)', hint: 'Immediate transfer' },
      ],
    },
    {
      id: 'ritik',
      code: 'EMP-AI-WA04',
      name: 'Ritik Sharma',
      role: 'AI WhatsApp Messaging & Deal Closing Specialist',
      department: 'Autonomous WhatsApp Sales & Direct Communication',
      avatarBg: 'linear-gradient(135deg, #25d366, #128c7e)',
      avatarIcon: MessageSquare,
      status: 'active',
      statusText: 'Online • Instant WhatsApp Dispatch Active',
      statusColor: '#25d366',
      shift: '24/7 Instant Auto-Reply (< 5 sec)',
      specialties: ['Instant Proforma Quotation Dispatch', 'Hinglish Negotiation & Deal Closing', 'PDF Catalog & Test Certs Delivery', 'Razorpay Advance Link Integration'],
      bio: 'Ritik is the deal closer. Right after Pooja finishes her call with the client, Ritik automatically crafts and dispatches an itemized WhatsApp quotation with proforma invoice, technical drawings, and advance payment links, closing deals on autopilot.',
      currentTask: 'Delivering instant proforma invoices on WhatsApp and handling buyer counter-offers.',
      metrics: [
        { label: 'Dispatch Speed', value: '< 5 Seconds', hint: 'Instant post-call trigger' },
        { label: 'Format', value: 'PDF Quote + Itemized', hint: 'With Razorpay link' },
        { label: 'Read & Open Rate', value: '98.6%', hint: 'Direct WhatsApp engagement' },
      ],
    },
    {
      id: 'kabir',
      code: 'EMP-AI-ADS02',
      name: 'Kabir Mehta',
      role: 'AI Performance Ads & Creative Campaign Manager',
      department: 'Autonomous Marketing & Paid Acquisition',
      avatarBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      avatarIcon: Video,
      status: 'optimizing',
      statusText: 'Active • Analyzing Reels & B2B CTR',
      statusColor: '#3b82f6',
      shift: '24/7 Autonomous',
      specialties: ['High-Converting B2B Hooks', 'Industrial Reel Creative Optimization', 'Click-to-WhatsApp Meta Ads', 'Lead Cost Reduction'],
      bio: 'Kabir produces high-retention video ad concepts, generates multiple B2B hooks (problem-solving, contractor proof, bulk pricing), and deploys autonomous Click-to-WhatsApp ad funnels that feed fresh buyer inquiries into the pipeline.',
      currentTask: 'Optimizing Click-to-WhatsApp video reels and formulating B2B high-CTR hooks.',
      metrics: [
        { label: 'Creative Engine', value: 'Gemini 3.8 Flash', hint: 'Auto-scripting & hooks' },
        { label: 'Campaign Goal', value: 'WhatsApp Direct Chat', hint: 'Bypass friction' },
        { label: 'Optimization', value: 'Continuous 24/7', hint: 'Cost-per-lead defense' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* AI Workforce Department Master Header */}
      <div className="vibe-card" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(20, 27, 44, 0.95) 0%, rgba(13, 17, 28, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-ai" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Bot size={13} /> DIGITAL AI WORKFORCE
              </span>
              <span className="vibe-live-pill" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                4 AI AGENTS ON ACTIVE DUTY
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Powered by Dammerz Autonomous Multi-Agent Core
              </span>
            </div>
            
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              Autonomous AI Employee Agents
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, maxWidth: '820px' }}>
              Your dedicated 24/7 AI staff: <strong>Neha</strong> finds & sorts market buyer leads ➔ delivers to <strong>Pooja</strong> for phone qualification ➔ hands off to <strong>Ritik</strong> for instant WhatsApp proforma closing.
            </p>
          </div>

          <button
            onClick={() => setSelectedAgent('pipeline')}
            className="btn btn-whatsapp"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(37, 211, 102, 0.35)',
            }}
          >
            <Zap size={16} /> Run Working Scenario (Neha ➔ Pooja ➔ Ritik)
          </button>
        </div>

        {/* AI Agent Selection Tabs / Quick Desks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Option: Live Working Scenario */}
          <button
            onClick={() => setSelectedAgent('pipeline')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: selectedAgent === 'pipeline' ? 'rgba(37, 211, 102, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'pipeline' ? '1.5px solid var(--brand-whatsapp)' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #25d366, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedAgent === 'pipeline' ? '#25d366' : 'var(--text-main)' }}>
                Live Scenario
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Neha ➔ Pooja ➔ Ritik
              </div>
            </div>
          </button>

          {/* Option: All AI Employees Fleet View */}
          <button
            onClick={() => setSelectedAgent('all')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: selectedAgent === 'all' ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'all' ? '1.5px solid var(--brand-primary-light)' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Layers size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedAgent === 'all' ? '#fff' : 'var(--text-main)' }}>
                All 4 AI Staff
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Team Roster
              </div>
            </div>
          </button>

          {/* Neha Verma (Market Researcher) */}
          <button
            onClick={() => setSelectedAgent('neha')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: selectedAgent === 'neha' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'neha' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Globe size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedAgent === 'neha' ? '#fff' : 'var(--text-main)' }}>
                Neha Verma
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                1. Market Research
              </div>
            </div>
          </button>

          {/* Pooja Sharma (Voice Calling) */}
          <button
            onClick={() => setSelectedAgent('pooja')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: selectedAgent === 'pooja' ? 'rgba(236, 72, 153, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'pooja' ? '1.5px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <PhoneCall size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedAgent === 'pooja' ? '#fff' : 'var(--text-main)' }}>
                Pooja Sharma
              </div>
              <div style={{ fontSize: '0.7rem', color: '#ec4899' }}>
                2. Voice SDR Calling
              </div>
            </div>
          </button>

          {/* Ritik Sharma (WhatsApp Messaging) */}
          <button
            onClick={() => setSelectedAgent('ritik')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: selectedAgent === 'ritik' ? 'rgba(37, 211, 102, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'ritik' ? '1.5px solid #25d366' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MessageSquare size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedAgent === 'ritik' ? '#fff' : 'var(--text-main)' }}>
                Ritik Sharma
              </div>
              <div style={{ fontSize: '0.7rem', color: '#25d366' }}>
                3. WhatsApp Closer
              </div>
            </div>
          </button>

          {/* Kabir Mehta (Ads Manager) */}
          <button
            onClick={() => setSelectedAgent('kabir')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: selectedAgent === 'kabir' ? 'rgba(59, 130, 246, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'kabir' ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Video size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedAgent === 'kabir' ? '#fff' : 'var(--text-main)' }}>
                Kabir Mehta
              </div>
              <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>
                Video Ads Manager
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: LIVE WORKING SCENARIO (NEHA -> POOJA -> RITIK)
         ========================================================================= */}
      {selectedAgent === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Pipeline Interactive Control Center */}
          <div className="vibe-card vibe-card-glow-green" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-whatsapp" style={{ fontSize: '0.72rem' }}>AUTONOMOUS PIPELINE</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Multi-Agent Collaboration Engine</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 4px', fontWeight: 800 }}>
                  Live Working Scenario: Neha ➔ Pooja ➔ Ritik
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Watch market data get scanned by Neha, sorted, passed to Pooja for voice qualification, and immediately dispatched to Ritik for WhatsApp closing.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text"
                  value={marketTopic}
                  onChange={(e) => setMarketTopic(e.target.value)}
                  placeholder="Market category / product..."
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    width: '240px',
                  }}
                />
                <button
                  onClick={handleRunFullAutonomousPipeline}
                  disabled={pipelineRunning}
                  className="btn btn-whatsapp"
                  style={{
                    padding: '10px 18px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: pipelineRunning ? 0.7 : 1,
                  }}
                >
                  {pipelineRunning ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
                  {pipelineRunning ? 'Executing Pipeline...' : 'Run Full Pipeline (1-Click)'}
                </button>
              </div>
            </div>

            {/* Visual Workflow Steps Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
              padding: '16px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              {/* Step 1 Card */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: activeStep === 1 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: activeStep === 1 ? '1.5px solid #10b981' : step1Result ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={16} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>1. Neha Verma</div>
                      <div style={{ fontSize: '0.68rem', color: '#10b981' }}>EMP-AI-RES03</div>
                    </div>
                  </div>
                  {step1Result ? (
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                      ✓ DATA SORTED
                    </span>
                  ) : activeStep === 1 ? (
                    <span className="pulse-indicator" style={{ width: '8px', height: '8px' }} />
                  ) : null}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {isPremium 
                    ? '💎 Premium Plan: Scans both IndiaMart B2B BuyLeads and Google Shop/Google simultaneously.'
                    : 'ℹ️ Base Plan: Scans Google Shop & Google Search only. (IndiaMart locked)'}
                </div>
                {!isPremium && onOpenUpgrade && (
                  <button
                    onClick={onOpenUpgrade}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-amber)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '4px 0 0',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    Unlock IndiaMart B2B on Premium →
                  </button>
                )}
                <button
                  onClick={handleRunNehaResearch}
                  disabled={pipelineRunning}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '6px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Step 1: Run Neha Research
                </button>
              </div>

              {/* Step 2 Card */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: activeStep === 2 ? 'rgba(236, 72, 153, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: activeStep === 2 ? '1.5px solid #ec4899' : step2Result ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PhoneCall size={16} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>2. Pooja Sharma</div>
                      <div style={{ fontSize: '0.68rem', color: '#ec4899' }}>EMP-AI-CALL01</div>
                    </div>
                  </div>
                  {step2Result ? (
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', fontWeight: 700 }}>
                      ✓ QUALIFIED & CALLED
                    </span>
                  ) : activeStep === 2 ? (
                    <span className="pulse-indicator" style={{ width: '8px', height: '8px' }} />
                  ) : null}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Dials the sorted buyer lead in bilingual Hindi/English, confirms specs, and sets up WhatsApp close.
                </div>
                <button
                  onClick={() => handleDeliverToPooja()}
                  disabled={pipelineRunning}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '6px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    color: '#f472b6',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Step 2: Deliver to Pooja & Call
                </button>
              </div>

              {/* Step 3 Card */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: activeStep === 3 ? 'rgba(37, 211, 102, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: activeStep === 3 ? '1.5px solid #25d366' : step3Result ? '1px solid rgba(37, 211, 102, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={16} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>3. Ritik Sharma</div>
                      <div style={{ fontSize: '0.68rem', color: '#25d366' }}>EMP-AI-WA04</div>
                    </div>
                  </div>
                  {step3Result ? (
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(37, 211, 102, 0.2)', color: '#25d366', fontWeight: 700 }}>
                      ✓ QUOTE SENT ON WA
                    </span>
                  ) : activeStep === 3 ? (
                    <span className="pulse-indicator" style={{ width: '8px', height: '8px' }} />
                  ) : null}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Generates and dispatches formal proforma quotation on WhatsApp with itemized specs & payment link.
                </div>
                <button
                  onClick={handleDeliverToRitik}
                  disabled={pipelineRunning}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '6px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(37, 211, 102, 0.15)',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    color: '#25d366',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Step 3: Deliver to Ritik (WA)
                </button>
              </div>
            </div>

            {pipelineError && (
              <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.82rem' }}>
                ⚠️ Pipeline alert: {pipelineError}
              </div>
            )}
          </div>

          {/* Live Pipeline Output Cockpit */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            
            {/* STAGE 1 OUTPUT: NEHA'S SORTED MARKET LEADS */}
            <div className="vibe-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} color="#10b981" />
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
                    Stage 1: Neha&apos;s Sorted Market Leads
                  </h3>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>EMP-AI-RES03</span>
              </div>

              {step1Result?.sortedLeads ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {step1Result?.isIndiaMartLocked && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(251, 191, 36, 0.08)',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                      fontSize: '0.74rem',
                      color: '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}>
                      <span>🔒 <strong>Base Plan:</strong> Researching Google Shop & Google Search. IndiaMart locked.</span>
                      {onOpenUpgrade && (
                        <button 
                          onClick={onOpenUpgrade}
                          style={{
                            background: '#fbbf24',
                            color: '#111',
                            border: 'none',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Unlock IndiaMart
                        </button>
                      )}
                    </div>
                  )}

                  {step1Result.sortedLeads.map((ld: any, idx: number) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div>
                          <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>{ld.clientName}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{ld.location} • {ld.phone}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                            🔥 Match {ld.aiScore}%
                          </span>
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: ld.source === 'indiamart' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: ld.source === 'indiamart' ? '#f472b6' : '#60a5fa',
                            fontWeight: 600,
                          }}>
                            {ld.sourceLabel || (ld.source === 'indiamart' ? 'IndiaMart RFQ' : 'Google Shop')}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary-light)', margin: '4px 0', fontWeight: 600 }}>
                        {ld.productName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Budget: <strong>₹{(ld.estimatedValue || 0).toLocaleString('en-IN')}</strong> • {ld.deliveryUrgency}
                      </div>
                      <button
                        onClick={() => handleDeliverToPooja(ld)}
                        disabled={pipelineRunning}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '5px', fontSize: '0.74rem', borderColor: 'rgba(236, 72, 153, 0.4)', color: '#ec4899' }}
                      >
                        📞 Send this lead to Pooja for Instant Call →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.84rem' }}>
                  Click <strong>&quot;Run Full Pipeline&quot;</strong> or <strong>&quot;Step 1: Run Neha Research&quot;</strong> to scan commercial portals and extract sorted buyer leads.
                </div>
              )}
            </div>

            {/* STAGE 2 OUTPUT: POOJA'S LIVE CALL TRANSCRIPT */}
            <div className="vibe-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneCall size={18} color="#ec4899" />
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
                    Stage 2: Pooja&apos;s Voice Discovery Call
                  </h3>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#ec4899', fontWeight: 600 }}>EMP-AI-CALL01</span>
              </div>

              {step2Result?.transcript ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(236, 72, 153, 0.08)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    fontSize: '0.76rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span>Duration: <strong>{step2Result.call?.durationSeconds || 114}s</strong> • Sentiment: <strong style={{ color: '#25d366' }}>Positive</strong></span>
                    <button
                      onClick={() => setIsPlayingAudioSim(!isPlayingAudioSim)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#ec4899',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Volume2 size={12} /> {isPlayingAudioSim ? 'Pause Voice' : 'Play Speech'}
                    </button>
                  </div>

                  <div style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                  }}>
                    {step2Result.transcript.map((msg: any, idx: number) => {
                      const isAgent = msg.speaker === 'agent';
                      return (
                        <div
                          key={idx}
                          style={{
                            alignSelf: isAgent ? 'flex-start' : 'flex-end',
                            maxWidth: '88%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: isAgent ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            border: isAgent ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <div style={{ fontSize: '0.68rem', color: isAgent ? '#f472b6' : 'var(--text-dim)', marginBottom: '2px', fontWeight: 700 }}>
                            {isAgent ? 'Pooja (AI Calling Agent)' : 'Client (Buyer)'} • {msg.time}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleDeliverToRitik}
                    disabled={pipelineRunning}
                    className="btn btn-whatsapp"
                    style={{ width: '100%', padding: '7px', fontSize: '0.78rem' }}
                  >
                    💬 Deliver Verified Call to Ritik (WhatsApp) →
                  </button>
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.84rem' }}>
                  Awaiting hand-off from Neha. Once Neha extracts leads, Pooja will dial the client to qualify requirements.
                </div>
              )}
            </div>

            {/* STAGE 3 OUTPUT: RITIK'S WHATSAPP QUOTATION */}
            <div className="vibe-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="#25d366" />
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
                    Stage 3: Ritik&apos;s WhatsApp Quotation
                  </h3>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#25d366', fontWeight: 600 }}>EMP-AI-WA04</span>
              </div>

              {step3Result?.whatsappText ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* WhatsApp Message Bubble Simulation */}
                  <div style={{
                    background: '#0b141a',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid rgba(37, 211, 102, 0.2)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingBottom: '8px',
                      marginBottom: '10px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bot size={15} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Ritik Sharma [EMP-AI-WA04]</div>
                          <div style={{ fontSize: '0.65rem', color: '#25d366' }}>Online • Dammerz WhatsApp Desk</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Sent Just Now ✓✓</span>
                    </div>

                    <pre style={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      fontSize: '0.78rem',
                      color: '#e9edef',
                      lineHeight: '1.5',
                      margin: 0,
                    }}>
                      {step3Result.whatsappText}
                    </pre>

                    <div style={{
                      marginTop: '12px',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(37, 211, 102, 0.1)',
                      border: '1px solid rgba(37, 211, 102, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                    }}>
                      <span style={{ color: '#25d366', fontWeight: 700 }}>✓ Attached: Proforma_Invoice_904.pdf</span>
                      <span style={{ color: 'var(--text-dim)' }}>1.4 MB</span>
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(37, 211, 102, 0.08)',
                    fontSize: '0.75rem',
                    color: '#25d366',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <CheckCircle2 size={14} />
                    <span>Complete autonomous loop finished! Deal logged in Sales Pipeline.</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.84rem' }}>
                  Awaiting hand-off from Pooja. Once Pooja concludes the call, Ritik automatically formats and delivers the WhatsApp proforma.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: FLEET OVERVIEW OF ALL 4 AI EMPLOYEES
         ========================================================================= */}
      {selectedAgent === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {agents.map((agent) => {
              const IconComp = agent.avatarIcon;
              return (
                <div 
                  key={agent.id}
                  className="vibe-card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div>
                    {/* Header: Photo, Code & Status */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '14px',
                          background: agent.avatarBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 8px 24px ${agent.statusColor}33`,
                          position: 'relative',
                        }}>
                          <IconComp size={26} color="#fff" />
                          <span style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#25d366',
                            border: '2px solid var(--bg-primary)',
                          }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                              {agent.name}
                            </h3>
                            <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.07)', color: 'var(--text-muted)' }}>
                              {agent.code}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: agent.statusColor, fontWeight: 600 }}>
                            {agent.role}
                          </div>
                        </div>
                      </div>

                      <span className="vibe-live-pill" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        AUTONOMOUS
                      </span>
                    </div>

                    {/* Bio & Department */}
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                      {agent.bio}
                    </p>

                    {/* Live Task Strip */}
                    <div style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      marginBottom: '14px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Activity size={13} color={agent.statusColor} />
                      <span style={{ color: 'var(--text-dim)' }}>Duty:</span>
                      <strong style={{ color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.currentTask}</strong>
                    </div>

                    {/* Skills Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                      {agent.specialties.map((s, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 7px',
                            borderRadius: '5px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-muted)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                      {agent.metrics.map((m, idx) => (
                        <div 
                          key={idx}
                          style={{
                            padding: '7px 9px',
                            borderRadius: '7px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '2px' }}>{m.label}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open Agent Desk Button */}
                  <button
                    onClick={() => setSelectedAgent(agent.id)}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '9px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      borderColor: `${agent.statusColor}44`,
                      color: agent.statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    Open {agent.name.split(' ')[0]}&apos;s Work Desk <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 3: NEHA VERMA'S WORK DESK (AI Market Intelligence & Lead Sourcing)
         ========================================================================= */}
      {selectedAgent === 'neha' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Agent Desk Header */}
          <div className="vibe-card" style={{
            padding: '16px 20px',
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Globe size={22} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Neha Verma&apos;s Market Intelligence Desk</strong>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>[EMP-AI-RES03]</span>
                  <span className="vibe-live-pill" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>ON DUTY</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isPremium 
                    ? '💎 Premium Plan: Active research on both IndiaMart B2B & Google Shop/Google simultaneously'
                    : 'ℹ️ Base Plan: Active research on Google Shop & Google Search (IndiaMart B2B requires Premium upgrade)'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setSelectedAgent('pipeline')} 
                className="btn btn-whatsapp" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                ⚡ Trigger Pipeline to Pooja & Ritik
              </button>
              <button 
                onClick={() => setSelectedAgent('all')} 
                className="btn btn-outline" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                ← Back to Team Roster
              </button>
            </div>
          </div>

          {/* Underlying Real Connectors & Research Engine */}
          <MarketingConnectorsHub onRefresh={onRefreshData} />
        </div>
      )}

      {/* =========================================================================
          VIEW 4: POOJA SHARMA'S WORK DESK (AI Voice Calling & SDR)
         ========================================================================= */}
      {selectedAgent === 'pooja' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Agent Desk Header */}
          <div className="vibe-card" style={{
            padding: '16px 20px',
            background: 'rgba(236, 72, 153, 0.06)',
            border: '1px solid rgba(236, 72, 153, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <PhoneCall size={22} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Pooja Sharma&apos;s Calling Cockpit</strong>
                  <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 700 }}>[EMP-AI-CALL01]</span>
                  <span className="vibe-live-pill" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>ON DUTY</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Autonomous Tele-Calling & SDR Executive • Speaks Hindi & Indian English • Hands off to Ritik
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setSelectedAgent('ritik')} 
                className="btn btn-whatsapp" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                💬 Open Ritik&apos;s WhatsApp Desk →
              </button>
              <button 
                onClick={() => setSelectedAgent('all')} 
                className="btn btn-outline" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                ← Back to Team Roster
              </button>
            </div>
          </div>

          {/* Underlying Real Calling Engine */}
          <AICallingStudio
            business={business}
            onRefresh={onRefreshData}
            onOpenUpgrade={onOpenUpgrade || (() => {})}
            initialLead={activeLeadForCall}
          />
        </div>
      )}

      {/* =========================================================================
          VIEW 5: RITIK SHARMA'S WORK DESK (AI WhatsApp Messaging & Deal Closing)
         ========================================================================= */}
      {selectedAgent === 'ritik' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Agent Desk Header */}
          <div className="vibe-card" style={{
            padding: '16px 20px',
            background: 'rgba(37, 211, 102, 0.06)',
            border: '1px solid rgba(37, 211, 102, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #25d366, #128c7e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MessageSquare size={22} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Ritik Sharma&apos;s WhatsApp Closing Cockpit</strong>
                  <span style={{ fontSize: '0.72rem', color: '#25d366', fontWeight: 700 }}>[EMP-AI-WA04]</span>
                  <span className="vibe-live-pill" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>ON DUTY</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Deal Closing & Messaging Specialist • Receives Leads from Pooja • Dispatches Proforma Invoices
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setSelectedAgent('pipeline')} 
                className="btn btn-whatsapp" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                ⚡ Run Autonomous Flow
              </button>
              <button 
                onClick={() => setSelectedAgent('all')} 
                className="btn btn-outline" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                ← Back to Team Roster
              </button>
            </div>
          </div>

          {/* Underlying Real WhatsApp Engine */}
          <WhatsAppSimulator
            business={business}
            onRefreshData={onRefreshData}
            onOpenUpgrade={onOpenUpgrade || (() => {})}
          />
        </div>
      )}

      {/* =========================================================================
          VIEW 6: KABIR MEHTA'S WORK DESK (Meta Ads & Creative Manager)
         ========================================================================= */}
      {selectedAgent === 'kabir' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Agent Desk Header */}
          <div className="vibe-card" style={{
            padding: '16px 20px',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Video size={22} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Kabir Mehta&apos;s Creative Ad Cockpit</strong>
                  <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 700 }}>[EMP-AI-ADS02]</span>
                  <span className="vibe-live-pill" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>ON DUTY</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Performance Video Ads & Creative Manager • Generates High-Converting B2B Hooks • Click-to-WhatsApp Ads
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedAgent('all')} 
              className="btn btn-outline" 
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              ← Back to Team Roster
            </button>
          </div>

          {/* Underlying Real Meta Ads Engine */}
          <MetaAdsManagerHub
            business={business}
            onRefreshData={onRefreshData}
            onTriggerCall={onTriggerCallFromLead}
          />
        </div>
      )}

    </div>
  );
}
