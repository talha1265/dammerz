'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CheckCheck, 
  PhoneCall, 
  Zap, 
  Building2, 
  FileText, 
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Navigation,
  MapPin,
  Package,
  HardHat,
  Paperclip,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Phone,
  Video as VideoIcon,
  MoreVertical,
  DollarSign
} from 'lucide-react';
import { WhatsAppMessage, Business } from '@/lib/types';

interface WhatsAppSimulatorProps {
  business: Business;
  onRefreshData: () => void;
  onOpenUpgrade: () => void;
}

export default function WhatsAppSimulator({
  business,
  onRefreshData,
  onOpenUpgrade,
}: WhatsAppSimulatorProps) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [senderName, setSenderName] = useState('Vikram Sharma (Engineer)');
  const [senderPhone, setSenderPhone] = useState('+91 98111 22334');
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/whatsapp');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string, customSender?: string, customPhone?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const currentSender = customSender || senderName;
    const currentPhone = customPhone || senderPhone;

    // Optimistically add user message
    const tempUserMsg: WhatsAppMessage = {
      id: `temp_${Date.now()}`,
      businessId: business.id,
      senderName: currentSender,
      senderPhone: currentPhone,
      text: textToSend,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          senderName: currentSender,
          senderPhone: currentPhone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setLastAction({
          intent: data.intent,
          actionTaken: data.actionTaken,
          reply: data.reply,
        });
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to send WhatsApp message:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    {
      title: 'Crew Attendance & Check-In',
      desc: 'Site supervisor logs crew on tender',
      sender: 'Sunil Sharma (Site Supervisor)',
      phone: '+91 98112 55667',
      icon: HardHat,
      iconColor: 'var(--brand-whatsapp)',
      text: 'Sunil Sharma present on Metro Rail Phase 4 Tender site. 16 workers checked in under my supervision: Ramesh Patel, Suresh Yadav, Dinesh. Work started at 8:00 AM.',
    },
    {
      title: 'Log Working Hours & Overtime',
      desc: 'Record shift hours & calculate wages',
      sender: 'Vikram Sharma (Engineer)',
      phone: '+91 98111 22334',
      icon: Clock,
      iconColor: '#fbbf24',
      text: 'Log 8.5 hours + 1.5 hrs overtime for Ramesh Patel on Metro Rail Tender. Pier 14 shuttering work completed.',
    },
    {
      title: 'Project & Tender Status',
      desc: 'Milestone progress & tender health',
      sender: 'Rajesh Khanna (Project Manager)',
      phone: '+91 98201 11223',
      icon: Building2,
      iconColor: '#60a5fa',
      text: 'What is the current project status and milestone for Metro Rail Phase 4 Tender?',
    },
    {
      title: 'Inventory Stock & Material Intake',
      desc: 'Log cement receipt at site depot',
      sender: 'Arvind Verma (Site Manager)',
      phone: '+91 98110 33445',
      icon: Package,
      iconColor: 'var(--brand-amber)',
      text: 'Received 150 bags of Portland Cement @ 380 per bag at Sector 62 site depot. Please update inventory stock and valuation.',
    },
    {
      title: 'Query Salary & Hours Ledger',
      desc: 'Retrieve staff wages & overtime pay',
      sender: 'Rajiv Mehra (Business Owner)',
      phone: '+91 98765 43210',
      icon: DollarSign,
      iconColor: 'var(--brand-whatsapp)',
      text: 'What are the working hours and salary payable for Ramesh Patel and Vikram Sharma?',
    },
    {
      title: 'Total Inventory Valuation',
      desc: 'Valuation across all depot hubs',
      sender: 'Operations Head',
      phone: '+91 98100 55443',
      icon: Package,
      iconColor: 'var(--brand-amber)',
      text: 'What is our total warehouse inventory value across all hubs?',
    },
    {
      title: 'Vendor Ledger Bill',
      desc: 'Query invoice by company name',
      sender: 'Finance Director',
      phone: '+91 98765 43210',
      icon: FileText,
      iconColor: '#a78bfa',
      text: 'Show bill for Bharat Heavy Steels Ltd',
    },
    {
      title: 'IndiaMart Lead Inquiry',
      desc: 'RFQ for 150 industrial valves',
      sender: 'Harish Chandra (Buyer)',
      phone: '+91 99100 88201',
      icon: Zap,
      iconColor: 'var(--brand-amber)',
      text: 'Urgent inquiry from IndiaMart: Need 150 Butterfly Valves DN200 PN16 rating. Please send best price and delivery time.',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
      
      {/* LEFT: Luxury Titanium Smartphone Simulator Frame */}
      <div style={{
        background: '#070a0e',
        border: '3px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '36px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        height: '760px',
        position: 'relative',
      }}>
        {/* Dynamic Island / Speaker Pill */}
        <div style={{
          width: '90px',
          height: '18px',
          background: '#000000',
          borderRadius: '20px',
          margin: '8px auto 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111827', marginLeft: 'auto', marginRight: '8px' }} />
        </div>

        {/* Status Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 20px 8px',
          fontSize: '0.74rem',
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: 600,
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>5G</span>
            <div style={{ width: '18px', height: '10px', border: '1px solid rgba(255, 255, 255, 0.7)', borderRadius: '3px', padding: '1px' }}>
              <div style={{ width: '70%', height: '100%', background: '#25d366', borderRadius: '1px' }} />
            </div>
          </div>
        </div>

        {/* WhatsApp Mobile Top Bar */}
        <div style={{
          background: '#1f2c34',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(37, 211, 102, 0.35)',
            }}>
              <Bot size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#e9edef' }}>
                  {business.name.split(' ')[0]} AI Desk
                </span>
                <span className="badge badge-whatsapp" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                  VERIFIED
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.71rem', color: '#25d366' }}>
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                <span>Online • 24/7 Operations</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#aebac1' }}>
            <VideoIcon size={17} style={{ cursor: 'pointer' }} />
            <Phone size={16} style={{ cursor: 'pointer' }} />
            <MoreVertical size={16} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Chat Messages Body with WhatsApp background pattern feel */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'linear-gradient(rgba(11, 17, 22, 0.96), rgba(11, 17, 22, 0.96)), repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.012) 0, rgba(255, 255, 255, 0.012) 20px, transparent 0, transparent 40px)',
        }}>
          {/* Security Notice Bubble */}
          <div style={{
            background: 'rgba(37, 211, 102, 0.08)',
            border: '1px solid rgba(37, 211, 102, 0.2)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.7rem',
            color: '#a7f3d0',
            textAlign: 'center',
            margin: '0 auto 6px',
            maxWidth: '92%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}>
            <ShieldCheck size={13} color="var(--brand-whatsapp)" />
            <span>End-to-end synced with Neon PostgreSQL Operations Suite</span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }}
            >
              {/* Sender Name label */}
              <div style={{
                fontSize: '0.68rem',
                color: msg.isBot ? 'var(--brand-whatsapp)' : 'var(--brand-primary-light)',
                fontWeight: 600,
                paddingLeft: msg.isBot ? '6px' : '0',
                paddingRight: msg.isBot ? '0' : '6px',
                textAlign: msg.isBot ? 'left' : 'right',
              }}>
                {msg.senderName}
              </div>

              {/* Message Bubble */}
              <div style={{
                background: msg.isBot ? '#202c33' : '#005c4b',
                color: '#e9edef',
                padding: '10px 14px',
                borderRadius: msg.isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                fontSize: '0.88rem',
                lineHeight: '1.45',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                border: msg.isBot ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
              }}>
                {msg.text}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                  marginTop: '4px',
                  fontSize: '0.68rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}>
                  <span>{msg.timestamp}</span>
                  {!msg.isBot && <CheckCheck size={14} color="#53bdeb" />}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              background: '#202c33',
              borderRadius: '4px 16px 16px 16px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--brand-whatsapp)',
              fontSize: '0.82rem',
            }}>
              <span className="pulse-indicator" style={{ width: '8px', height: '8px' }} />
              <span>Gemini AI is processing operations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            background: '#202c33',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type WhatsApp message..."
            style={{
              flex: 1,
              background: '#2a3942',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#e9edef',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#25d366',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() && !loading ? 'pointer' : 'not-allowed',
              opacity: inputText.trim() && !loading ? 1 : 0.6,
              transition: 'all 0.15s ease',
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* RIGHT: Operational Simulator Controls & Real-Time Sync Inspector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Active Simulation Persona Selector */}
        <div className="vibe-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-main)' }}>
              <User size={18} color="var(--brand-primary-light)" />
              Simulate Active Sender Persona
            </h3>
            <span className="badge badge-whatsapp" style={{ fontSize: '0.68rem' }}>Live Dual-Channel Sync</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 600 }}>
                Sender Contact Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-field"
                style={{ padding: '9px 12px', fontSize: '0.84rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 600 }}>
                Sender WhatsApp Phone #
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="input-field"
                style={{ padding: '9px 12px', fontSize: '0.84rem' }}
              />
            </div>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', margin: 0 }}>
            When this phone number messages, BizzUp auto-identifies if they are an Employee, an IndiaMart Buyer, or a Project/Tender Manager.
          </p>
        </div>

        {/* 1-Click Operations Trigger Cards */}
        <div className="vibe-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-main)' }}>
              <Zap size={18} color="var(--brand-amber)" />
              Instant 1-Click Operational Scenarios
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 600 }}>Select scenario to dispatch</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {quickPrompts.map((q, idx) => {
              const ScenarioIcon = q.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSenderName(q.sender);
                    setSenderPhone(q.phone);
                    handleSendMessage(q.text, q.sender, q.phone);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary-light)';
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.025)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <ScenarioIcon size={14} color={q.iconColor} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                      {q.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {q.desc}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '2px' }}>
                    &quot;{q.text}&quot;
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Action Inspector Feedback */}
        {lastAction && (
          <div className="vibe-card" style={{
            padding: '22px',
            border: '1px solid rgba(37, 211, 102, 0.35)',
            background: 'linear-gradient(180deg, rgba(37, 211, 102, 0.06) 0%, rgba(13, 17, 26, 0.95) 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-whatsapp)', fontWeight: 700 }}>
                <Terminal size={17} />
                <span style={{ fontSize: '0.92rem' }}>AI Neural Engine Execution</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>Gemini 3.8 Flash</span>
                <span className="badge badge-whatsapp" style={{ fontSize: '0.68rem' }}>INTENT: {lastAction.intent.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--brand-whatsapp)" />
              <div>
                <strong>Autonomous DB Action:</strong> {lastAction.actionTaken?.type || 'PROCESSED'}
              </div>
            </div>

            {lastAction.intent === 'ai_call_request' && business.subscriptionTier === 'starter' && (
              <div style={{
                marginTop: '10px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                  AI Calling is included in Growth (120m) & Premium (600m). Upgrade now to enable autonomous dialer.
                </div>
                <button onClick={onOpenUpgrade} className="btn btn-premium" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Unlock Voice Agent
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
