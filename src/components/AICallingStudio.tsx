'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Phone,
  Bot,
  Sparkles, 
  Lock, 
  Play, 
  Square, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  User, 
  PhoneOutgoing, 
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { AICall, Business } from '@/lib/types';

interface AICallingStudioProps {
  business: Business;
  onRefresh: () => void;
  onOpenUpgrade: () => void;
  initialLead?: any;
}

export default function AICallingStudio({
  business,
  onRefresh,
  onOpenUpgrade,
  initialLead,
}: AICallingStudioProps) {
  const hasVoiceAccess = business.subscriptionTier === 'growth' || business.subscriptionTier === 'premium';
  const callingMinsTotal = business.monthlyQuota.aiCallingMinutes ?? (
    business.subscriptionTier === 'premium' ? 600 : business.subscriptionTier === 'growth' ? 120 : 0
  );
  const callingMinsUsed = business.monthlyQuota.aiCallingMinutesUsed ?? 0;
  const [calls, setCalls] = useState<AICall[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCalling, setActiveCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<string>('idle');
  const [currentCallData, setCurrentCallData] = useState<any>(null);
  const [selectedCall, setSelectedCall] = useState<AICall | null>(null);

  const [callForm, setCallForm] = useState({
    recipientName: initialLead ? initialLead.clientName : '',
    phone: initialLead ? initialLead.phone : '',
    goal: 'lead_qualification',
  });

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/calls');
      const data = await res.json();
      if (data.success) {
        setCalls(data.calls);
        if (data.calls.length > 0 && !selectedCall) {
          setSelectedCall(data.calls[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  useEffect(() => {
    if (initialLead) {
      setCallForm({
        recipientName: initialLead.clientName,
        phone: initialLead.phone,
        goal: 'lead_qualification',
      });
    }
  }, [initialLead]);

  // Voice Speech Synthesis simulation using Web Speech API
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasVoiceAccess) {
      onOpenUpgrade();
      return;
    }

    setActiveCalling(true);
    setCallStatus('dialing');

    try {
      // Step 1: Dialing state for 2 seconds
      await new Promise((r) => setTimeout(r, 2000));
      setCallStatus('connected');

      // Call API
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callForm),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentCallData(data.call);
        setSelectedCall(data.call);
        setCallStatus('completed');

        // Speak the agent's first dialogue aloud
        if (data.call.transcript && data.call.transcript.length > 0) {
          speakText(data.call.transcript[0].text);
        }

        fetchCalls();
        onRefresh();
      } else {
        setCallStatus('failed');
      }
    } catch (err) {
      console.error('Call failed:', err);
      setCallStatus('failed');
    } finally {
      setTimeout(() => {
        setActiveCalling(false);
      }, 4000);
    }
  };

  const getSentimentBadge = (sentiment: AICall['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <span className="badge badge-whatsapp">Positive / High Intent</span>;
      case 'urgent':
        return <span className="badge badge-busy">Urgent Action</span>;
      default:
        return <span className="badge badge-ai">Neutral Follow-up</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="vibe-card" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        border: hasVoiceAccess ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
        background: hasVoiceAccess ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-card)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: hasVoiceAccess ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hasVoiceAccess ? '0 0 25px rgba(245, 158, 11, 0.4)' : 'none',
          }}>
            <PhoneCall size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>Autonomous AI Voice Calling Studio</h2>
              <span className={hasVoiceAccess ? 'badge badge-premium' : 'badge badge-busy'}>
                {hasVoiceAccess ? `${business.subscriptionTier.toUpperCase()} ACTIVE • ${callingMinsTotal} MINS` : 'GROWTH & PREMIUM ONLY'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Deploy AI agents that place real phone calls to qualify IndiaMart leads, negotiate prices, and follow up on tenders.
            </p>
          </div>
        </div>

        {!hasVoiceAccess ? (
          <button onClick={onOpenUpgrade} className="btn btn-premium" style={{ padding: '10px 20px' }}>
            <Sparkles size={16} />
            Upgrade to Growth (120m) or Premium (600m)
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Monthly Voice Calling Allocation</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                {callingMinsUsed} / {callingMinsTotal} Mins Used
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left Call Controller & Right Transcript/Audio Player */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
        
        {/* LEFT: Dial AI Voice Call Form */}
        <div className="vibe-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneOutgoing size={18} color="var(--brand-amber)" />
              Initiate Outbound AI Call
            </h3>
            {hasVoiceAccess ? (
              <span className="badge badge-whatsapp">Agent Ready</span>
            ) : (
              <span className="badge badge-busy">Locked</span>
            )}
          </div>

          {!hasVoiceAccess ? (
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}>
              <Lock size={36} color="var(--brand-amber)" />
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Available in Growth & Premium</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                AI Calling autonomous phone agents can dial prospects across India, negotiate deals in real time, and auto-generate transcripts. Included: 120 Mins in Growth and 600 Mins in Premium.
              </p>
              <button onClick={onOpenUpgrade} className="btn btn-premium" style={{ width: '100%', marginTop: '6px' }}>
                Unlock AI Calling Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleStartCall} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Lead / Client Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={callForm.recipientName}
                  onChange={(e) => setCallForm({ ...callForm, recipientName: e.target.value })}
                  placeholder="e.g. Harish Chandra"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Target Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={callForm.phone}
                  onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
                  placeholder="+91 99..."
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Autonomous Calling Objective *
                </label>
                <select
                  value={callForm.goal}
                  onChange={(e) => setCallForm({ ...callForm, goal: e.target.value })}
                  className="input-field"
                >
                  <option value="lead_qualification">IndiaMart Lead Qualification & Quotation</option>
                  <option value="tender_followup">Government / Private Tender Commercial Follow-up</option>
                  <option value="payment_reminder">Pending Invoice / Milestone Payment Follow-up</option>
                  <option value="order_confirmation">Dispatch & Warehouse Delivery Confirmation</option>
                </select>
              </div>

              {/* Call Active Indicator */}
              {activeCalling && (
                <div style={{
                  background: 'rgba(37, 211, 102, 0.1)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--brand-whatsapp)', fontWeight: 700, marginBottom: '4px' }}>
                    <span className="pulse-indicator" style={{ width: '10px', height: '10px' }} />
                    <span style={{ textTransform: 'uppercase' }}>{callStatus}...</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Synthesizing real-time voice speech and Gemini conversation tree
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={activeCalling}
                className="btn btn-premium"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                <PhoneCall size={16} />
                {activeCalling ? 'Connecting Call...' : 'Dial AI Phone Agent'}
              </button>
            </form>
          )}

          {/* Past Calls Quick List */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Recent AI Calls Log</div>
            {calls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                style={{
                  background: selectedCall?.id === call.id ? 'rgba(245, 158, 11, 0.1)' : 'var(--card-bg)',
                  border: selectedCall?.id === call.id ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{call.recipientName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{call.phone} • {call.createdAt}</div>
                </div>
                {getSentimentBadge(call.sentiment)}
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT: Live Call Studio & Audio Transcript Visualizer */}
        <div className="vibe-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {selectedCall ? (
            <>
              {/* Header of Selected Call */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>{selectedCall.recipientName}</h3>
                    {getSentimentBadge(selectedCall.sentiment)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} color="var(--brand-primary-light)" /> {selectedCall.phone}
                    </span>
                    <span>•</span>
                    <span>Goal: <strong style={{ color: 'var(--brand-primary-light)' }}>{selectedCall.goal.replace('_', ' ').toUpperCase()}</strong></span>
                    <span>•</span>
                    <span>Duration: {selectedCall.durationSeconds}s</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedCall.transcript.length > 0) {
                      speakText(selectedCall.transcript[0].text);
                    }
                  }}
                  className="btn btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  <Volume2 size={16} color="var(--brand-whatsapp)" />
                  Hear AI Voice Preview
                </button>
              </div>

              {/* Executive Summary */}
              <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-amber)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <Sparkles size={16} />
                  <span>Call Outcome Digest (Gemini AI Verified)</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {selectedCall.summary}
                </p>
              </div>

              {/* Transcript Multi-turn */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Complete Speech & Voice Dialogue Transcript
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedCall.transcript.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: line.speaker === 'agent' ? 'rgba(99, 102, 241, 0.06)' : 'var(--card-bg)',
                        border: line.speaker === 'agent' ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: line.speaker === 'agent' ? 'var(--brand-primary-light)' : 'var(--brand-whatsapp)',
                          textTransform: 'uppercase',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}>
                          {line.speaker === 'agent' ? (
                            <>
                              <Bot size={13} />
                              <span>Maya (BizzUp AI Agent)</span>
                            </>
                          ) : (
                            <>
                              <User size={13} />
                              <span>{selectedCall.recipientName}</span>
                            </>
                          )}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{line.time}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              Select a call record or dial an AI outbound phone agent to preview live transcripts.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
