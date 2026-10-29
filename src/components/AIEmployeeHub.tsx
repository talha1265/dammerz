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
  Sliders, 
  Award,
  Layers
} from 'lucide-react';
import { Business, SalesLead } from '@/lib/types';
import AICallingStudio from '@/components/AICallingStudio';
import MetaAdsManagerHub from '@/components/MetaAdsManagerHub';
import MarketingConnectorsHub from '@/components/MarketingConnectorsHub';

export type AIAgentId = 'all' | 'pooja' | 'kabir' | 'neha';

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

  const hasVoiceAccess = business.subscriptionTier === 'growth' || business.subscriptionTier === 'premium';
  const callingMinsUsed = business.monthlyQuota?.aiCallingMinutesUsed || 0;
  const callingMinsTotal = business.monthlyQuota?.aiCallingMinutes || (
    business.subscriptionTier === 'premium' ? 600 : business.subscriptionTier === 'growth' ? 120 : 0
  );

  const agents: AIAgentProfile[] = [
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
      specialties: ['Bilingual Speech (Hindi + English)', 'Lead Qualification & B2B Discovery', 'Payment & Kharcha Follow-ups', 'Objection Handling'],
      bio: 'Pooja handles autonomous outbound calls to newly captured buyer leads from IndiaMart, Meta Ads, and website forms. She qualifies purchase requirements, budget, and site delivery deadlines.',
      currentTask: 'Ready to dial inbound/outbound leads with natural speech synthesis.',
      metrics: [
        { label: 'Voice Quota', value: hasVoiceAccess ? `${callingMinsUsed} / ${callingMinsTotal} Mins` : 'Locked (Upgrade to Growth/Prem)', hint: hasVoiceAccess ? `${callingMinsTotal - callingMinsUsed} mins remaining` : 'Requires plan' },
        { label: 'Dialing Mode', value: 'Bilingual AI Voice', hint: 'Hindi & Indian English' },
        { label: 'Agent Status', value: '24/7 Autopilot', hint: 'Instant pickup' },
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
      bio: 'Kabir produces high-retention video ad concepts, generates multiple B2B hooks (problem-solving, contractor proof, bulk pricing), and deploys autonomous Click-to-WhatsApp ad funnels.',
      currentTask: 'Optimizing Click-to-WhatsApp video reels and formulating B2B high-CTR hooks.',
      metrics: [
        { label: 'Creative Engine', value: 'Gemini 3.8 Flash', hint: 'Auto-scripting & hooks' },
        { label: 'Campaign Goal', value: 'WhatsApp Direct Chat', hint: 'Bypass friction' },
        { label: 'Optimization', value: 'Continuous 24/7', hint: 'Cost-per-lead defense' },
      ],
    },
    {
      id: 'neha',
      code: 'EMP-AI-RES03',
      name: 'Neha Verma',
      role: 'AI Market Intelligence & Lead Research Officer',
      department: 'Market Research & Strategic Sourcing',
      avatarBg: 'linear-gradient(135deg, #10b981, #059669)',
      avatarIcon: Globe,
      status: 'researching',
      statusText: 'Active • Scanning Marketplaces & Tenders',
      statusColor: '#10b981',
      shift: '24/7 Autonomous',
      specialties: ['IndiaMart & GeM Marketplace Sync', 'Competitor Catalog & Price Benchmark', 'Tender Opportunity Scouting', 'Automated Lead Enrichment'],
      bio: 'Neha scans external industrial directories, Government e-Marketplace (GeM) tenders, and competitor price lists to feed fresh qualified RFQs straight into your sales pipeline.',
      currentTask: 'Monitoring live commercial feeds, webhook connectors, and market pricing variations.',
      metrics: [
        { label: 'Connected Channels', value: 'IndiaMart, GeM, Google', hint: 'Webhook enabled' },
        { label: 'Market Scope', value: business.category || 'Industrial Supplies', hint: 'Industry focused' },
        { label: 'Lead Sourcing', value: 'Autonomous Intake', hint: 'Real-time sync' },
      ],
    },
  ];

  const currentAgentObj = agents.find(a => a.id === selectedAgent);

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
                <Bot size={13} /> DIGITAL WORKFORCE DEPT
              </span>
              <span className="vibe-live-pill" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                3 AI AGENTS ON ACTIVE DUTY
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Powered by Dammerz Autonomous Multi-Agent Core
              </span>
            </div>
            
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              Autonomous AI Employee Agents
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, maxWidth: '780px' }}>
              Each AI Agent acts as a dedicated full-time specialist on your team. They execute phone sales calls, creative Meta ad campaigns, and market intelligence 24/7 without delays or overhead.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Organization</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{business.name}</div>
            </div>
          </div>
        </div>

        {/* AI Agent Selection Tabs / Quick Desks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Option: All AI Employees Fleet View */}
          <button
            onClick={() => setSelectedAgent('all')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: selectedAgent === 'all' ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'all' ? '1.5px solid var(--brand-primary-light)' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Layers size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedAgent === 'all' ? '#fff' : 'var(--text-main)' }}>
                Workforce Roster
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                All 3 AI Employees
              </div>
            </div>
          </button>

          {/* Pooja Sharma (Voice Calling) */}
          <button
            onClick={() => setSelectedAgent('pooja')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: selectedAgent === 'pooja' ? 'rgba(236, 72, 153, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'pooja' ? '1.5px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <PhoneCall size={20} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedAgent === 'pooja' ? '#fff' : 'var(--text-main)' }}>
                  Pooja Sharma
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Voice SDR • EMP-AI-01
              </div>
            </div>
          </button>

          {/* Kabir Mehta (Ads Manager) */}
          <button
            onClick={() => setSelectedAgent('kabir')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: selectedAgent === 'kabir' ? 'rgba(59, 130, 246, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'kabir' ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Video size={20} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedAgent === 'kabir' ? '#fff' : 'var(--text-main)' }}>
                  Kabir Mehta
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ads Manager • EMP-AI-02
              </div>
            </div>
          </button>

          {/* Neha Verma (Market Researcher) */}
          <button
            onClick={() => setSelectedAgent('neha')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: selectedAgent === 'neha' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedAgent === 'neha' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Globe size={20} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedAgent === 'neha' ? '#fff' : 'var(--text-main)' }}>
                  Neha Verma
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Researcher • EMP-AI-03
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* VIEW 1: FLEET OVERVIEW OF ALL AI EMPLOYEES */}
      {selectedAgent === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
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
                          width: '54px',
                          height: '54px',
                          borderRadius: '14px',
                          background: agent.avatarBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 8px 24px ${agent.statusColor}33`,
                          position: 'relative',
                        }}>
                          <IconComp size={28} color="#fff" />
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
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                              {agent.name}
                            </h3>
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.07)', color: 'var(--text-muted)' }}>
                              {agent.code}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: agent.statusColor, fontWeight: 600 }}>
                            {agent.role}
                          </div>
                        </div>
                      </div>

                      <span className="vibe-live-pill" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
                        AUTONOMOUS
                      </span>
                    </div>

                    {/* Bio & Department */}
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                      {agent.bio}
                    </p>

                    {/* Live Task Strip */}
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      marginBottom: '16px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Activity size={14} color={agent.statusColor} />
                      <span style={{ color: 'var(--text-dim)' }}>Current Duty:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{agent.currentTask}</strong>
                    </div>

                    {/* Skills Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                      {agent.specialties.map((s, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
                      {agent.metrics.map((m, idx) => (
                        <div 
                          key={idx}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px' }}>{m.label}</div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.value}</div>
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
                      padding: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      borderColor: `${agent.statusColor}44`,
                      color: agent.statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    Open {agent.name.split(' ')[0]}&apos;s Work Desk <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW 2: POOJA SHARMA'S WORK DESK (AI Voice Calling & SDR) */}
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
                  Autonomous Tele-Calling & SDR Executive • Speaks Hindi & Indian English • 24/7 Autopilot
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedAgent('all')} 
              className="btn btn-outline" 
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              ← Back to AI Workforce Roster
            </button>
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

      {/* VIEW 3: KABIR MEHTA'S WORK DESK (Meta Ads & Creative Manager) */}
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
              ← Back to AI Workforce Roster
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

      {/* VIEW 4: NEHA VERMA'S WORK DESK (Market Researcher & Intelligence) */}
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
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Neha Verma&apos;s Market Research Desk</strong>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>[EMP-AI-RES03]</span>
                  <span className="vibe-live-pill" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>ON DUTY</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Market Intelligence & Strategic Sourcing • Scans IndiaMart, GeM & Competitor Catalogs
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedAgent('all')} 
              className="btn btn-outline" 
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              ← Back to AI Workforce Roster
            </button>
          </div>

          {/* Underlying Real Connectors & Research Engine */}
          <MarketingConnectorsHub onRefresh={onRefreshData} />
        </div>
      )}

    </div>
  );
}
