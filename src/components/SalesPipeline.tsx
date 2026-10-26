'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  PhoneCall, 
  DollarSign, 
  MessageSquare, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Plus
} from 'lucide-react';
import { SalesLead } from '@/lib/types';

interface SalesPipelineProps {
  onRefresh: () => void;
  onTriggerCall?: (lead: SalesLead) => void;
}

export default function SalesPipeline({ onRefresh, onTriggerCall }: SalesPipelineProps) {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingIndiaMart, setSyncingIndiaMart] = useState(false);
  const [syncingGoogleShop, setSyncingGoogleShop] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSyncIndiaMart = async () => {
    setSyncingIndiaMart(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_indiamart' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingIndiaMart(false);
    }
  };

  const handleSyncGoogleShop = async () => {
    setSyncingGoogleShop(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_google_shop' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingGoogleShop(false);
    }
  };

  const totalPipelineValue = leads.reduce((acc, lead) => acc + (lead.estimatedValue || 0), 0);

  const filtered = leads.filter((lead) => {
    if (selectedFilter === 'all') return true;
    return lead.source === selectedFilter;
  });

  const getSourceBadge = (source: SalesLead['source']) => {
    switch (source) {
      case 'indiamart':
        return (
          <span className="badge" style={{ background: 'rgba(235, 87, 87, 0.12)', color: '#ef4444', borderColor: 'rgba(235, 87, 87, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ShoppingBag size={11} /> IndiaMart
          </span>
        );
      case 'google_shop':
        return (
          <span className="badge badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={11} /> Google Shop
          </span>
        );
      case 'whatsapp':
        return (
          <span className="badge badge-whatsapp" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MessageSquare size={11} /> WhatsApp Direct
          </span>
        );
      default:
        return (
          <span className="badge badge-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ExternalLink size={11} /> Website
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Active Pipeline</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
            ₹{totalPipelineValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Across {leads.length} multi-channel leads
          </div>
        </div>

        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>IndiaMart BuyLeads</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ef4444' }}>
            {leads.filter((l) => l.source === 'indiamart').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Auto-ingested with AI quotation draft
          </div>
        </div>

        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Google Merchant Clicks</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>
            {leads.filter((l) => l.source === 'google_shop').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Catalog auto-synced
          </div>
        </div>

        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Lead Scoring Accuracy</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
            94.8%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Evaluated by Gemini Flash Model
          </div>
        </div>
      </div>

      {/* Sync Action Controls */}
      <div className="vibe-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Leads' },
            { id: 'indiamart', label: 'IndiaMart Inquiries' },
            { id: 'google_shop', label: 'Google Shopping' },
            { id: 'whatsapp', label: 'WhatsApp Inbound' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedFilter(btn.id)}
              className={selectedFilter === btn.id ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSyncIndiaMart}
            disabled={syncingIndiaMart}
            className="btn btn-outline"
            style={{ borderColor: '#ef4444', color: '#ef4444', padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={syncingIndiaMart ? 'pulse-indicator' : ''} />
            {syncingIndiaMart ? 'Syncing...' : 'Sync IndiaMart Leads'}
          </button>

          <button
            onClick={handleSyncGoogleShop}
            disabled={syncingGoogleShop}
            className="btn btn-outline"
            style={{ borderColor: 'var(--brand-primary-light)', color: 'var(--brand-primary-light)', padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <ShoppingBag size={14} />
            {syncingGoogleShop ? 'Syncing...' : 'Sync Google Shopping'}
          </button>
        </div>
      </div>

      {/* Leads Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((lead) => (
          <div key={lead.id} className="vibe-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Left Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '650px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Zap size={20} color="var(--brand-amber)" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>{lead.clientName}</h4>
                  {getSourceBadge(lead.source)}
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                    AI Score: {lead.aiScore}%
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--brand-primary-light)', fontWeight: 600, marginBottom: '4px' }}>
                  {lead.productName} ({lead.quantity})
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {lead.notes}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  Contact: {lead.phone} • {lead.createdAt}
                </div>
              </div>
            </div>

            {/* Right Financial & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Estimated Deal Value</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-whatsapp)' }}>
                  ₹{lead.estimatedValue.toLocaleString('en-IN')}
                </div>
                <span className="badge badge-online" style={{ marginTop: '4px', textTransform: 'capitalize' }}>
                  Status: {lead.status}
                </span>
              </div>

              {onTriggerCall && (
                <button
                  onClick={() => onTriggerCall(lead)}
                  className="btn btn-premium"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  <PhoneCall size={14} />
                  Trigger AI Voice Call
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
