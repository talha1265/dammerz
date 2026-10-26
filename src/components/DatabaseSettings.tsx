'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { Business } from '@/lib/types';

interface DatabaseSettingsProps {
  business: Business;
}

export default function DatabaseSettings({ business }: DatabaseSettingsProps) {
  const [neonUri, setNeonUri] = useState('postgresql://neondb_owner:npg_x72@ep-bizzup-operations.us-east-2.aws.neon.tech/neondb?sslmode=require');
  const [testingNeon, setTestingNeon] = useState(false);
  const [neonStatus, setNeonStatus] = useState<string | null>(null);
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/whatsapp` : 'https://bizzup.ai/api/whatsapp';

  const handleTestNeon = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingNeon(true);
    setNeonStatus(null);

    try {
      const res = await fetch('/api/db/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString: neonUri }),
      });
      const data = await res.json();
      if (data.success) {
        setNeonStatus('success');
      } else {
        setNeonStatus(`error: ${data.error}`);
      }
    } catch (err: any) {
      setNeonStatus(`error: ${err.message}`);
    } finally {
      setTestingNeon(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Neon PostgreSQL Connection Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00e699, #00b377)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Database size={22} color="#000" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Neon PostgreSQL Cloud Integration</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Serverless PostgreSQL architecture with instant branching, connection caching & zero cold-starts
              </p>
            </div>
          </div>

          <span className="badge badge-whatsapp">Serverless Ready</span>
        </div>

        <form onSubmit={handleTestNeon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Neon PostgreSQL Connection URI String
            </label>
            <input
              type="text"
              value={neonUri}
              onChange={(e) => setNeonUri(e.target.value)}
              placeholder="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"
              className="input-field"
              style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Note: System automatically falls back to reactive high-speed in-memory state if Neon URL is undergoing maintenance.
            </p>

            <button
              type="submit"
              disabled={testingNeon}
              className="btn btn-primary"
              style={{ padding: '9px 18px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} className={testingNeon ? 'pulse-indicator' : ''} />
              {testingNeon ? 'Verifying & Migrating...' : 'Verify Connection & Migrate Schema'}
            </button>
          </div>
        </form>

        {neonStatus && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: neonStatus === 'success' ? 'rgba(37, 211, 102, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: neonStatus === 'success' ? '1px solid rgba(37, 211, 102, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
            color: neonStatus === 'success' ? 'var(--brand-whatsapp)' : '#fb7185',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {neonStatus === 'success' ? (
              <>
                <CheckCircle2 size={16} />
                <span>Neon PostgreSQL connected! Tables: businesses, employees, sales_leads, manager_reports, ai_calls synced.</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                <span>{neonStatus}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Google Gemini AI Model Engine Config */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Google Gemini AI Model Engine</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Powers WhatsApp intent detection, tender risk assessment, sales scoring & autonomous voice caller
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {[
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Recommended)', desc: 'Ultra-low latency sub-second WhatsApp response and speech turns.' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Complex tender documentation and high-precision legal risk analysis.' },
            { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', desc: 'Next-generation multimodal reasoning for blueprint & invoice parsing.' },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setGeminiModel(m.id)}
              style={{
                background: geminiModel === m.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: geminiModel === m.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', marginBottom: '4px' }}>
                {m.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {m.desc}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px' }}>
          💡 Active API Key: <code>GEMINI_API_KEY</code> loaded via system environment. Model fallback heuristic engine active if key is not configured.
        </div>
      </div>

      {/* WhatsApp Webhook Endpoint for Meta Business Cloud */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
          WhatsApp Cloud API Webhook Integration
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Connect your official Meta WhatsApp Business Cloud Phone Number to this live webhook URL:
        </p>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            readOnly
            value={webhookUrl}
            className="input-field"
            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
          />
          <button
            onClick={() => copyToClipboard(webhookUrl)}
            className="btn btn-outline"
            style={{ padding: '10px 16px', fontSize: '0.85rem' }}
          >
            {copiedWebhook ? <CheckCircle2 size={16} color="var(--brand-whatsapp)" /> : <Copy size={16} />}
            {copiedWebhook ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

    </div>
  );
}
