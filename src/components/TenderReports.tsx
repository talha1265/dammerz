'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  ShieldAlert, 
  Sparkles,
  Calendar,
  Send,
  MessageSquare,
  IndianRupee
} from 'lucide-react';
import { ManagerReport } from '@/lib/types';

interface TenderReportsProps {
  onRefresh: () => void;
}

export default function TenderReports({ onRefresh }: TenderReportsProps) {
  const [reports, setReports] = useState<ManagerReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newReport, setNewReport] = useState({
    reporterName: '',
    reporterRole: 'tender_manager' as ManagerReport['reporterRole'],
    title: '',
    tenderCode: '',
    budgetStatus: 'Within approved margin (+15%)',
    summary: '',
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      const data = await res.json();
      if (data.success) {
        setShowSubmitModal(false);
        setNewReport({
          reporterName: 'Ananya Roy',
          reporterRole: 'tender_manager',
          title: '',
          tenderCode: '',
          budgetStatus: 'Within approved margin (+15%)',
          summary: '',
        });
        fetchReports();
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={22} color="var(--brand-primary-light)" />
            Tender Manager & Project Manager Executive Reports
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Managers submit daily logs via WhatsApp or web portal. Google Gemini AI digests risks, milestone dates, and actions.
          </p>
        </div>

        <button onClick={() => setShowSubmitModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} />
          Submit Manager Report
        </button>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reports.map((rep) => (
          <div key={rep.id} className="vibe-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Title & Metadata */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>{rep.title}</h3>
                  {rep.tenderCode && (
                    <span className="badge badge-ai">CODE: {rep.tenderCode}</span>
                  )}
                  <span className="badge badge-whatsapp">
                    Channel: {rep.submissionChannel.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>Reported by: <strong style={{ color: 'var(--text-main)' }}>{rep.reporterName}</strong> ({rep.reporterRole.replace('_', ' ')})</span>
                  <span>• {rep.createdAt}</span>
                </div>
              </div>

              {rep.budgetStatus && (
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--brand-primary-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <IndianRupee size={12} />
                  <span>{rep.budgetStatus}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {rep.summary}
            </div>

            {/* Gemini AI Intelligence Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              
              {/* Risks & Alerts */}
              <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                  <AlertTriangle size={16} />
                  <span>Identified Risk Warnings</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {rep.risksAlerts.map((risk, i) => (
                    <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: '#fb7185' }}>•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Action Items */}
              <div style={{ background: 'rgba(37, 211, 102, 0.06)', border: '1px solid rgba(37, 211, 102, 0.2)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-whatsapp)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                  <Sparkles size={16} />
                  <span>Gemini Recommended Actions</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {rep.aiActionItems.map((act, i) => (
                    <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <CheckCircle size={14} color="var(--brand-whatsapp)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Submit Tender or Project Operations Report</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Reporter Name</label>
                  <input
                    type="text"
                    required
                    value={newReport.reporterName}
                    onChange={(e) => setNewReport({ ...newReport, reporterName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Reporter Role</label>
                  <select
                    value={newReport.reporterRole}
                    onChange={(e) => setNewReport({ ...newReport, reporterRole: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="tender_manager">Tender Documentation Manager</option>
                    <option value="project_manager">Senior Project Engineer / Manager</option>
                    <option value="operations_head">Operations Head</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Report Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IOCL Pipeline Tender Bid Submission Review"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tender / Project Code</label>
                  <input
                    type="text"
                    placeholder="e.g. IOCL-2026-V8"
                    value={newReport.tenderCode}
                    onChange={(e) => setNewReport({ ...newReport, tenderCode: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Budget Variance Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Margin +18.4%"
                    value={newReport.budgetStatus}
                    onChange={(e) => setNewReport({ ...newReport, budgetStatus: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Executive Summary & Findings *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the technical milestones, contractor compliance, raw material delays, or bid status..."
                  value={newReport.summary}
                  onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowSubmitModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Process with Gemini AI</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
