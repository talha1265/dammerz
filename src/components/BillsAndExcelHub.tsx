'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Download, 
  DollarSign, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Upload
} from 'lucide-react';
import { Bill } from '@/lib/types';

interface BillsAndExcelHubProps {
  onRefresh: () => void;
}

export default function BillsAndExcelHub({ onRefresh }: BillsAndExcelHubProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const [newBill, setNewBill] = useState({
    billNumber: '',
    partyName: '',
    type: 'vendor_purchase' as Bill['type'],
    amount: '',
    gstAmount: '',
    dueDate: '',
    status: 'pending' as Bill['status'],
    description: '',
    siteReference: 'Sector 62 Metro Depot Site',
  });

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bills');
      const data = await res.json();
      if (data.success) {
        setBills(data.bills);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewBill({
          billNumber: '',
          partyName: '',
          type: 'vendor_purchase',
          amount: '',
          gstAmount: '',
          dueDate: '',
          status: 'pending',
          description: '',
          siteReference: 'Sector 62 Metro Depot Site',
        });
        fetchBills();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadCSV = () => {
    window.open('/api/bills?format=csv', '_blank');
  };

  const totalReceivables = bills
    .filter((b) => b.type === 'sale_invoice' && b.status !== 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPayables = bills
    .filter((b) => (b.type === 'vendor_purchase' || b.type === 'site_expense') && b.status !== 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const filtered = bills.filter((b) => {
    if (filterType === 'all') return true;
    return b.type === filterType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Ledger Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pending Customer Receivables</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
            ₹{totalReceivables.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            GST Invoiced to IndiaMart / Direct clients
          </div>
        </div>

        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pending Vendor & Site Payables</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fb7185' }}>
            ₹{totalPayables.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Raw steel & ReadyMix site expenses
          </div>
        </div>

        <div className="vibe-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Input Tax Credit (ITC) Reconciled</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary-light)', marginTop: '4px' }}>
            Automated GST Portal format
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="vibe-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Bills' },
            { id: 'sale_invoice', label: 'Sale Invoices' },
            { id: 'vendor_purchase', label: 'Vendor Purchases' },
            { id: 'site_expense', label: 'Site Expenses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={filterType === tab.id ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownloadCSV}
            className="btn btn-outline"
            style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'var(--brand-whatsapp)', color: 'var(--brand-whatsapp)' }}
          >
            <Download size={15} />
            Export Excel / CSV Ledger
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Plus size={15} />
            Log New Bill / Expense
          </button>
        </div>
      </div>

      {/* Bills Ledger Table */}
      <div className="vibe-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 14px' }}>Invoice / Bill #</th>
              <th style={{ padding: '12px 14px' }}>Party / Vendor</th>
              <th style={{ padding: '12px 14px' }}>Category</th>
              <th style={{ padding: '12px 14px' }}>Base Amount</th>
              <th style={{ padding: '12px 14px' }}>GST (18%)</th>
              <th style={{ padding: '12px 14px' }}>Total Amount</th>
              <th style={{ padding: '12px 14px' }}>Due Date</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bill) => (
              <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {bill.billNumber}
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{bill.siteReference}</div>
                </td>

                <td style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{bill.partyName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bill.description}</div>
                </td>

                <td style={{ padding: '14px' }}>
                  <span className="badge badge-ai" style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
                    {bill.type.replace('_', ' ')}
                  </span>
                </td>

                <td style={{ padding: '14px', color: 'var(--text-main)' }}>
                  ₹{bill.amount.toLocaleString('en-IN')}
                </td>

                <td style={{ padding: '14px', color: 'var(--brand-primary-light)' }}>
                  ₹{bill.gstAmount.toLocaleString('en-IN')}
                </td>

                <td style={{ padding: '14px', fontWeight: 800, color: 'var(--brand-whatsapp)' }}>
                  ₹{bill.totalAmount.toLocaleString('en-IN')}
                </td>

                <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {bill.dueDate}
                </td>

                <td style={{ padding: '14px' }}>
                  <span className={bill.status === 'paid' ? 'badge badge-online' : bill.status === 'overdue' ? 'badge badge-busy' : 'badge badge-premium'}>
                    {bill.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
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
          <div className="glass-panel" style={{ maxWidth: '540px', width: '100%', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Log New Commercial Bill / Expense</h3>
            <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Invoice / Bill # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-2026-904"
                    value={newBill.billNumber}
                    onChange={(e) => setNewBill({ ...newBill, billNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Party / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jindal Steel Ltd"
                    value={newBill.partyName}
                    onChange={(e) => setNewBill({ ...newBill, partyName: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bill Category</label>
                  <select
                    value={newBill.type}
                    onChange={(e) => setNewBill({ ...newBill, type: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="sale_invoice">Sale Invoice (Receivable)</option>
                    <option value="vendor_purchase">Vendor Purchase (Payable)</option>
                    <option value="site_expense">Site Operations Expense</option>
                    <option value="transport">Freight & Transport</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Base Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 250000"
                    value={newBill.amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const gst = Math.round(Number(val) * 0.18).toString();
                      setNewBill({ ...newBill, amount: val, gstAmount: gst });
                    }}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>GST Amount (18% auto)</label>
                  <input
                    type="number"
                    value={newBill.gstAmount}
                    onChange={(e) => setNewBill({ ...newBill, gstAmount: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Payment Due Date</label>
                  <input
                    type="date"
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Associated Site Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 62 Metro Depot Site, Noida"
                  value={newBill.siteReference}
                  onChange={(e) => setNewBill({ ...newBill, siteReference: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-whatsapp">Save & Add to Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
