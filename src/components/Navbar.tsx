'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  Zap, 
  Building2, 
  User, 
  LogOut,
  Sparkles,
  HardHat,
  FileSpreadsheet,
  Globe,
  Users,
  BookOpen,
  Video,
  Search,
  Sun,
  Moon,
  Home,
  CheckCircle2
} from 'lucide-react';
import { Business, SubscriptionTier } from '@/lib/types';

interface NavbarProps {
  business: Business;
  isLoggedIn: boolean;
  userPhone: string;
  onOpenLogin: () => void;
  onOpenOnboard: () => void;
  onOpenUpgrade?: () => void;
  onOpenGuide?: () => void;
  onOpenCommandPalette?: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

export default function Navbar({
  business,
  isLoggedIn,
  userPhone,
  onOpenLogin,
  onOpenOnboard,
  onOpenUpgrade,
  onOpenGuide,
  onOpenCommandPalette,
  onLogout,
  activeTab,
  setActiveTab,
  currentTheme = 'dark',
  onToggleTheme,
}: NavbarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getBadgeClass = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'premium':
        return 'badge-premium';
      case 'growth':
        return 'badge-ai';
      default:
        return 'badge-whatsapp';
    }
  };

  const allTabs = [
    { id: 'overview', label: 'Fleet Overview', icon: Bot, category: 'core' },
    { id: 'ai_agents', label: 'AI Employees Hub', icon: Bot, badge: '3 AGENTS', category: 'ai_agents' },
    { 
      id: 'calling', 
      label: 'Pooja (AI Calling)', 
      icon: PhoneCall, 
      badge: business.subscriptionTier === 'premium' ? '10h' : business.subscriptionTier === 'growth' ? '2h' : 'VOICE',
      category: 'ai_agents' 
    },
    { id: 'meta_ads', label: 'Kabir (AI Ads Manager)', icon: Video, badge: 'AUTONOMOUS', category: 'ai_agents' },
    { id: 'connectors', label: 'Neha (AI Researcher)', icon: Globe, category: 'ai_agents' },
    { id: 'ops_chat', label: 'Team Ops Chat', icon: Users, badge: 'LIVE', category: 'core' },
    { id: 'whatsapp', label: 'WhatsApp Simulator', icon: MessageSquare, category: 'core' },
    { id: 'employees', label: 'Human Staff Roster', icon: HardHat, category: 'core' },
    { id: 'sales', label: 'IndiaMart & Google Leads', icon: Zap, category: 'growth' },
    { id: 'bills', label: 'Bills & GST Hub', icon: FileSpreadsheet, category: 'finance' },
    { id: 'reports', label: 'Tender Reports', icon: Building2, category: 'finance' },
    { id: 'billing', label: 'Plans & Subscription', icon: Sparkles, category: 'system' },
    { id: 'profile', label: 'Profile & Settings', icon: User, category: 'system' },
  ];

  const visibleTabs = selectedCategory === 'all' 
    ? allTabs 
    : allTabs.filter(t => t.category === selectedCategory);

  return (
    <header className="top-nav" style={{ backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 90 }}>
      {/* Top Header Row */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Brand Logo & Home Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" title="Go to Landing Page" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-main)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(37, 211, 102, 0.35)',
            }}>
              <Bot size={22} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                  Dammerz<span style={{ color: 'var(--brand-whatsapp)' }}>.ai</span>
                </span>
                <span className="vibe-live-pill" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
                  <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                  Console
                </span>
              </div>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', margin: 0 }}>
                Operations Dashboard
              </p>
            </div>
          </Link>

          {/* Quick link to Home */}
          <Link
            href="/"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '6px 10px', gap: '5px' }}
            title="View Public Landing Page"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
        </div>

        {/* Global Command Palette Search Bar */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(128, 128, 128, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '7px 16px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              transition: 'all 0.2s ease',
            }}
          >
            <Search size={14} color="var(--brand-primary-light)" />
            <span>Search modules, staff & invoices...</span>
            <span className="vibe-kbd" style={{ marginLeft: '12px', fontSize: '0.68rem' }}>
              Ctrl+K
            </span>
          </button>
        )}

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Theme Toggle (Light / Dark) */}
          {onToggleTheme && (
            <button
              onClick={() => onToggleTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="btn btn-outline"
              title={currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '6px' }}
            >
              {currentTheme === 'dark' ? (
                <>
                  <Sun size={14} color="#f59e0b" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} color="#6366f1" />
                  <span>Dark</span>
                </>
              )}
            </button>
          )}

          {/* Operations Playbook */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="btn btn-outline"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                borderColor: 'rgba(99, 102, 241, 0.35)',
                color: 'var(--brand-primary-light)',
              }}
            >
              <BookOpen size={13} />
              Playbook
            </button>
          )}

          {/* Profile Quick Pill / User Auth Info */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setActiveTab('profile')}
                className="btn btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeTab === 'profile' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  borderColor: activeTab === 'profile' ? 'var(--brand-primary)' : 'var(--border-subtle)',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                }}
              >
                <User size={13} color="var(--brand-primary-light)" />
                <span>Profile</span>
              </button>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="btn btn-outline"
                style={{ padding: '6px 8px', color: 'var(--brand-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn btn-whatsapp"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              <User size={14} />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Modern Vibe Tab Bar with Filter Category Pills */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '6px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {/* Quick Category Filter Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            overflowX: 'auto',
            padding: '3px 4px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'ai_agents', label: '🤖 AI Employees' },
              { id: 'core', label: 'Operations' },
              { id: 'growth', label: 'Growth & Leads' },
              { id: 'finance', label: 'Accounts & Bills' },
              { id: 'system', label: 'Settings & Plans' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSelected ? 'var(--brand-primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-dim)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Navigation Pills */}
          <div style={{
            display: 'flex',
            gap: '5px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            padding: '2px 0',
            flex: 1,
            justifyContent: 'flex-start',
          }}>
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`vibe-nav-pill ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.81rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--brand-primary-light)' : 'inherit'} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span style={{
                      fontSize: '0.62rem',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: tab.badge === 'ACTIVE' || tab.badge === 'LIVE' ? 'rgba(37, 211, 102, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: tab.badge === 'ACTIVE' || tab.badge === 'LIVE' ? '#25d366' : '#f59e0b',
                      fontWeight: 700,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      lineHeight: 1.2,
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
}
