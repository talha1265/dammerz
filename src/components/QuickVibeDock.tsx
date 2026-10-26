'use client';

import React from 'react';
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Video, 
  PhoneCall, 
  Search, 
  Zap,
  BookOpen
} from 'lucide-react';

interface QuickVibeDockProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenCommandPalette: () => void;
  onOpenGuide: () => void;
}

export default function QuickVibeDock({
  activeTab,
  onSelectTab,
  onOpenCommandPalette,
  onOpenGuide,
}: QuickVibeDockProps) {
  const dockItems = [
    { id: 'overview', label: 'Fleet', icon: Bot },
    { id: 'ops_chat', label: 'Team Chat', icon: Users, badge: 'AI' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'meta_ads', label: 'Meta Ads', icon: Video },
    { id: 'calling', label: 'Voice AI', icon: PhoneCall },
  ];

  return (
    <aside aria-label="Quick Navigation Dock" className="vibe-dock">
      {dockItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`vibe-dock-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
            <span style={{ display: 'none', minWidth: '0' }}>{item.label}</span>
            <span className="dock-label-desktop" style={{ fontSize: '0.8rem' }}>{item.label}</span>
            {item.badge && (
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '999px',
                background: 'rgba(37, 211, 102, 0.25)',
                color: '#25d366',
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.14)', margin: '0 2px' }} />

      <button
        onClick={onOpenCommandPalette}
        className="vibe-dock-item"
        style={{
          background: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--brand-primary-light)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
        title="Open Command Palette (Ctrl+K)"
      >
        <Search size={14} />
        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>⌘K</span>
      </button>

      <button
        onClick={onOpenGuide}
        className="vibe-dock-item"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-muted)',
        }}
        title="Operations Playbook"
      >
        <BookOpen size={14} />
      </button>
    </aside>
  );
}
