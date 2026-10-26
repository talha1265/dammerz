'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  KeyRound, 
  Copy, 
  CheckCircle2, 
  HardHat, 
  Building2, 
  FileText,
  ShieldCheck,
  Send,
  Download,
  DollarSign,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  Unlock,
  UserCheck,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Filter,
  Check,
  X
} from 'lucide-react';
import { Employee, StaffRoleCategory, AttendanceRecord } from '@/lib/types';

interface EmployeeManagerProps {
  onRefresh: () => void;
}

export default function EmployeeManager({ onRefresh }: EmployeeManagerProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [viewTab, setViewTab] = useState<'roster' | 'attendance_excel'>('roster');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Role Perspective / Access Control
  const [actingRole, setActingRole] = useState<StaffRoleCategory>('business_owner');
  const [filterTender, setFilterTender] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  const canAddStaff = actingRole === 'business_owner' || actingRole === 'project_manager' || actingRole === 'site_manager';

  // Available Tenders & Projects
  const availableProjects = [
    'Metro Rail Phase 4 - Tender #MR-402',
    'IOCL Panipat Refinery - Tender #IOCL-88',
    'NHAI Expressway Package 2 - Tender #NHAI-105',
    'Smart City Water Supply - Tender #SCW-210',
    'Central Depot & Fabrication Hub',
  ];

  // Add Staff Form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Site Project Engineer',
    roleCategory: 'site_engineer' as StaffRoleCategory,
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 ',
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    reportingManagerName: 'Rajesh Khanna (Senior Project Manager)',
    reportingManagerId: '',
    dailyWageRate: '2200',
    monthlySalary: '55000',
    overtimeRate: '200',
    skillSpecialty: 'Structural Concrete & QA',
  });

  // Log Hours Form state
  const [hoursForm, setHoursForm] = useState({
    employeeName: '',
    workingHours: '8.5',
    overtimeHours: '1.0',
    notes: 'Completed scheduled casting and shift checklist.',
  });

  const fetchEmployeesAndAttendance = async () => {
    setLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/attendance'),
      ]);

      const [empData, attData] = await Promise.all([
        empRes.json(),
        attRes.json(),
      ]);

      if (empData.success) {
        setEmployees(empData.employees);
      }
      if (attData.success) {
        setAttendance(attData.attendance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndAttendance();
  }, []);

  // Update default reporting manager when project tender or role category changes
  useEffect(() => {
    const managers = employees.filter(
      (e) => e.roleCategory === 'project_manager' || e.roleCategory === 'site_manager' || e.roleCategory === 'site_supervisor' || e.roleCategory === 'business_owner'
    );
    if (managers.length > 0 && !newStaff.reportingManagerName) {
      setNewStaff((prev) => ({
        ...prev,
        reportingManagerName: `${managers[0].name} (${managers[0].role})`,
        reportingManagerId: managers[0].id,
      }));
    }
  }, [employees]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddStaff) {
      alert('Permission Denied: Only Business Owners and Managers can add staff.');
      return;
    }

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          actorRole: actingRole,
          employee: {
            ...newStaff,
            dailyWageRate: Number(newStaff.dailyWageRate) || 950,
            monthlySalary: Number(newStaff.monthlySalary) || 35000,
            overtimeRate: Number(newStaff.overtimeRate) || 140,
            assignedBy: actingRole === 'business_owner' ? 'Business Owner' : 'Project Manager',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewStaff({
          name: '',
          role: 'Site Project Engineer',
          roleCategory: 'site_engineer',
          siteName: 'Sector 62 Metro Depot Site, Noida',
          phone: '+91 ',
          projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
          reportingManagerName: 'Rajesh Khanna (Senior Project Manager)',
          reportingManagerId: '',
          dailyWageRate: '2200',
          monthlySalary: '55000',
          overtimeRate: '200',
          skillSpecialty: 'Structural Concrete & QA',
        });
        fetchEmployeesAndAttendance();
        onRefresh();
      } else {
        alert(data.error || 'Failed to create staff');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_hours',
          hoursData: {
            employeeName: hoursForm.employeeName || employees[0]?.name,
            workingHours: Number(hoursForm.workingHours) || 8.0,
            overtimeHours: Number(hoursForm.overtimeHours) || 0,
            notes: hoursForm.notes,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowHoursModal(false);
        fetchEmployeesAndAttendance();
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSalaryStatus = async (attId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_salary_status',
          attendanceId: attId,
          salaryStatus: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEmployeesAndAttendance();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyInvite = (emp: Employee) => {
    const inviteText = `👋 Hello ${emp.name}!\nYou have been enrolled on BizzUp Operations Roster.\n\n🏗️ *Tender / Project:* ${emp.projectTender || emp.siteName}\n👔 *Reporting To:* ${emp.reportingManagerName || 'Project Manager'}\n🔑 *Staff ID:* ${emp.staffId}\n🔒 *Password:* ${emp.password}\n💰 *Wage / Salary Rate:* ₹${(emp.dailyWageRate || 950).toLocaleString('en-IN')}/day\n🌐 *Portal Login:* ${window.location.origin}/login?tab=staff\n\n_Log in daily to report attendance, duty hours, and work logs in Hinglish or English!_`;
    navigator.clipboard.writeText(inviteText);
    setCopiedId(emp.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadExcel = () => {
    window.open('/api/attendance?format=csv', '_blank');
  };

  // Filtered employees
  const filteredEmployees = employees.filter((e) => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      (e.siteName && e.siteName.toLowerCase().includes(search.toLowerCase())) ||
      (e.projectTender && e.projectTender.toLowerCase().includes(search.toLowerCase())) ||
      (e.reportingManagerName && e.reportingManagerName.toLowerCase().includes(search.toLowerCase())) ||
      e.staffId.toLowerCase().includes(search.toLowerCase());

    const matchesTender = filterTender === 'all' || (e.projectTender && e.projectTender.toLowerCase().includes(filterTender.toLowerCase()));
    const matchesRole = filterRole === 'all' || e.roleCategory === filterRole;

    return matchesSearch && matchesTender && matchesRole;
  });

  // Filtered attendance records
  const filteredAttendance = attendance.filter((a) => {
    const matchesSearch = 
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      (a.projectTender && a.projectTender.toLowerCase().includes(search.toLowerCase())) ||
      (a.reportingManagerName && a.reportingManagerName.toLowerCase().includes(search.toLowerCase()));

    const matchesTender = filterTender === 'all' || (a.projectTender && a.projectTender.toLowerCase().includes(filterTender.toLowerCase()));

    return matchesSearch && matchesTender;
  });

  // Payroll / Attendance Summary Metrics
  const totalHoursLogged = attendance.reduce((sum, a) => sum + (a.workingHours || 8.0), 0);
  const totalOvertimeLogged = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
  const totalPayrollPayable = attendance.reduce((sum, a) => sum + (a.totalPayable || (a.dailyWage || 950)), 0);
  const totalPaid = attendance.filter(a => a.salaryStatus === 'paid').reduce((sum, a) => sum + (a.totalPayable || (a.dailyWage || 950)), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Role Perspective & Access Control Banner */}
      <div className="vibe-card" style={{
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'linear-gradient(135deg, rgba(20, 27, 44, 0.9) 0%, rgba(13, 17, 28, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Acting Role / Perspective:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'business_owner', label: '👑 Business Owner (Full Access)', allowed: true },
              { id: 'project_manager', label: '👔 Project Manager', allowed: true },
              { id: 'site_manager', label: '🏗️ Site Manager', allowed: true },
              { id: 'site_supervisor', label: '👷‍♂️ Site Supervisor (Restricted)', allowed: false },
              { id: 'worker', label: '🔨 Worker Staff (Restricted)', allowed: false },
            ].map((roleItem) => (
              <button
                key={roleItem.id}
                onClick={() => setActingRole(roleItem.id as StaffRoleCategory)}
                className={`vibe-quick-pill ${actingRole === roleItem.id ? 'active' : ''}`}
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 12px',
                  background: actingRole === roleItem.id 
                    ? (roleItem.allowed ? 'rgba(37, 211, 102, 0.2)' : 'rgba(239, 68, 68, 0.2)') 
                    : 'rgba(255, 255, 255, 0.04)',
                  borderColor: actingRole === roleItem.id 
                    ? (roleItem.allowed ? 'var(--brand-whatsapp)' : 'var(--brand-danger)') 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: actingRole === roleItem.id 
                    ? (roleItem.allowed ? 'var(--brand-whatsapp)' : '#f87171') 
                    : 'var(--text-muted)',
                }}
              >
                {roleItem.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {canAddStaff ? (
            <span className="badge badge-whatsapp" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Unlock size={12} /> Full Staff Provisioning & Salary Excel Access
            </span>
          ) : (
            <span className="badge badge-ai" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#f87171', color: '#f87171' }}>
              <Lock size={12} /> Read-Only Mode (Only Owners & Managers can add staff)
            </span>
          )}
        </div>
      </div>

      {/* Main Header & View Mode Switcher */}
      <div className="vibe-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 6px', color: 'var(--text-main)', fontWeight: 800 }}>
              <HardHat size={26} color="var(--brand-whatsapp)" />
              Staff ID Generator & Role Roster Engine
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Add Site Managers, Engineers, Project Managers, Supervisors & Workers assigned by Tender/Project. Site staff report under their supervisors, and owners/managers can download full Excel attendance & salary ledgers.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (!canAddStaff) {
                  alert('🔒 Permission Denied: Site Staff & Roles can only be added by Business Owners and Managers.');
                  return;
                }
                setShowAddModal(true);
              }}
              className="btn btn-whatsapp"
              style={{
                padding: '9px 18px',
                fontSize: '0.86rem',
                opacity: canAddStaff ? 1 : 0.65,
                cursor: canAddStaff ? 'pointer' : 'not-allowed',
              }}
              title={canAddStaff ? 'Generate and assign new staff credentials' : 'Locked: Only Business Owners and Managers can add staff'}
            >
              {canAddStaff ? <Plus size={16} /> : <Lock size={15} />}
              <span>Generate New Staff ID</span>
            </button>

            <button
              onClick={handleDownloadExcel}
              className="btn btn-outline"
              style={{ padding: '9px 16px', fontSize: '0.86rem', borderColor: 'var(--brand-primary-light)', color: 'var(--brand-primary-light)' }}
              title="Download Excel (.CSV) Attendance, Working Hours & Salary Ledger"
            >
              <Download size={15} />
              <span>Export Excel (.csv)</span>
            </button>

            <button
              onClick={() => {
                setHoursForm({
                  employeeName: employees[0]?.name || '',
                  workingHours: '8.5',
                  overtimeHours: '1.0',
                  notes: 'Completed shift checklist and pier casting.',
                });
                setShowHoursModal(true);
              }}
              className="btn btn-outline"
              style={{ padding: '9px 16px', fontSize: '0.86rem', borderColor: '#fbbf24', color: '#fbbf24' }}
            >
              <Clock size={15} />
              <span>Log Working Hours</span>
            </button>
          </div>
        </div>

        {/* View Tabs Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewTab('roster')}
              className={`btn ${viewTab === 'roster' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.84rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={15} />
              <span>Staff Roster Cards ({employees.length})</span>
            </button>
            <button
              onClick={() => setViewTab('attendance_excel')}
              className={`btn ${viewTab === 'attendance_excel' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.84rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileSpreadsheet size={15} />
              <span>Attendance, Hours & Salary Excel Ledger</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search staff, role, tender, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', fontSize: '0.82rem' }}
              />
            </div>

            <select
              value={filterTender}
              onChange={(e) => setFilterTender(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.82rem', padding: '7px 12px', minWidth: '170px' }}
            >
              <option value="all">All Tenders & Projects</option>
              <option value="Metro Rail">Metro Rail Phase 4</option>
              <option value="IOCL">IOCL Panipat Refinery</option>
              <option value="Expressway">NHAI Expressway</option>
            </select>

            {viewTab === 'roster' && (
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.82rem', padding: '7px 12px' }}
              >
                <option value="all">All Roles</option>
                <option value="project_manager">Project Managers</option>
                <option value="site_manager">Site Managers</option>
                <option value="site_engineer">Site Engineers</option>
                <option value="site_supervisor">Site Supervisors</option>
                <option value="worker">Workers & Labors</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* VIEW TAB 1: ROSTER CARDS WITH HIERARCHY & CREDENTIALS */}
      {viewTab === 'roster' && (
        <div className="grid-cards">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              className="vibe-card" 
              style={{ 
                padding: '22px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px', 
                position: 'relative',
                borderLeft: emp.roleCategory === 'project_manager' || emp.roleCategory === 'business_owner' 
                  ? '4px solid var(--brand-amber)' 
                  : emp.roleCategory === 'site_supervisor' || emp.roleCategory === 'site_manager'
                  ? '4px solid var(--brand-primary-light)'
                  : '4px solid var(--brand-whatsapp)'
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>{emp.name}</h3>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--brand-primary-light)', fontWeight: 700 }}>{emp.role}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>Phone: {emp.phone}</div>
                </div>

                <span className={emp.status === 'on_site' ? 'badge badge-whatsapp' : emp.status === 'active' ? 'badge badge-online' : 'badge'}>
                  {emp.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Hierarchy & Assignment Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.78rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-amber)' }}>
                  <Building2 size={13} />
                  <strong style={{ color: 'var(--text-main)' }}>Tender / Project:</strong> 
                  <span style={{ color: 'var(--brand-amber)', fontWeight: 600 }}>{emp.projectTender || emp.siteName}</span>
                </div>

                {emp.reportingManagerName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Users size={13} color="var(--brand-primary-light)" />
                    <span style={{ color: 'var(--text-dim)' }}>Assigned Under:</span> 
                    <strong style={{ color: 'var(--brand-primary-light)' }}>{emp.reportingManagerName}</strong>
                  </div>
                )}

                {emp.skillSpecialty && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Briefcase size={13} color="var(--brand-whatsapp)" />
                    <span style={{ color: 'var(--text-dim)' }}>Specialty:</span> 
                    <span style={{ color: 'var(--text-main)' }}>{emp.skillSpecialty}</span>
                  </div>
                )}
              </div>

              {/* Credentials & Salary Box */}
              <div style={{
                background: 'var(--card-bg-elevated)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Staff ID</span>
                  <span style={{ fontWeight: 800, color: 'var(--brand-amber)', fontSize: '0.9rem', fontFamily: 'monospace' }}>{emp.staffId}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Portal Password</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontSize: '0.85rem' }}>{emp.password}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Daily Wage / Salary</span>
                  <span style={{ fontWeight: 700, color: 'var(--brand-whatsapp)', fontSize: '0.84rem' }}>
                    ₹{(emp.dailyWageRate || 950).toLocaleString('en-IN')}/day {emp.monthlySalary ? `(₹${(emp.monthlySalary).toLocaleString('en-IN')}/mo)` : ''}
                  </span>
                </div>
              </div>

              {/* Live Duty Note */}
              <div style={{ background: 'rgba(255, 255, 255, 0.015)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '3px' }}>
                  <MapPin size={13} color="var(--brand-whatsapp)" />
                  <span style={{ fontWeight: 600 }}>{emp.currentLocation || emp.siteName}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  &quot;{emp.lastReportNote}&quot;
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {emp.lastUpdate}
                  </span>
                  <span>Hours today: <strong style={{ color: 'var(--text-main)' }}>{emp.workingHoursToday || 8.0}h</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCopyInvite(emp)}
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.78rem', padding: '7px 12px', justifyContent: 'center' }}
              >
                {copiedId === emp.id ? (
                  <>
                    <CheckCircle2 size={14} color="var(--brand-whatsapp)" />
                    <span>Copied WhatsApp Invite Card!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy WhatsApp Login Invite</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW TAB 2: ATTENDANCE, WORKING HOURS & SALARY EXCEL LEDGER */}
      {viewTab === 'attendance_excel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Summary KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="vibe-stat-card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Staff on Roll</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {attendance.length} Staff
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--brand-whatsapp)' }}>Present & on duty today</span>
            </div>

            <div className="vibe-stat-card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Hours Logged</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary-light)', marginTop: '4px' }}>
                {totalHoursLogged.toFixed(1)} Hrs
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--brand-primary-light)' }}>Includes {totalOvertimeLogged.toFixed(1)}h Overtime</span>
            </div>

            <div className="vibe-stat-card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Payroll Payable</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-amber)', marginTop: '4px' }}>
                ₹{(totalPayrollPayable).toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--brand-amber)' }}>₹{(totalPaid).toLocaleString('en-IN')} Settled / Disbursed</span>
            </div>

            <div className="vibe-stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button onClick={handleDownloadExcel} className="btn btn-whatsapp" style={{ width: '100%', padding: '10px', fontSize: '0.86rem' }}>
                <Download size={16} /> Download Full Excel (.CSV)
              </button>
            </div>
          </div>

          {/* Excel Spreadsheet Table */}
          <div className="vibe-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={18} color="var(--brand-whatsapp)" />
                <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                  Live Daily Attendance, Hours & Salary Ledger
                </h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Showing {filteredAttendance.length} records • Synchronized with Chatbot check-ins
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 8px' }}>Staff ID</th>
                  <th style={{ padding: '10px 8px' }}>Employee Name</th>
                  <th style={{ padding: '10px 8px' }}>Role & Hierarchy</th>
                  <th style={{ padding: '10px 8px' }}>Tender / Project</th>
                  <th style={{ padding: '10px 8px' }}>Date & In Time</th>
                  <th style={{ padding: '10px 8px' }}>Hours Worked</th>
                  <th style={{ padding: '10px 8px' }}>Overtime</th>
                  <th style={{ padding: '10px 8px' }}>Daily Wage</th>
                  <th style={{ padding: '10px 8px' }}>Total Salary</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                  <th style={{ padding: '10px 8px' }}>Payment</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((rec) => {
                  const emp = employees.find(e => e.id === rec.employeeId || e.name.toLowerCase() === rec.employeeName.toLowerCase());
                  const staffId = emp?.staffId || 'EMP-100';
                  const baseWage = rec.dailyWage || emp?.dailyWageRate || 950;
                  const otPay = rec.overtimePay || Math.round((rec.overtimeHours || 0) * (emp?.overtimeRate || 140));
                  const totalPay = rec.totalPayable || (baseWage + otPay);
                  const isPaid = rec.salaryStatus === 'paid';

                  return (
                    <tr 
                      key={rec.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: 'var(--brand-amber)', fontWeight: 700 }}>
                        {staffId}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {rec.employeeName}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ color: 'var(--text-main)' }}>{rec.role}</div>
                        {rec.reportingManagerName && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            Under: {rec.reportingManagerName}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--brand-primary-light)', fontSize: '0.78rem' }}>
                        {rec.projectTender || emp?.projectTender || 'Metro Rail Phase 4'}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-dim)', fontSize: '0.76rem' }}>
                        <div>{rec.date}</div>
                        <div>{rec.checkInTime}</div>
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {rec.workingHours || 8.0} hrs
                      </td>
                      <td style={{ padding: '12px 8px', color: rec.overtimeHours && rec.overtimeHours > 0 ? 'var(--brand-amber)' : 'var(--text-dim)' }}>
                        +{rec.overtimeHours || 0} hrs
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                        ₹{baseWage.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--brand-whatsapp)' }}>
                        ₹{totalPay.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="badge badge-whatsapp" style={{ fontSize: '0.68rem' }}>
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <button
                          onClick={() => handleToggleSalaryStatus(rec.id, rec.salaryStatus)}
                          className={`btn ${isPaid ? 'btn-whatsapp' : 'btn-outline'}`}
                          style={{
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            minHeight: 'auto',
                            borderColor: isPaid ? undefined : 'rgba(245, 158, 11, 0.4)',
                            color: isPaid ? '#fff' : 'var(--brand-amber)',
                          }}
                          title="Click to toggle payment status"
                        >
                          {isPaid ? <Check size={11} /> : <Clock size={11} />}
                          <span>{isPaid ? 'DISBURSED' : 'PENDING'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ADD STAFF MODAL (Tender assignment, Supervisor hierarchy & Salary) */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: 'var(--bg-secondary)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: 'var(--text-main)' }}>
                Generate Staff ID & Role Credentials
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.45' }}>
              Business owners and managers can add Site Managers, Site Engineers, Project Managers, Site Supervisors, and Worker Staff. Managers & supervisors are assigned by Tender/Project, and site staff are assigned under their manager/supervisor.
            </p>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Full Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel / Sunil Sharma"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="+91 98..."
                    className="input-field"
                  />
                </div>
              </div>

              {/* Role Category & Custom Title */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Role Category *</label>
                  <select
                    value={newStaff.roleCategory}
                    onChange={(e) => {
                      const cat = e.target.value as StaffRoleCategory;
                      let roleLabel = 'Site Project Engineer';
                      let wage = '2200';
                      let sal = '55000';
                      if (cat === 'project_manager') { roleLabel = 'Senior Project Manager'; wage = '3800'; sal = '95000'; }
                      else if (cat === 'site_manager') { roleLabel = 'Site Construction Manager'; wage = '3000'; sal = '75000'; }
                      else if (cat === 'site_supervisor') { roleLabel = 'Site Operations Supervisor'; wage = '1500'; sal = '38000'; }
                      else if (cat === 'worker') { roleLabel = 'Master Mason & Shuttering Head'; wage = '950'; sal = '25000'; }
                      else if (cat === 'tender_manager') { roleLabel = 'Tender Bidding & Contracts Manager'; wage = '3200'; sal = '80000'; }
                      else if (cat === 'business_owner') { roleLabel = 'Business Partner / Director'; wage = '8000'; sal = '200000'; }

                      setNewStaff({ 
                        ...newStaff, 
                        roleCategory: cat, 
                        role: roleLabel,
                        dailyWageRate: wage,
                        monthlySalary: sal,
                      });
                    }}
                    className="input-field"
                  >
                    <option value="project_manager">Senior Project Manager</option>
                    <option value="site_manager">Site Construction Manager</option>
                    <option value="site_engineer">Site Project Engineer</option>
                    <option value="site_supervisor">Site Operations Supervisor</option>
                    <option value="worker">Worker Staff / Skilled Labor</option>
                    <option value="tender_manager">Tender & Contracts Manager</option>
                    <option value="business_owner">Business Owner / Director</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Designation / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Tender & Project Assignment */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Assign to Tender / Project *
                </label>
                <select
                  value={newStaff.projectTender}
                  onChange={(e) => {
                    const tender = e.target.value;
                    let siteLoc = 'Sector 62 Metro Depot Site, Noida';
                    if (tender.includes('IOCL')) siteLoc = 'IOCL Panipat Refinery Complex';
                    else if (tender.includes('Expressway')) siteLoc = 'Gurugram Expressway Package 2';
                    setNewStaff({ ...newStaff, projectTender: tender, siteName: siteLoc });
                  }}
                  className="input-field"
                >
                  {availableProjects.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
                  Managers, supervisors & site staff will be bound to this tender execution.
                </span>
              </div>

              {/* Reporting Manager Assignment (Under which manager/supervisor) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Assign Under Reporting Manager or Site Supervisor *
                </label>
                <select
                  value={newStaff.reportingManagerName}
                  onChange={(e) => setNewStaff({ ...newStaff, reportingManagerName: e.target.value })}
                  className="input-field"
                >
                  {employees
                    .filter(e => e.roleCategory === 'project_manager' || e.roleCategory === 'site_manager' || e.roleCategory === 'site_supervisor' || e.roleCategory === 'business_owner')
                    .map((mgr) => (
                      <option key={mgr.id} value={`${mgr.name} (${mgr.role})`}>
                        {mgr.name} — {mgr.role} ({mgr.projectTender || mgr.siteName})
                      </option>
                    ))}
                </select>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
                  Workers and site staff report directly under this supervisor or project manager.
                </span>
              </div>

              {/* Site Location Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Site Location / Depot Yard *
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.siteName}
                  onChange={(e) => setNewStaff({ ...newStaff, siteName: e.target.value })}
                  placeholder="e.g. Sector 62 Metro Depot Site, Noida"
                  className="input-field"
                />
              </div>

              {/* Wage and Salary configuration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={newStaff.dailyWageRate}
                    onChange={(e) => setNewStaff({ ...newStaff, dailyWageRate: e.target.value })}
                    placeholder="950"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={newStaff.monthlySalary}
                    onChange={(e) => setNewStaff({ ...newStaff, monthlySalary: e.target.value })}
                    placeholder="35000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Overtime Rate (₹/h)</label>
                  <input
                    type="number"
                    value={newStaff.overtimeRate}
                    onChange={(e) => setNewStaff({ ...newStaff, overtimeRate: e.target.value })}
                    placeholder="150"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-whatsapp">
                  Generate Staff ID & Enroll
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* LOG WORKING HOURS MODAL */}
      {showHoursModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '26px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', fontWeight: 800 }}>Log Working Hours & Shift Duty</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Update staff working hours, overtime, and site notes. Calculates total daily wages for the Excel ledger.
            </p>

            <form onSubmit={handleLogHoursSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Select Employee *</label>
                <select
                  value={hoursForm.employeeName}
                  onChange={(e) => setHoursForm({ ...hoursForm, employeeName: e.target.value })}
                  className="input-field"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.name}>
                      {e.name} — {e.role} ({e.staffId})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Working Hours *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={hoursForm.workingHours}
                    onChange={(e) => setHoursForm({ ...hoursForm, workingHours: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Overtime Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={hoursForm.overtimeHours}
                    onChange={(e) => setHoursForm({ ...hoursForm, overtimeHours: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Work Done / Shift Notes</label>
                <input
                  type="text"
                  value={hoursForm.notes}
                  onChange={(e) => setHoursForm({ ...hoursForm, notes: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowHoursModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-whatsapp">Save & Update Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
