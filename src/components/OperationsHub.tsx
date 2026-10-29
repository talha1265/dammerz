'use client';

import React, { useState } from 'react';
import { 
  HardHat, 
  FileSpreadsheet, 
  Users, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Business } from '@/lib/types';
import EmployeeManager from './EmployeeManager';
import BillsAndExcelHub from './BillsAndExcelHub';
import TeamOpsChatHub from './TeamOpsChatHub';
import WhatsAppSimulator from './WhatsAppSimulator';

interface OperationsHubProps {
  business: Business;
  onRefreshData: () => void;
  onOpenUpgrade?: () => void;
  initialSubTab?: 'employees' | 'bills' | 'ops_chat' | 'whatsapp';
}

export default function OperationsHub({
  business,
  onRefreshData,
  onOpenUpgrade = () => {},
  initialSubTab = 'employees',
}: OperationsHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'bills' | 'ops_chat' | 'whatsapp'>(initialSubTab);

  const subTabs = [
    {
      id: 'employees' as const,
      label: 'Staff IDs & Attendance',
      icon: HardHat,
      badge: 'ROSTER',
      description: 'Human site supervisors, workers & daily attendance',
    },
    {
      id: 'bills' as const,
      label: 'Bills, GST & Ledger',
      icon: FileSpreadsheet,
      badge: 'EXCEL',
      description: 'Vendor dues, project expenses & commercial sheets',
    },
    {
      id: 'ops_chat' as const,
      label: 'Team Ops Chat',
      icon: Users,
      badge: 'LIVE AI',
      description: 'WhatsApp-style site crew chat with AI task extraction',
    },
    {
      id: 'whatsapp' as const,
      label: 'WhatsApp Sandbox',
      icon: MessageSquare,
      badge: 'SIMULATOR',
      description: 'Interactive test chat for buyers and site engineers',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Pillar Header & Sub-Navigation */}
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
              <span className="badge badge-whatsapp" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                PILLAR 3: FIELD & SITE OPERATIONS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Human staff roster, field kharcha ledger & live crew coordination
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Operations Department
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
                  border: isActive ? '1px solid var(--brand-whatsapp)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(37, 211, 102, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 0 20px rgba(37, 211, 102, 0.2)' : 'none',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--brand-whatsapp)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: isActive ? '#000000' : 'var(--text-dim)',
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
                      background: isActive ? 'rgba(37, 211, 102, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? '#25d366' : 'var(--text-dim)',
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
        {activeSubTab === 'employees' && (
          <EmployeeManager onRefresh={onRefreshData} />
        )}

        {activeSubTab === 'bills' && (
          <BillsAndExcelHub onRefresh={onRefreshData} />
        )}

        {activeSubTab === 'ops_chat' && (
          <TeamOpsChatHub business={business} onRefreshData={onRefreshData} />
        )}

        {activeSubTab === 'whatsapp' && (
          <WhatsAppSimulator 
            business={business} 
            onRefreshData={onRefreshData} 
            onOpenUpgrade={onOpenUpgrade} 
          />
        )}
      </div>
    </div>
  );
}
