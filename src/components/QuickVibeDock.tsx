'use client';

import React from 'react';
import { 
  Activity,
  Bot, 
  Zap, 
  HardHat, 
  Sparkles, 
  Search, 
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
    { id: 'overview', label: 'Fleet', icon: Activity },
    { id: 'ai_workforce', label: 'AI Staff', icon: Bot, badge: '4' },
    { id: 'sales', label: 'Sales', icon: Zap },
    { id: 'operations', label: 'Operations', icon: HardHat },
    { id: 'settings', label: 'Settings', icon: Sparkles },
  ];

  const isItemActive = (itemId: string) => {
    if (activeTab === itemId) return true;
    if (itemId === 'ai_workforce' && ['ai_agents', 'pipeline', 'calling', 'connectors', 'ritik', 'meta_ads'].includes(activeTab)) return true;
    if (itemId === 'operations' && ['employees', 'bills', 'ops_chat', 'whatsapp'].includes(activeTab)) return true;
    if (itemId === 'settings' && ['billing', 'profile', 'reports'].includes(activeTab)) return true;
    return false;
  };

  return (
    <aside aria-label="Quick Navigation Dock" className="vibe-dock">
      {dockItems.map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(item.id);
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
