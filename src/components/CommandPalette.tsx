'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  Zap, 
  Building2, 
  HardHat, 
  FileSpreadsheet, 
  Globe, 
  Users, 
  Sparkles, 
  Database, 
  Video, 
  BookOpen, 
  ArrowRight,
  Command,
  User,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onTriggerAction?: (actionId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Modules' | 'Actions' | 'Portals';
  icon: any;
  tabId?: string;
  badge?: string;
  shortcut?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerAction,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = [
    {
      id: 'tab-overview',
      title: 'Dashboard Fleet',
      subtitle: 'Overview metrics, autonomous operational status, and real-time logs',
      category: 'Modules',
      icon: Bot,
      tabId: 'overview',
      shortcut: '1',
    },
    {
      id: 'tab-ops-chat',
      title: 'Team Ops Chat & Intelligence Hub',
      subtitle: 'Real-time staff chat, attendance extraction, site logs & live ledger',
      category: 'Modules',
      icon: Users,
      tabId: 'ops_chat',
      badge: 'LIVE',
      shortcut: '2',
    },
    {
      id: 'tab-whatsapp',
      title: 'WhatsApp Simulator (Hinglish & English)',
      subtitle: 'Interactive test sandbox for site engineers, buyers, and vendors',
      category: 'Modules',
      icon: MessageSquare,
      tabId: 'whatsapp',
      shortcut: '3',
    },
    {
      id: 'tab-pipeline',
      title: '⚡ Autonomous Pipeline (Neha ➔ Pooja ➔ Ritik)',
      subtitle: 'Market research to voice call to WhatsApp proforma quotation closing',
      category: 'Modules',
      icon: Zap,
      tabId: 'pipeline',
      badge: 'SCENARIO',
      shortcut: '4',
    },
    {
      id: 'tab-ai-agents',
      title: 'AI Employee Agents Department',
      subtitle: 'Overview of all 4 AI Employees (Neha, Pooja, Ritik, Kabir) on active duty',
      category: 'Modules',
      icon: Bot,
      tabId: 'ai_agents',
      badge: '4 AGENTS',
    },
    {
      id: 'tab-connectors',
      title: 'Neha Verma (AI Market Researcher & Intelligence)',
      subtitle: 'IndiaMart BuyLead, Google Merchant feeds, GeM government tenders [EMP-AI-RES03]',
      category: 'Modules',
      icon: Globe,
      tabId: 'connectors',
      badge: 'AI RESEARCH',
    },
    {
      id: 'tab-calling',
      title: 'Pooja Sharma (AI Tele-Calling & SDR Executive)',
      subtitle: 'Autonomous outbound & inbound calls, bilingual voice synthesis [EMP-AI-CALL01]',
      category: 'Modules',
      icon: PhoneCall,
      tabId: 'calling',
      badge: 'AI CALLER',
    },
    {
      id: 'tab-ritik',
      title: 'Ritik Sharma (AI WhatsApp Messaging & Deal Closing)',
      subtitle: 'Instant WhatsApp quotations, technical PDF dispatch, proforma invoices [EMP-AI-WA04]',
      category: 'Modules',
      icon: MessageSquare,
      tabId: 'ritik',
      badge: 'AI CLOSER',
    },
    {
      id: 'tab-meta-ads',
      title: 'Kabir Mehta (AI Performance Ads & Creative Manager)',
      subtitle: 'Autonomous video hook generator, ad creatives, and Click-to-WhatsApp ads [EMP-AI-ADS02]',
      category: 'Modules',
      icon: Video,
      tabId: 'meta_ads',
      badge: 'AI ADS',
    },
    {
      id: 'tab-employees',
      title: 'Human Staff IDs & Site Roster',
      subtitle: 'Auto-generate employee IDs, credentials, and WhatsApp invitations',
      category: 'Modules',
      icon: HardHat,
      tabId: 'employees',
      shortcut: '5',
    },
    {
      id: 'tab-bills',
      title: 'Bills, GST & Excel Hub',
      subtitle: 'Log vendor invoices, track pending kharcha, export accounting ledgers',
      category: 'Modules',
      icon: FileSpreadsheet,
      tabId: 'bills',
      shortcut: '6',
    },
    {
      id: 'tab-sales',
      title: 'IndiaMart & Google Leads Pipeline',
      subtitle: 'Lead scoring, automated WhatsApp replies, and buyer deals',
      category: 'Modules',
      icon: Zap,
      tabId: 'sales',
      shortcut: '7',
    },
    {
      id: 'tab-reports',
      title: 'Tender & Manager Reports',
      subtitle: 'NTPC/NHAI tender submissions, risk checks & executive briefings',
      category: 'Modules',
      icon: Building2,
      tabId: 'reports',
    },
    {
      id: 'tab-billing',
      title: 'Subscription & Plans',
      subtitle: 'Starter, Growth, and Premium autonomous business tiers',
      category: 'Modules',
      icon: Sparkles,
      tabId: 'billing',
    },
    {
      id: 'tab-profile',
      title: 'Company Profile & Settings',
      subtitle: 'Edit company profile, tax details, theme preference, and cloud status',
      category: 'Modules',
      icon: User,
      tabId: 'profile',
    },
    {
      id: 'act-guide',
      title: 'Open Operations Playbook Guide',
      subtitle: 'Complete step-by-step master guide for staff, clients, and tenders',
      category: 'Actions',
      icon: BookOpen,
      shortcut: 'G',
    },
  ];

  const filteredItems = commandItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          executeItem(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const executeItem = (item: CommandItem) => {
    if (item.tabId) {
      onSelectTab(item.tabId);
    } else if (item.id === 'act-guide' && onTriggerAction) {
      onTriggerAction('guide');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="cmd-palette-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cmd-palette-box">
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <Search size={18} color="var(--brand-primary-light)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a module name or action (e.g. 'whatsapp', 'meta ads', 'bills', 'guide')..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <span className="vibe-kbd">ESC</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '6px' }}>No matching modules or actions found</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Try searching for &quot;chat&quot;, &quot;calling&quot;, &quot;leads&quot;, or &quot;bills&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`cmd-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={16} color={isSelected ? '#ffffff' : 'var(--brand-primary-light)'} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: item.badge === 'LIVE' ? 'rgba(37, 211, 102, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                            color: item.badge === 'LIVE' ? '#25d366' : '#a5b4fc',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '420px',
                      }}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {item.shortcut && <span className="vibe-kbd">{item.shortcut}</span>}
                    <ArrowRight size={14} color={isSelected ? '#ffffff' : 'var(--text-dim)'} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div style={{
          padding: '10px 18px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          color: 'var(--text-dim)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Navigate <strong style={{ color: 'var(--text-muted)' }}>↑ ↓</strong></span>
            <span>Select <strong style={{ color: 'var(--text-muted)' }}>↵ Enter</strong></span>
            <span>Close <strong style={{ color: 'var(--text-muted)' }}>Esc</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-whatsapp)' }}>
            <span className="pulse-indicator" style={{ width: '5px', height: '5px' }} />
            <span>Autonomous Engine Vibe</span>
          </div>
        </div>

      </div>
    </div>
  );
}
