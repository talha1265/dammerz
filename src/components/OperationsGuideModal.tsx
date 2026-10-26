'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  MessageSquare, 
  PhoneCall, 
  Users, 
  Package, 
  FileSpreadsheet, 
  Globe, 
  Building2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  HardHat,
  Search,
  Sparkles,
  Bot
} from 'lucide-react';

interface OperationsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OperationsGuideModal({ isOpen, onClose }: OperationsGuideModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const operationalModules = [
    {
      id: 'ops_chat',
      title: '1. Multi-Party Team Chat & Natural Language Storage',
      category: 'chat',
      icon: Users,
      badge: 'Core Feature',
      badgeColor: '#6366f1',
      summary: 'Staff, managers, and clients can chat naturally on the web app. The AI engine automatically extracts and permanently stores attendance, inventory updates, and bills in the database.',
      operations: [
        {
          name: 'Log Staff Attendance via Chat',
          howTo: 'Type e.g. "Vikram Sharma checked in at Sector 62 Site" or "Rahul marked present at Factory 2".',
          outcome: 'Auto-creates AttendanceRecord, marks staff ON SITE, logs GPS/site location and check-in timestamp.',
        },
        {
          name: 'Add / Adjust Warehouse Inventory',
          howTo: 'Type e.g. "Add inventory: 40 Centrifugal Pumps @ 28000 at Bhiwandi Central Logistics Hub".',
          outcome: 'Calculates valuation (₹11.20L), creates/updates inventory SKU, recalculates total warehouse valuation.',
        },
        {
          name: 'Log / Generate Commercial Bill',
          howTo: 'Type e.g. "Add bill for Kaveri Steel ₹2,50,000 due 2026-10-30".',
          outcome: 'Computes 18% GST (₹45,000), total (₹2,95,000), creates Invoice #, and books it into the accounts ledger.',
        },
        {
          name: 'Live Factual Queries',
          howTo: 'Ask: "Attendance of Vikram", "Where is Sunil Verma?", "Total inventory value", "Bill for Bharat Infrastructure".',
          outcome: 'Assistant queries database in real-time and responds with exact facts, amounts, and statuses.',
        },
      ],
    },
    {
      id: 'whatsapp',
      title: '2. WhatsApp 24/7 Bilingual Autopilot & Client Access',
      category: 'whatsapp',
      icon: MessageSquare,
      badge: 'Bilingual AI',
      badgeColor: '#25d366',
      summary: 'Clients and managers do not need to log into the web dashboard to get updates. They can query anything via WhatsApp in English or Hinglish.',
      operations: [
        {
          name: 'Client Attendance Query via WhatsApp',
          howTo: 'Send to WhatsApp: "Attendance of Vikram Sharma" or "Vikram ki attendance kya hai?".',
          outcome: 'Bot replies with Staff ID, ON SITE status, Sector 62 Metro site location, punch-in time (08:45 AM), and latest field note.',
        },
        {
          name: 'Live Staff Location Query',
          howTo: 'Send to WhatsApp: "Where is Sunil Verma right now?" or "Staff locations".',
          outcome: 'Returns current site, break/work status, and dispatch note.',
        },
        {
          name: 'Instant Inventory Valuation Query',
          howTo: 'Send to WhatsApp: "What is our total inventory value?" or "Godown valuation kitni hai?".',
          outcome: 'Replies with ₹48.60 Lakhs total valuation and itemized breakdown across Gurugram, Bhiwandi, Pune, & Ludhiana hubs.',
        },
        {
          name: 'Particular Bill Lookup by Name or Date',
          howTo: 'Send to WhatsApp: "Show bill for Bharat Infrastructure Corp" or "Bills due on 2026-10-25".',
          outcome: 'Returns Invoice #INV-2026-892, Base + GST total (₹5,72,300), payment status (PENDING), and line items.',
        },
      ],
    },
    {
      id: 'charts',
      title: '3. "Short the Chart" / Sortable Analytics & Visualizations',
      category: 'analytics',
      icon: FileSpreadsheet,
      badge: 'Interactive Data',
      badgeColor: '#f59e0b',
      summary: 'Interactive operations dashboard that allows managers to visualize and sort all live business metrics.',
      operations: [
        {
          name: 'Sort & Filter Attendance Roster',
          howTo: 'Use the sort dropdown: sort by Punch Time (Recent first), Staff Name (A-Z), or Status (On-site first).',
          outcome: 'Instantly re-orders the roster and highlights present vs. on-break vs. offline staff.',
        },
        {
          name: 'Sort Warehouse Inventory Values',
          howTo: 'Sort by Valuation (Highest to Lowest), Stock Units, or SKU Name. Search by warehouse location.',
          outcome: 'Shows visual progress bars reflecting each SKU\'s share of total ₹48.6 Lakhs warehouse inventory.',
        },
        {
          name: 'Sort & Track Accounts Ledger Bills',
          howTo: 'Sort bills by Amount (Highest first), Due Date (Earliest first), or Party Name. Filter by Paid/Pending.',
          outcome: 'Displays cashflow timeline, GST component, and pending receivables total.',
        },
        {
          name: '1-Click CSV / Excel Exports',
          howTo: 'Click "Export CSV" on Attendance, Inventory, or Bills.',
          outcome: 'Downloads complete spreadsheet for auditors, payroll, or tax filing.',
        },
      ],
    },
    {
      id: 'voice_calling',
      title: '4. Autonomous AI Voice Calling Studio (Premium)',
      category: 'voice',
      icon: PhoneCall,
      badge: 'Premium Tier',
      badgeColor: '#ec4899',
      summary: 'Autonomous phone agents that dial clients, vendors, and IndiaMart leads to qualify orders, negotiate pricing, and collect payment confirmations.',
      operations: [
        {
          name: 'Deploy Outbound Voice Call to Hot Lead',
          howTo: 'Select lead from pipeline or enter phone number, choose objective (Lead Qualification, Payment Reminder, Order Confirmation), and click "Dial Autonomous Call".',
          outcome: 'AI agent calls client, converses naturally, negotiates PN16 specifications, and records live transcript & sentiment.',
        },
        {
          name: 'Audio Simulation & Transcript Analysis',
          howTo: 'Review sentiment badges (Positive, Urgent, Neutral) and duration in the Calling Studio.',
          outcome: 'Client audio transcript automatically attaches to the sales lead record.',
        },
      ],
    },
    {
      id: 'connectors',
      title: '5. Marketing Connectors & Market Intelligence',
      category: 'leads',
      icon: Globe,
      badge: 'Webhooks & Feeds',
      badgeColor: '#3b82f6',
      summary: 'Integrate external procurement channels: IndiaMart BuyLead webhooks, Google Shopping merchant feeds, and GeM government tender scraper.',
      operations: [
        {
          name: 'IndiaMart BuyLead Live Ingestion',
          howTo: 'Configure GLUS API key or Webhook URL in Marketing Connectors tab.',
          outcome: 'Inquiries from IndiaMart auto-populate the Sales Pipeline with AI hotness scores (0-100).',
        },
        {
          name: 'Google Shopping Feed Sync',
          howTo: 'Connect GMC XML feed URL.',
          outcome: 'Product inquiries and retail clicks sync directly into commercial pipeline.',
        },
        {
          name: 'Gemini Market & Competitor Research',
          howTo: 'Review weekly AI Market Intelligence reports (e.g. Mild steel forging price trends, NTPC competitor bidding margins).',
          outcome: 'Provides executive procurement recommendations and gross margin hedges.',
        },
      ],
    },
    {
      id: 'staff_engine',
      title: '6. Staff IDs, Auto Passwords & Site Engine',
      category: 'staff',
      icon: HardHat,
      badge: 'Role Engine',
      badgeColor: '#10b981',
      summary: 'Enroll site staff, project supervisors, and tender documentation managers with automated credentials and WhatsApp invite links.',
      operations: [
        {
          name: 'Generate Staff ID & Auto Password',
          howTo: 'Click "+ Enroll New Staff", provide name, phone, site name, and role category.',
          outcome: 'System generates unique ID (e.g. EMP-NOIDA-401) and password (e.g. pass_7721).',
        },
        {
          name: '1-Click WhatsApp Invitation',
          howTo: 'Click "Share Credentials on WhatsApp".',
          outcome: 'Opens WhatsApp chat with pre-filled login credentials and staff portal URL (`/staff`).',
        },
        {
          name: 'Dedicated Mobile Staff Portal',
          howTo: 'Staff visits `/staff` and logs in with their auto-credentials.',
          outcome: 'Bilingual mobile chat interface for daily duty check-in, labor counts, and site inspection logs.',
        },
      ],
    },
    {
      id: 'reports',
      title: '7. Tender Bid Management & Executive Reports',
      category: 'tenders',
      icon: Building2,
      badge: 'Executive Digest',
      badgeColor: '#8b5cf6',
      summary: 'Digest heavy technical bids for NTPC, NHAI, and IOCL projects with automated risk flag matrices.',
      operations: [
        {
          name: 'Submit Daily Tender Progress Log',
          howTo: 'Tender manager submits updates via WhatsApp or Portal.',
          outcome: 'AI extracts tender code, budget margin status, penalty clauses, and recommends action items.',
        },
        {
          name: 'Risk & Penalty Clause Flagging',
          howTo: 'Inspect the Tender Digest card.',
          outcome: 'Highlights delay penalties (e.g. 0.5%/week) and steel price fluctuation risks.',
        },
      ],
    },
    {
      id: 'admin',
      title: '8. Super Admin Multi-Tenant Portal',
      category: 'admin',
      icon: ShieldCheck,
      badge: 'PIN Protected',
      badgeColor: '#ef4444',
      summary: 'Central administrative desk to oversee all onboarded enterprise clients, active AI agents, and monthly subscription revenues.',
      operations: [
        {
          name: 'PIN Verification',
          howTo: 'Navigate to `/admin` and enter master PIN (default: `9922`).',
          outcome: 'Unlocks full fleet oversight, active client metrics, and Neon DB connectivity status.',
        },
        {
          name: 'Override Subscription Tiers & Status',
          howTo: 'One-click upgrade clients between Starter, Growth, and Premium tiers or toggle active/suspended status.',
          outcome: 'Instant quota adjustment across monthly WhatsApp messages and voice calling minutes.',
        },
      ],
    },
  ];

  const filteredModules = operationalModules.filter((m) => {
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.operations.some(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.howTo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px',
    }}>
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1), rgba(99, 102, 241, 0.1))',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #25d366, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(37, 211, 102, 0.4)',
            }}>
              <BookOpen size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800 }}>
                BizzUp Platform Operations Guide & Playbook
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Comprehensive manual of all 8 operational domains, user actions, WhatsApp queries, and workflows
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ padding: '6px 12px', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div style={{
          padding: '14px 28px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {[
              { id: 'all', label: 'All Operations (8)' },
              { id: 'chat', label: 'Team Ops Chat' },
              { id: 'whatsapp', label: 'WhatsApp Client Access' },
              { id: 'analytics', label: 'Sortable Charts' },
              { id: 'voice', label: 'AI Voice Calling' },
              { id: 'leads', label: 'Marketing Connectors' },
              { id: 'staff', label: 'Staff IDs & Site' },
              { id: 'tenders', label: 'Tenders & Reports' },
              { id: 'admin', label: 'Super Admin' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  border: 'none',
                  background: activeCategory === tab.id ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeCategory === tab.id ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            minWidth: '220px',
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operation by name..."
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', width: '100%', outline: 'none' }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Module Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={20} color={module.badgeColor} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>
                        {module.title}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {module.summary}
                      </p>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: `${module.badgeColor}22`,
                    color: module.badgeColor,
                    fontWeight: 700,
                    border: `1px solid ${module.badgeColor}44`,
                  }}>
                    {module.badge}
                  </span>
                </div>

                {/* Operations Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {module.operations.map((op, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} color="#25d366" />
                        <span>{op.name}</span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#93c5fd', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 10px', borderRadius: '4px', borderLeft: '3px solid #3b82f6' }}>
                        <strong>How to execute:</strong> {op.howTo}
                      </div>

                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        <strong>Outcome:</strong> {op.outcome}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <span>💡 Need live assistance? You can query the assistant in Hinglish or English anytime.</span>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
            Got It, Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
