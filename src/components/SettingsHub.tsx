'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  FileText, 
  Database,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Business } from '@/lib/types';
import ProfileAndSettings from './ProfileAndSettings';
import SubscriptionManager from './SubscriptionManager';
import TenderReports from './TenderReports';
import DatabaseSettings from './DatabaseSettings';

interface SettingsHubProps {
  business: Business;
  onRefreshData: () => void;
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  currentTheme?: 'dark' | 'light';
  initialSubTab?: 'profile' | 'billing' | 'reports' | 'database';
}

export default function SettingsHub({
  business,
  onRefreshData,
  onToggleTheme,
  currentTheme = 'dark',
  initialSubTab = 'profile',
}: SettingsHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'billing' | 'reports' | 'database'>(initialSubTab);

  const subTabs = [
    {
      id: 'profile' as const,
      label: 'Business Profile',
      icon: Building2,
      badge: 'GST & WHATSAPP',
      description: 'Company info, catalog size & official WhatsApp number',
    },
    {
      id: 'billing' as const,
      label: 'Plans & Subscriptions',
      icon: CreditCard,
      badge: business.subscriptionTier.toUpperCase(),
      description: 'Starter, Growth & Premium tiers with Razorpay billing',
    },
    {
      id: 'reports' as const,
      label: 'Tender Reports',
      icon: FileText,
      badge: 'EXPORT',
      description: 'Government Gem & commercial tender proposal audits',
    },
    {
      id: 'database' as const,
      label: 'Database & Cloud',
      icon: Database,
      badge: 'NEON DB',
      description: 'Postgres connection status & Gemini model settings',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pillar 4 Header */}
      <div className="vibe-card" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(20, 27, 44, 0.9) 0%, rgba(13, 17, 28, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-premium" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                PILLAR 4: SYSTEM SETTINGS & PLANS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Configure company identity, plan quotas & cloud database
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Settings & Subscription
            </h2>
          </div>
        </div>

        {/* Clean Sub-Navigation Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
        }}>
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid var(--brand-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#ffffff',
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? '#ffffff' : 'var(--text-main)' }}>
                      {tab.label}
                    </span>
                    <span style={{
                      fontSize: '0.62rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? '#818cf8' : 'var(--text-dim)',
                      fontWeight: 700,
                    }}>
                      {tab.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-Module */}
      <div style={{ width: '100%' }}>
        {activeSubTab === 'profile' && (
          <ProfileAndSettings
            business={business}
            onRefresh={onRefreshData}
            onNavigateBilling={() => setActiveSubTab('billing')}
            onToggleTheme={onToggleTheme}
            currentTheme={currentTheme}
          />
        )}

        {activeSubTab === 'billing' && (
          <SubscriptionManager business={business} onRefresh={onRefreshData} />
        )}

        {activeSubTab === 'reports' && (
          <TenderReports onRefresh={onRefreshData} />
        )}

        {activeSubTab === 'database' && (
          <DatabaseSettings business={business} />
        )}
      </div>
    </div>
  );
}
