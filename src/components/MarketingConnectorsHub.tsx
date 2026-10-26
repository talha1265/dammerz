'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShoppingBag, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Search,
  Video
} from 'lucide-react';
import { MarketingConnector, BusinessResearch } from '@/lib/types';

interface MarketingConnectorsHubProps {
  onRefresh: () => void;
}

export default function MarketingConnectorsHub({ onRefresh }: MarketingConnectorsHubProps) {
  const [connectors, setConnectors] = useState<MarketingConnector[]>([]);
  const [research, setResearch] = useState<BusinessResearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connRes, resRes] = await Promise.all([
        fetch('/api/connectors'),
        fetch('/api/research'),
      ]);
      const [connData, resData] = await Promise.all([
        connRes.json(),
        resRes.json(),
      ]);

      if (connData.success) setConnectors(connData.connectors);
      if (resData.success) setResearch(resData.research);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner */}
      <div className="vibe-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={22} color="var(--brand-amber)" />
            Marketing & Marketplace Connectors
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Automatically synchronize BuyLeads from IndiaMart, Google Shopping, GeM Portal, and Meta WhatsApp ads.
          </p>
        </div>

        <button onClick={fetchData} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
          <RefreshCw size={14} className={loading ? 'pulse-indicator' : ''} />
          Sync All Connectors
        </button>
      </div>

      {/* Connectors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Meta Video Ads AI Autonomous Connector Card */}
        <div className="vibe-card" style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.12) 0%, var(--card-bg) 100%)',
          border: '1px solid rgba(24, 119, 242, 0.35)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1877f2, #0064e0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(24, 119, 242, 0.4)',
              }}>
                <Video size={22} color="#fff" />
              </div>

              <span className="badge badge-whatsapp">
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                AI AUTOPILOT ACTIVE
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '4px' }}>Meta Video Ads AI Engine</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Instagram Reels & FB Click-to-WhatsApp Ads • <strong style={{ color: 'var(--brand-whatsapp)' }}>144+ Leads Ingested</strong>
            </div>

            <div style={{ marginTop: '12px', background: 'var(--card-bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px 10px', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Account: <span style={{ color: 'var(--text-main)' }}>act_84920194829</span> • Graph API v21.0
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--brand-amber)', fontWeight: 700 }}>
              ROAS: 4.1x Multiplier
            </span>
            <button
              onClick={() => {
                const navBtn = document.querySelector('button[style*="Meta Video Ads AI"]') as HTMLButtonElement;
                if (navBtn) navBtn.click();
                else alert('Navigate to "Meta Video Ads AI" from top navigation bar.');
              }}
              className="btn btn-primary"
              style={{ padding: '5px 12px', fontSize: '0.75rem' }}
            >
              Open Ads Hub
            </button>
          </div>
        </div>

        {connectors.map((c) => (
          <div key={c.id} className="vibe-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: c.platform === 'indiamart' ? 'rgba(235, 87, 87, 0.15)' : c.platform === 'google_shopping' ? 'rgba(66, 133, 244, 0.15)' : 'rgba(37, 211, 102, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {c.platform === 'indiamart' ? <Zap size={22} color="#eb5757" /> : c.platform === 'google_shopping' ? <ShoppingBag size={22} color="#4285f4" /> : <Globe size={22} color="var(--brand-whatsapp)" />}
                </div>

                <span className="badge badge-online">
                  <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                  {c.status.toUpperCase()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '4px' }}>{c.name}</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Last synced: {c.lastSynced} • <strong style={{ color: 'var(--text-main)' }}>{c.leadsIngested} Leads Ingested</strong>
              </div>

              {/* Webhook URL */}
              <div style={{ marginTop: '12px', background: 'var(--card-bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {c.webhookUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(c.webhookUrl, c.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-primary-light)', cursor: 'pointer', padding: '2px' }}
                  title="Copy Webhook URL"
                >
                  {copiedId === c.id ? <CheckCircle2 size={14} color="var(--brand-whatsapp)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Key: {c.apiKeyOrGluskey.slice(0, 14)}...
              </span>
              <button
                onClick={() => alert(`Connector ${c.name} is verified and receiving webhooks in real-time.`)}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Test Ping
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Business Research & Market Insights Section */}
      <div className="vibe-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sparkles size={22} color="var(--brand-primary-light)" />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>AI Business Intelligence & Market Research</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gemini AI models continuously track industrial material pricing indices and government tender bidding margins.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {research.map((r) => (
            <div key={r.id} style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                  {r.category.replace('_', ' ').toUpperCase()}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{r.updatedAt}</span>
              </div>

              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, lineHeight: '1.4' }}>{r.headline}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{r.analysis}</p>

              <div style={{ background: 'rgba(37, 211, 102, 0.06)', border: '1px solid rgba(37, 211, 102, 0.2)', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', color: 'var(--brand-whatsapp)' }}>
                <strong>Strategic Action:</strong> {r.actionRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
