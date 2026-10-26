'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  User, 
  Building2, 
  Briefcase,
  Sparkles,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'staff' | 'bot';
  text: string;
  time: string;
  intent?: string;
  language?: string;
}

export default function StaffPortalPage() {
  const router = useRouter();
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if staff session exists, else load demo staff profile
    const saved = typeof window !== 'undefined' ? localStorage.getItem('bizzup_staff_session') : null;
    if (saved) {
      try {
        setStaffInfo(JSON.parse(saved));
      } catch {
        setDefaultStaff();
      }
    } else {
      setDefaultStaff();
    }

    // Initial greeting in Hinglish & English
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: '👋 Namaste Vikram Sharma ji! Main BizzUp AI Operations Bot hoon.\n\nAap yahan daily duty check-in, labor count, site inspection, tender progress, ya koi bhi issue seedha Hinglish ya English me update kar sakte hain.\n\n_Aapka report direct Business Owner aur Operations Dashboard pe sync hoga._',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  const setDefaultStaff = () => {
    const demo = {
      name: 'Vikram Sharma',
      role: 'Senior Site Project Engineer',
      roleCategory: 'site_engineer',
      siteName: 'Sector 62 Metro Depot Site, Noida',
      staffId: 'EMP-NOIDA-401',
      phone: '+91 98111 22334',
      status: 'on_site',
    };
    setStaffInfo(demo);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `staff_${Date.now()}`,
      sender: 'staff',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/staff/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: staffInfo?.staffId || 'EMP-NOIDA-401',
          text,
          location: staffInfo?.siteName || 'Assigned Site',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: data.intent,
          language: data.languageDetected,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bizzup_staff_session');
    }
    router.push('/login');
  };

  const quickPrompts = [
    {
      label: '👷 Site Check-In',
      text: 'Aaj site pe 18 labor present hain, Pier 42 footing concrete pouring shuru ho gaya hai.',
    },
    {
      label: '📋 Material Status',
      text: 'Cement ReadyMix mixer delivery 1.5 hours late hai, please dispatch coordinator ko alert karein.',
    },
    {
      label: '📑 Tender Submission',
      text: 'IOCL Refinery tender bid documents e-portal pe successfully upload kar diye hain.',
    },
    {
      label: '✅ Daily Duty Wrap-up',
      text: 'Aaj ka day shift work complete ho gaya. 42 meters piping alignment done for today.',
    },
  ];

  return (
    <div className="vibe-bg-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Top Header */}
      <header style={{
        padding: '14px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #25d366, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(37, 211, 102, 0.4)',
          }}>
            <Bot size={22} color="#000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                BizzUp Staff Operations
              </span>
              <span className="badge badge-whatsapp" style={{ fontSize: '0.65rem' }}>
                LIVE CHATBOT
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Bilingual (Hinglish & English) Reporting Desk
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/dashboard" className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            Owner Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '6px 12px', color: 'var(--brand-rose)' }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto', padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Staff Identity Card */}
        {staffInfo && (
          <div className="vibe-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={22} color="var(--brand-primary-light)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.15rem', color: '#fff' }}>{staffInfo.name}</h2>
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                    ID: {staffInfo.staffId}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--brand-primary-light)', fontWeight: 500 }}>
                  {staffInfo.role}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} color="var(--brand-whatsapp)" />
                  <span>{staffInfo.siteName}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-whatsapp">
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                ACTIVE ON SITE
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Synced to Business Owner Portal
              </div>
            </div>
          </div>
        )}

        {/* Chatbot Window */}
        <div className="glass-panel" style={{
          flex: 1,
          minHeight: '440px',
          maxHeight: '60vh',
          background: '#0c1317',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}>
          
          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'linear-gradient(rgba(12, 19, 23, 0.96), rgba(12, 19, 23, 0.96))',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'staff' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{
                  fontSize: '0.68rem',
                  color: msg.sender === 'staff' ? 'var(--brand-primary-light)' : 'var(--brand-whatsapp)',
                  fontWeight: 600,
                  textAlign: msg.sender === 'staff' ? 'right' : 'left',
                }}>
                  {msg.sender === 'staff' ? `${staffInfo?.name || 'Staff'}` : '🤖 BizzUp Operations AI'}
                </div>

                <div style={{
                  background: msg.sender === 'staff' ? '#005c4b' : '#202c33',
                  color: '#e9edef',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'staff' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  border: msg.sender === 'bot' ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                }}>
                  {msg.text}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    marginTop: '6px',
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.45)',
                  }}>
                    <span>{msg.time}</span>
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
                <span>AI update process kar raha hai...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick One-Tap Reporting Chips in Hinglish */}
          <div style={{
            padding: '10px 16px',
            background: '#182229',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand-whatsapp)';
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              background: '#202c33',
              padding: '14px 18px',
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
              placeholder="Yahan Hinglish ya English me update likhein (e.g. Aaj site pe 18 labor hain)..."
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
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() && !loading ? 'pointer' : 'not-allowed',
                opacity: inputText.trim() && !loading ? 1 : 0.6,
              }}
            >
              <Send size={18} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
