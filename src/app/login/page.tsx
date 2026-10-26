'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Bot, 
  Phone, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  User,
  HardHat,
  Building2
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'staff' ? 'staff' : 'phone';

  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'staff'>(initialTab);
  
  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Staff Credentials state
  const [staffId, setStaffId] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setOtpSent(true);
      setOtp(data.demoOtp || '482910');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      if (typeof window !== 'undefined') {
        const userObj = {
          phone,
          role: 'business_owner',
          businessId: data.user?.businessId || 'biz_apex_industries',
          token: data.user?.token || `session_${Date.now()}`,
          isLoggedIn: true,
        };
        localStorage.setItem('bizzup_user', JSON.stringify(userObj));
        document.cookie = `bizzup_session=${userObj.token}; Path=/; Max-Age=2592000; SameSite=Lax`;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);

    if (typeof window !== 'undefined') {
      const userObj = {
        email,
        phone: '+91 98765 43210',
        role: 'business_owner',
        businessId: 'biz_apex_industries',
        token: `session_${Date.now()}`,
        isLoggedIn: true,
      };
      localStorage.setItem('bizzup_user', JSON.stringify(userObj));
      document.cookie = `bizzup_session=${userObj.token}; Path=/; Max-Age=2592000; SameSite=Lax`;
    }

    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, password: staffPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid Staff ID or Password');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('bizzup_staff_session', JSON.stringify(data.staff));
        document.cookie = `bizzup_staff=${data.staff.staffId}; Path=/; Max-Age=2592000; SameSite=Lax`;
      }
      router.push('/staff');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vibe-bg-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Header */}
      <header style={{
        padding: '18px 32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #25d366 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <span className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            Bizz<span style={{ color: 'var(--brand-whatsapp)' }}>Up</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/onboard" className="btn btn-whatsapp" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
            Onboard Business
          </Link>
        </div>
      </header>

      {/* Login Card */}
      <div style={{ maxWidth: '480px', width: '100%', margin: '48px auto', padding: '0 20px', flex: 1, position: 'relative', zIndex: 1 }}>
        <div className="vibe-card" style={{ padding: '36px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 14px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(99, 102, 241, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-glow)',
            }}>
              <ShieldCheck size={28} color="var(--brand-whatsapp)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
              {authMethod === 'staff' ? 'Staff & Manager Portal' : 'Client Business Login'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {authMethod === 'staff'
                ? 'Enter your Staff ID & Password to access the reporting chatbot'
                : 'Manage your AI Agent fleet, WhatsApp logs & calling studio'}
            </p>
          </div>

          {/* Toggle Tabs: Phone vs Email vs Staff ID */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '4px', marginBottom: '24px', gap: '4px' }}>
            <button
              onClick={() => { setAuthMethod('phone'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 4px',
                border: 'none',
                borderRadius: '6px',
                background: authMethod === 'phone' ? 'var(--brand-whatsapp)' : 'transparent',
                color: authMethod === 'phone' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Phone size={13} />
              Owner Phone
            </button>

            <button
              onClick={() => { setAuthMethod('email'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 4px',
                border: 'none',
                borderRadius: '6px',
                background: authMethod === 'email' ? 'var(--brand-primary)' : 'transparent',
                color: authMethod === 'email' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Mail size={13} />
              Owner Email
            </button>

            <button
              onClick={() => { setAuthMethod('staff'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 4px',
                border: 'none',
                borderRadius: '6px',
                background: authMethod === 'staff' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                color: authMethod === 'staff' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <HardHat size={13} />
              Staff Login
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '18px',
            }}>
              {error}
            </div>
          )}

          {/* METHOD 1: Mobile Phone & OTP */}
          {authMethod === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Registered Mobile Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="input-field"
                        style={{ paddingLeft: '42px' }}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-whatsapp" style={{ width: '100%', padding: '12px' }}>
                    {loading ? 'Sending OTP...' : 'Send OTP to WhatsApp & SMS'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhone}>
                  <div style={{
                    background: 'rgba(37, 211, 102, 0.08)',
                    border: '1px solid rgba(37, 211, 102, 0.25)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '18px',
                    fontSize: '0.82rem',
                  }}>
                    <div style={{ color: 'var(--brand-whatsapp)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} />
                      OTP Sent to {phone}
                    </div>
                    <div style={{ marginTop: '4px', color: 'var(--text-dim)' }}>
                      🔑 Demo Passcode: <strong style={{ color: 'var(--brand-whatsapp)' }}>{otp}</strong>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-field"
                      style={{ letterSpacing: '4px', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    {loading ? 'Verifying...' : 'Verify OTP & Enter Dashboard'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD 2: Email & Passcode */}
          {authMethod === 'email' && (
            <form onSubmit={handleLoginEmail}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operations@company.in"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Account Password / Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                {loading ? 'Authenticating...' : 'Sign In to Operations Dashboard'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* METHOD 3: Staff & Manager Login */}
          {authMethod === 'staff' && (
            <form onSubmit={handleStaffLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Unique Staff ID (Issued by Business Owner)
                </label>
                <div style={{ position: 'relative' }}>
                  <HardHat size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="text"
                    required
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="e.g. EMP-NOIDA-401 or TNDR-MGR-102"
                    className="input-field"
                    style={{ paddingLeft: '42px', fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Auto-Generated Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="text"
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="e.g. pass_7721"
                    className="input-field"
                    style={{ paddingLeft: '42px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* 1-Click Demo Profiles */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Quick Demo Credentials:
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => { setStaffId('EMP-NOIDA-401'); setStaffPassword('pass_7721'); }}
                    style={{
                      fontSize: '0.72rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(37, 211, 102, 0.1)',
                      border: '1px solid rgba(37, 211, 102, 0.3)',
                      color: 'var(--brand-whatsapp)',
                      cursor: 'pointer',
                    }}
                  >
                    👷 Site Eng (Noida)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStaffId('TNDR-MGR-102'); setStaffPassword('pass_9942'); }}
                    style={{
                      fontSize: '0.72rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: 'var(--brand-primary-light)',
                      cursor: 'pointer',
                    }}
                  >
                    📑 Tender Mgr (Ananya)
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-premium" style={{ width: '100%', padding: '12px' }}>
                {loading ? 'Authenticating Staff...' : 'Login to Staff Chatbot Portal'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Bottom Onboarding Prompt */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Need to register a new company?{' '}
            <Link href="/onboard" style={{ color: 'var(--brand-whatsapp)', fontWeight: 600, textDecoration: 'none' }}>
              Onboard Your Business Now
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
