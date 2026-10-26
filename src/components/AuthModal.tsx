'use client';

import React, { useState } from 'react';
import { ShieldCheck, Phone, KeyRound, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentCode, setSentCode] = useState('');

  if (!isOpen) return null;

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

      setSentCode(data.demoOtp || '482910');
      setStep('otp');
      // Auto-prefill for testing convenience
      setOtp(data.demoOtp || '482910');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
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

      onLoginSuccess(phone);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '32px',
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(99, 102, 241, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-glow)',
          }}>
            <ShieldCheck size={30} color="var(--brand-whatsapp)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Client Secure Login</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Access and manage your AI Agents, IndiaMart sync, and WhatsApp operations
          </p>
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

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Business Registered Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                We will send a one-time verification passcode (OTP) via SMS and WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-whatsapp"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? 'Sending OTP...' : 'Get Verification Code'}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              background: 'rgba(37, 211, 102, 0.08)',
              border: '1px solid rgba(37, 211, 102, 0.2)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '0.85rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-whatsapp)', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>Code sent to {phone}</span>
              </div>
              {sentCode && (
                <div style={{ marginTop: '6px', color: 'var(--text-main)', fontSize: '0.8rem' }}>
                  🔑 Demo Auto-Code: <strong style={{ color: 'var(--brand-whatsapp)', fontSize: '0.95rem' }}>{sentCode}</strong> (or enter 123456)
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Enter 6-Digit OTP
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP code"
                  className="input-field"
                  style={{ paddingLeft: '44px', letterSpacing: '4px', fontSize: '1.2rem', fontWeight: 700 }}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                {loading ? 'Verifying...' : 'Verify & Enter Portal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
