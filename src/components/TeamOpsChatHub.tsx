'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Users, 
  Package, 
  FileSpreadsheet, 
  MapPin, 
  Clock, 
  Calendar, 
  Search, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Filter, 
  Share2, 
  MessageSquare, 
  HardHat, 
  Building2, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Phone,
  RefreshCw,
  Download,
  Volume2,
  Plus,
  BookOpen,
  Navigation,
  FileText,
  ShieldCheck,
  Layers,
  Database,
  X
} from 'lucide-react';
import { InventoryItem, AttendanceRecord, TeamChatMessage, Bill, Employee, Business } from '@/lib/types';
import OperationsGuideModal from './OperationsGuideModal';

interface TeamOpsChatHubProps {
  business: Business;
  onRefreshData?: () => void;
}

type ActiveView = 'split' | 'chat_only' | 'charts_only';
type ChartSection = 'all' | 'attendance' | 'inventory' | 'bills';

export default function TeamOpsChatHub({ business, onRefreshData }: TeamOpsChatHubProps) {
  // State for data
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // UI state
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<{
    name: string;
    role: 'manager' | 'staff' | 'client' | 'admin';
    title: string;
  }>({
    name: 'Vikram Sharma',
    role: 'staff',
    title: 'Senior Site Project Engineer',
  });
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'attendance' | 'inventory' | 'billing' | 'query'>('general');
  const [viewMode, setViewMode] = useState<ActiveView>('split');
  const [activeChartTab, setActiveChartTab] = useState<ChartSection>('all');

  // Sorting & Filtering controls for charts ("Short the chart")
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceSortBy, setAttendanceSortBy] = useState<'name_asc' | 'time_desc' | 'status'>('time_desc');
  const [inventorySortBy, setInventorySortBy] = useState<'value_desc' | 'qty_desc' | 'name_asc'>('value_desc');
  const [billsSortBy, setBillsSortBy] = useState<'amount_desc' | 'date_asc' | 'party_asc'>('amount_desc');

  // Modals & Action Forms
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  // Form states
  const [attForm, setAttForm] = useState({
    employeeName: 'Vikram Sharma',
    role: 'Senior Site Project Engineer',
    location: 'Sector 62 Metro Depot Site, Noida',
    status: 'on_site',
    notes: 'Morning site inspection completed.',
  });

  const [invForm, setInvForm] = useState({
    name: '',
    sku: '',
    category: 'Valves & Flow Controls',
    quantity: '50',
    unit: 'units',
    unitPrice: '3500',
    warehouseLocation: 'Gurugram Central Depot',
  });

  const [billForm, setBillForm] = useState({
    partyName: '',
    billNumber: '',
    amount: '',
    gstAmount: '',
    dueDate: '',
    description: '',
  });

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`•]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadCSV = () => {
    if (activeChartTab === 'inventory') {
      window.open('/api/inventory?format=csv', '_blank');
    } else if (activeChartTab === 'bills') {
      window.open('/api/bills?format=csv', '_blank');
    } else {
      window.open('/api/attendance?format=csv', '_blank');
    }
  };

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAttendanceModal(false);
        fetchOpsData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowInventoryModal(false);
        setInvForm({
          name: '',
          sku: '',
          category: 'Valves & Flow Controls',
          quantity: '50',
          unit: 'units',
          unitPrice: '3500',
          warehouseLocation: 'Gurugram Central Depot',
        });
        fetchOpsData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...billForm,
          billNumber: billForm.billNumber || `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowBillModal(false);
        setBillForm({
          partyName: '',
          billNumber: '',
          amount: '',
          gstAmount: '',
          dueDate: '',
          description: '',
        });
        fetchOpsData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch all initial data
  const fetchOpsData = async () => {
    try {
      const res = await fetch('/api/ops-chat');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setInventory(data.inventory || []);
        setAttendance(data.attendance || []);
        setBills(data.bills || []);
      }

      const empRes = await fetch('/api/employees');
      const empData = await empRes.json();
      if (empData.success) {
        setEmployees(empData.employees || []);
      }
    } catch (e) {
      console.error('Failed to load ops data', e);
    }
  };

  useEffect(() => {
    fetchOpsData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle sending chat message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    // Optimistically add message
    const tempMsg: TeamChatMessage = {
      id: `temp_${Date.now()}`,
      businessId: business.id,
      senderName: selectedPersona.name,
      senderRole: selectedPersona.role,
      text,
      category: selectedCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ops-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: selectedPersona.name,
          senderRole: selectedPersona.role,
          text,
          category: selectedCategory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh full dataset to capture any newly created attendance, inventory, or bill
        await fetchOpsData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Quick prompt buttons
  const quickPrompts = [
    { label: 'Site Eng: 12 Labours @ 9 AM', icon: HardHat, text: '12 labours present today: Ramesh, Dinesh, Suresh, Mukesh. Work started at 9:00 AM on foundation casting' },
    { label: 'Site Update: 25 Valves Received', icon: Package, text: 'Site update: 25 forged ball valves DN50 received at site depot from Kaveri Steel' },
    { label: 'Material: 100 Bags Cement', icon: Plus, text: 'Received 100 bags UltraTech cement @ 420 per bag at Sector 62 Site Yard' },
    { label: 'Vikram Sharma Check-In', icon: MapPin, text: 'Vikram Sharma reached site and checked in at Sector 62 Metro Depot Site' },
    { label: 'Total Inventory Valuation', icon: Package, text: 'What is our total warehouse inventory value?' },
    { label: 'Who is on site today?', icon: Navigation, text: 'Who is currently on site today?' },
    { label: 'Attendance: Vikram Sharma', icon: MapPin, text: 'Show attendance of Vikram Sharma' },
    { label: 'Invoice: Bharat Infra', icon: FileText, text: 'Show bill for Bharat Infrastructure Corp' },
  ];

  // ==========================================
  // "Short the Chart" / Sorting and Filtering
  // ==========================================

  // 1. Processed Attendance Records
  const filteredAttendance = attendance
    .filter((a) => {
      const term = searchTerm.toLowerCase();
      return (
        a.employeeName.toLowerCase().includes(term) ||
        a.location.toLowerCase().includes(term) ||
        a.notes.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (attendanceSortBy === 'name_asc') {
        return a.employeeName.localeCompare(b.employeeName);
      }
      if (attendanceSortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      // time_desc
      return (b.checkInTime || '').localeCompare(a.checkInTime || '');
    });

  // 2. Processed Inventory Items
  const totalInventoryValuation = inventory.reduce(
    (acc, item) => acc + (item.totalValue || item.quantity * item.unitPrice),
    0
  );

  const filteredInventory = inventory
    .filter((item) => {
      const term = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.warehouseLocation.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (inventorySortBy === 'value_desc') {
        return (b.totalValue || 0) - (a.totalValue || 0);
      }
      if (inventorySortBy === 'qty_desc') {
        return b.quantity - a.quantity;
      }
      return a.name.localeCompare(b.name);
    });

  // 3. Processed Bills
  const totalBillsAmount = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const pendingBillsAmount = bills
    .filter((b) => b.status === 'pending')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const filteredBills = bills
    .filter((b) => {
      const term = searchTerm.toLowerCase();
      return (
        b.partyName.toLowerCase().includes(term) ||
        b.billNumber.toLowerCase().includes(term) ||
        b.dueDate.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (billsSortBy === 'amount_desc') {
        return b.totalAmount - a.totalAmount;
      }
      if (billsSortBy === 'date_asc') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return a.partyName.localeCompare(b.partyName);
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner Header */}
      <div className="vibe-card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="badge badge-whatsapp">
              <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
              OPERATIONS CHAT INTELLIGENCE
            </span>
            <span className="badge badge-ai">Real-Time DB Sync</span>
            <span className="badge badge-premium">WhatsApp Connected</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 800 }}>
            Team Operations Chat & Business Intelligence
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Staff, managers, and clients can chat naturally. Extracted values (attendance, staff locations, inventory, and bills) are stored live and queryable via WhatsApp & Dashboard.
          </p>
        </div>

        {/* View Layout Controls & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('split')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                background: viewMode === 'split' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'split' ? '#ffffff' : 'var(--text-muted)',
                borderRadius: '6px',
              }}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('chat_only')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                background: viewMode === 'chat_only' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'chat_only' ? '#ffffff' : 'var(--text-muted)',
                borderRadius: '6px',
              }}
            >
              Chat Only
            </button>
            <button
              onClick={() => setViewMode('charts_only')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                background: viewMode === 'charts_only' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'charts_only' ? '#ffffff' : 'var(--text-muted)',
                borderRadius: '6px',
              }}
            >
              Charts & Data
            </button>
          </div>

          <button 
            onClick={() => setShowGuideModal(true)} 
            className="btn btn-outline" 
            style={{ fontSize: '0.8rem', padding: '7px 12px', borderColor: 'rgba(99, 102, 241, 0.4)', color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BookOpen size={14} /> Operations Guide
          </button>

          <button onClick={fetchOpsData} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '7px 12px' }}>
            <RefreshCw size={14} /> Refresh DB
          </button>
        </div>
      </div>

      {/* Main Grid: Chat + Sortable Visual Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: viewMode === 'split' ? '1.1fr 1fr' : '1fr', 
        gap: '20px',
        alignItems: 'start'
      }}>

        {/* ============================================================ */}
        {/* PANEL 1: TEAM LIVE CHAT & COPILOT */}
        {/* ============================================================ */}
        {(viewMode === 'split' || viewMode === 'chat_only') && (
          <div className="vibe-card" style={{ display: 'flex', flexDirection: 'column', height: '760px', overflow: 'hidden' }}>
            
            {/* Persona Switcher Bar */}
            <div style={{ 
              padding: '14px 18px', 
              background: 'rgba(255, 255, 255, 0.03)', 
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chatting As:</span>
                <select
                  value={selectedPersona.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Vikram Sharma') {
                      setSelectedPersona({ name: 'Vikram Sharma', role: 'staff', title: 'Senior Site Project Engineer' });
                    } else if (val === 'Ananya Roy') {
                      setSelectedPersona({ name: 'Ananya Roy', role: 'manager', title: 'Tender Documentation Manager' });
                    } else if (val === 'Sunil Verma') {
                      setSelectedPersona({ name: 'Sunil Verma', role: 'staff', title: 'Central Dispatch Supervisor' });
                    } else if (val === 'Operations Director') {
                      setSelectedPersona({ name: 'Operations Director', role: 'client', title: 'Business Client / Director' });
                    } else {
                      setSelectedPersona({ name: 'Admin Desk', role: 'admin', title: 'Central Operations Admin' });
                    }
                  }}
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="Vikram Sharma">Vikram Sharma (Senior Site Project Engineer)</option>
                  <option value="Ananya Roy">Ananya Roy (Tender Documentation Manager)</option>
                  <option value="Sunil Verma">Sunil Verma (Central Dispatch Supervisor)</option>
                  <option value="Operations Director">Operations Director (Client Account)</option>
                  <option value="Admin Desk">Admin Desk (Central Operations)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`badge ${selectedPersona.role === 'manager' ? 'badge-ai' : selectedPersona.role === 'client' ? 'badge-premium' : 'badge-whatsapp'}`} style={{ fontSize: '0.72rem' }}>
                  {selectedPersona.title}
                </span>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ 
              padding: '10px 18px', 
              background: 'rgba(0, 0, 0, 0.2)', 
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              {quickPrompts.map((p, idx) => {
                const PromptIcon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="vibe-quick-pill"
                    style={{
                      fontSize: '0.74rem',
                      padding: '5px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <PromptIcon size={12} color="var(--brand-primary-light)" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Messages Feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((msg) => {
                const isMe = msg.senderName === selectedPersona.name;
                const isBot = msg.isBot || msg.senderRole === 'bot';

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {/* Sender Identity & Role Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {isBot ? (
                        <>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={11} color="#fff" />
                          </div>
                          <strong style={{ color: '#818cf8' }}>BizzUp Operations Bot</strong>
                        </>
                      ) : (
                        <>
                          <strong>{msg.senderName}</strong>
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: msg.senderRole === 'manager' ? 'rgba(99, 102, 241, 0.2)' : msg.senderRole === 'client' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(37, 211, 102, 0.2)',
                            color: msg.senderRole === 'manager' ? '#818cf8' : msg.senderRole === 'client' ? '#fbbf24' : '#25d366',
                          }}>
                            {msg.senderRole?.toUpperCase()}
                          </span>
                        </>
                      )}
                      <span>• {msg.timestamp}</span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      style={{
                        maxWidth: '82%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: isBot 
                          ? 'var(--card-bg-elevated)' 
                          : isMe 
                          ? 'linear-gradient(135deg, #4f46e5, #6366f1)' 
                          : 'var(--card-bg)',
                        border: isBot 
                          ? '1px solid rgba(99, 102, 241, 0.35)' 
                          : isMe 
                          ? '1px solid #4338ca' 
                          : '1px solid var(--border-subtle)',
                        color: isMe ? '#ffffff' : 'var(--text-main)',
                        fontSize: '0.86rem',
                        lineHeight: '1.5',
                        boxShadow: isMe 
                          ? '0 3px 12px rgba(79, 70, 229, 0.25)' 
                          : isBot 
                          ? '0 4px 16px rgba(0,0,0,0.06)' 
                          : 'none',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.text}

                      {isBot && (
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => speakText(msg.text)}
                            title="Listen to Voice Digest"
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#c7d2fe',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.72rem',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Volume2 size={12} />
                            <span>Listen to Voice Digest</span>
                          </button>
                        </div>
                      )}

                      {/* Extracted Data Action Badge */}
                      {msg.extractedData && (
                        <div style={{
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#fbbf24',
                        }}>
                          <CheckCircle2 size={13} color="#25d366" />
                          <span>{msg.extractedData.summary || 'Stored in Operations Database'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary-light)', fontSize: '0.8rem' }}>
                  <span className="pulse-indicator" style={{ width: '8px', height: '8px' }} />
                  Processing operations query & updating stored values...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Box */}
            <div style={{ 
              padding: '14px 18px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {/* Category selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tag:</span>
                {[
                  { id: 'general', label: 'General', icon: MessageSquare },
                  { id: 'attendance', label: 'Attendance', icon: MapPin },
                  { id: 'inventory', label: 'Inventory', icon: Package },
                  { id: 'billing', label: 'Bills & Ledger', icon: FileText },
                  { id: 'query', label: 'Query', icon: Search },
                ].map((c) => {
                  const TagIcon = c.icon;
                  const isSel = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id as any)}
                      style={{
                        border: isSel ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        background: isSel ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSel ? 'var(--text-main)' : 'var(--text-dim)',
                        fontSize: '0.72rem',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: isSel ? 700 : 500,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <TagIcon size={11} color={isSel ? 'var(--brand-primary-light)' : 'inherit'} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Chat with team or query: 'Attendance of Vikram', 'Inventory valuation', 'Bill of Bharat Infra'..."
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !inputText.trim()}
                  className="btn btn-primary"
                  style={{ padding: '0 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* PANEL 2: STORED VALUES ENGINE & SORTABLE DATA                */}
        {/* ============================================================ */}
        {(viewMode === 'split' || viewMode === 'charts_only') && (
          <div className="vibe-card" style={{ display: 'flex', flexDirection: 'column', height: '760px', overflow: 'hidden' }}>
            
            {/* Header with Search and Chart Tabs */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
                    Stored Values & Sortable Data
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Visual records synchronized with Live Chat & WhatsApp queries
                  </p>
                </div>

                {/* Sub-tabs */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  {[
                    { id: 'all', label: 'All Records' },
                    { id: 'attendance', label: 'Attendance' },
                    { id: 'inventory', label: 'Inventory' },
                    { id: 'bills', label: 'Bills' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChartTab(tab.id as any)}
                      style={{
                        border: 'none',
                        background: activeChartTab === tab.id ? 'var(--brand-primary)' : 'transparent',
                        color: activeChartTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.74rem',
                        padding: '4px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar + Sorting Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, site, date, bill #..."
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', width: '100%', outline: 'none' }}
                  />
                </div>

                {/* Dynamic Sorting Select based on current tab */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowUpDown size={13} color="var(--brand-amber)" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sort:</span>
                  
                  {activeChartTab === 'inventory' ? (
                    <select
                      value={inventorySortBy}
                      onChange={(e) => setInventorySortBy(e.target.value as any)}
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '5px 8px', fontSize: '0.75rem' }}
                    >
                      <option value="value_desc">Valuation (High to Low)</option>
                      <option value="qty_desc">Stock Units (High to Low)</option>
                      <option value="name_asc">Item Name (A-Z)</option>
                    </select>
                  ) : activeChartTab === 'bills' ? (
                    <select
                      value={billsSortBy}
                      onChange={(e) => setBillsSortBy(e.target.value as any)}
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '5px 8px', fontSize: '0.75rem' }}
                    >
                      <option value="amount_desc">Amount (Highest First)</option>
                      <option value="date_asc">Due Date (Earliest First)</option>
                      <option value="party_asc">Party Name (A-Z)</option>
                    </select>
                  ) : (
                    <select
                      value={attendanceSortBy}
                      onChange={(e) => setAttendanceSortBy(e.target.value as any)}
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '5px 8px', fontSize: '0.75rem' }}
                    >
                      <option value="time_desc">Punch Time (Recent First)</option>
                      <option value="name_asc">Staff Name (A-Z)</option>
                      <option value="status">Status (On Site First)</option>
                    </select>
                  )}
                </div>

                {/* Quick Add & CSV Export Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowAttendanceModal(true)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.72rem', padding: '5px 9px', borderColor: 'var(--brand-whatsapp)', color: 'var(--brand-whatsapp)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} /> Check-In Staff
                  </button>
                  <button
                    onClick={() => setShowInventoryModal(true)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.72rem', padding: '5px 9px', borderColor: 'var(--brand-amber)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} /> Add SKU
                  </button>
                  <button
                    onClick={() => setShowBillModal(true)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.72rem', padding: '5px 9px', borderColor: 'var(--brand-primary-light)', color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} /> Log Bill
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="btn btn-outline"
                    style={{ fontSize: '0.72rem', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Download size={12} /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Charts Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* SECTION A: INVENTORY VALUES CHART */}
              {(activeChartTab === 'all' || activeChartTab === 'inventory') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} color="var(--brand-amber)" />
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 700 }}>
                        Inventory Valuation Chart
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                      Total: ₹{(totalInventoryValuation / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>

                  {/* Visual Bar Breakdown Chart */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredInventory.map((item) => {
                      const percent = totalInventoryValuation > 0 
                        ? Math.round((item.totalValue / totalInventoryValuation) * 100) 
                        : 0;

                      return (
                        <div 
                          key={item.id}
                          style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {item.sku} • {item.warehouseLocation}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                                ₹{item.totalValue.toLocaleString('en-IN')}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {item.quantity} {item.unit} @ ₹{item.unitPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${percent}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                              borderRadius: '3px',
                            }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            <span>{percent}% of warehouse valuation</span>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              color: item.status === 'in_stock' ? 'var(--brand-whatsapp)' : '#ef4444',
                              fontWeight: 600,
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.status === 'in_stock' ? 'var(--brand-whatsapp)' : '#ef4444' }} />
                              {item.status === 'in_stock' ? 'In Stock' : 'Low Stock Alert'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION B: ATTENDANCE & STAFF LOCATIONS CHART */}
              {(activeChartTab === 'all' || activeChartTab === 'attendance') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HardHat size={16} color="var(--brand-whatsapp)" />
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 700 }}>
                        Staff Attendance & Live Locations
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-whatsapp)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-whatsapp)' }} />
                      {filteredAttendance.filter(a => a.status === 'on_site' || a.status === 'present').length} Present Today
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    {filteredAttendance.map((rec) => {
                      return (
                        <div
                          key={rec.id}
                          style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {rec.employeeName}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {rec.role}
                              </div>
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: rec.status === 'on_site' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                              color: rec.status === 'on_site' ? 'var(--brand-whatsapp)' : 'var(--brand-primary-light)',
                              fontWeight: 700,
                            }}>
                              {rec.status.toUpperCase()}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--brand-primary-light)' }}>
                            <MapPin size={12} color="var(--brand-primary-light)" />
                            <span>{rec.location}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            <Clock size={11} />
                            <span>Check-in: {rec.checkInTime} ({rec.date})</span>
                          </div>

                          {rec.notes && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--card-bg-elevated)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                              "{rec.notes}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION C: PARTICULAR BILLS & INVOICE TIMELINE */}
              {(activeChartTab === 'all' || activeChartTab === 'bills') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileSpreadsheet size={16} color="var(--brand-primary-light)" />
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 700 }}>
                        Particular Bills Ledger & Receivables
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary-light)', fontWeight: 700 }}>
                      Pending: ₹{pendingBillsAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredBills.map((bill) => {
                      return (
                        <div
                          key={bill.id}
                          style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {bill.partyName}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Invoice #{bill.billNumber} • Due: {bill.dueDate}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>
                                ₹{bill.totalAmount.toLocaleString('en-IN')}
                              </div>
                              <span style={{
                                fontSize: '0.65rem',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: bill.status === 'paid' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: bill.status === 'paid' ? 'var(--brand-whatsapp)' : 'var(--brand-amber)',
                                fontWeight: 700,
                              }}>
                                {bill.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                            {bill.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Status Strip */}
            <div style={{ 
              padding: '12px 18px', 
              background: 'var(--card-bg)', 
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Database size={13} color="var(--brand-primary-light)" />
                All records stored live in Neon/Memory
              </span>
              <span style={{ color: 'var(--brand-whatsapp)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <MessageSquare size={13} />
                Query anytime on WhatsApp with Name or Date
              </span>
            </div>

          </div>
        )}

      </div>

      {/* OPERATIONS PLAYBOOK GUIDE MODAL */}
      <OperationsGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* MODAL 1: CHECK IN STAFF / ATTENDANCE */}
      {showAttendanceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HardHat size={18} color="var(--brand-whatsapp)" />
                Check In Staff / Log Attendance
              </h3>
              <button onClick={() => setShowAttendanceModal(false)} className="btn btn-outline" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Staff Name</label>
                <select
                  value={attForm.employeeName}
                  onChange={(e) => {
                    const emp = employees.find(x => x.name === e.target.value);
                    setAttForm({
                      ...attForm,
                      employeeName: e.target.value,
                      role: emp ? emp.role : attForm.role,
                      location: emp ? emp.siteName : attForm.location,
                    });
                  }}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--card-bg)', color: 'var(--text-main)' }}
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.name}>{e.name} ({e.role})</option>
                  ))}
                  <option value="New Field Engineer">New Field Engineer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Site Location</label>
                <input
                  type="text"
                  value={attForm.location}
                  onChange={(e) => setAttForm({ ...attForm, location: e.target.value })}
                  placeholder="e.g. Sector 62 Metro Depot Site, Noida"
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</label>
                  <select
                    value={attForm.status}
                    onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--card-bg)', color: 'var(--text-main)' }}
                  >
                    <option value="on_site">On Site (Active)</option>
                    <option value="present">Present (Office)</option>
                    <option value="on_break">On Break</option>
                    <option value="half_day">Half Day</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Role</label>
                  <input
                    type="text"
                    value={attForm.role}
                    onChange={(e) => setAttForm({ ...attForm, role: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Duty Note / Milestone</label>
                <textarea
                  value={attForm.notes}
                  onChange={(e) => setAttForm({ ...attForm, notes: e.target.value })}
                  rows={2}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px' }}
                  placeholder="Notes about work completed or labor active..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAttendanceModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-whatsapp">
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD INVENTORY SKU */}
      {showInventoryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="var(--brand-amber)" />
                Add Warehouse Inventory Item
              </h3>
              <button onClick={() => setShowInventoryModal(false)} className="btn btn-outline" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateInventory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Product / SKU Name</label>
                <input
                  type="text"
                  value={invForm.name}
                  onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
                  placeholder="e.g. Forged Steel Flanged Ball Valves DN50"
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Quantity</label>
                  <input
                    type="number"
                    value={invForm.quantity}
                    onChange={(e) => setInvForm({ ...invForm, quantity: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Unit</label>
                  <input
                    type="text"
                    value={invForm.unit}
                    onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })}
                    placeholder="units, MT, sets"
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Unit Price (INR)</label>
                  <input
                    type="number"
                    value={invForm.unitPrice}
                    onChange={(e) => setInvForm({ ...invForm, unitPrice: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Category</label>
                  <select
                    value={invForm.category}
                    onChange={(e) => setInvForm({ ...invForm, category: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--card-bg)', color: 'var(--text-main)' }}
                  >
                    <option value="Valves & Flow Controls">Valves & Flow Controls</option>
                    <option value="Industrial Pumps">Industrial Pumps</option>
                    <option value="Raw Materials & Castings">Raw Materials & Castings</option>
                    <option value="Automation & Controls">Automation & Controls</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Warehouse Location</label>
                <input
                  type="text"
                  value={invForm.warehouseLocation}
                  onChange={(e) => setInvForm({ ...invForm, warehouseLocation: e.target.value })}
                  placeholder="e.g. Bhiwandi Central Logistics Hub or Gurugram Depot"
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowInventoryModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--brand-amber)', color: '#000', fontWeight: 700 }}>
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE COMMERCIAL BILL */}
      {showBillModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={18} color="var(--brand-primary-light)" />
                Log Commercial Bill / Invoice
              </h3>
              <button onClick={() => setShowBillModal(false)} className="btn btn-outline" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Party / Client Name</label>
                <input
                  type="text"
                  value={billForm.partyName}
                  onChange={(e) => setBillForm({ ...billForm, partyName: e.target.value })}
                  placeholder="e.g. Larsen & Toubro Hydrocarbon"
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Base Amount (INR)</label>
                  <input
                    type="number"
                    value={billForm.amount}
                    onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                    placeholder="250000"
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Due Date</label>
                  <input
                    type="date"
                    value={billForm.dueDate}
                    onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 12px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Description / Line Items</label>
                <textarea
                  value={billForm.description}
                  onChange={(e) => setBillForm({ ...billForm, description: e.target.value })}
                  rows={2}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px' }}
                  placeholder="Supply of PN16 Valves with hydrostatic test reports..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowBillModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Bill to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
