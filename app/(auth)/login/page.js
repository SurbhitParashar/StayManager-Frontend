'use client';

import { useState } from 'react';
import API from '@/services/api';

const baseInput = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  color: '#1A1A2E',
  background: '#FAFAF8',
  border: '1.5px solid #E8E6F0',
  borderRadius: '8px',
  padding: '10px 12px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#8B87A8',
  marginBottom: '5px',
  display: 'block',
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await API.post('/auth/login', form);
      window.location.href = '/dashboard';
    } catch {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...baseInput,
    borderColor: focused === field ? '#6C63FF' : '#E8E6F0',
    background: focused === field ? '#FAFAFF' : '#FAFAF8',
    boxShadow: focused === field ? '0 0 0 3px rgba(108,99,255,0.1)' : 'none',
  });

  const bind = (field) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(null),
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F6FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo + Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(108,99,255,0.3)',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2.5" y="4.5" width="13" height="11" rx="2" stroke="white" strokeWidth="1.4" />
                <path d="M6 4.5V3C6 2.17 6.67 1.5 7.5 1.5H10.5C11.33 1.5 12 2.17 12 3V4.5" stroke="white" strokeWidth="1.4" />
                <path d="M6 9H12M6 12H9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: '#1A1A2E',
            }}>
              StayManager
            </span>
          </div>

          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            color: '#1A1A2E',
            margin: '0 0 6px',
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '13px', color: '#9B97B8', margin: 0 }}>
            Sign in to manage your properties and bookings
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #ECEAF5',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(108,99,255,0.06)',
        }}>
          {/* Card Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F0EFF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #FAFAFF 0%, #F8F7FF 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '6px',
                background: '#EEF0FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="4.5" r="2.5" stroke="#6C63FF" strokeWidth="1.3" />
                  <path d="M1.5 11.5C1.5 9.567 3.767 8 6.5 8C9.233 8 11.5 9.567 11.5 11.5" stroke="#6C63FF" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '700',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#6C63FF',
              }}>
                Account Access
              </span>
            </div>
            <span style={{
              background: '#EEF0FF',
              color: '#6C63FF',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #C4BFFF',
            }}>
              Secure Login
            </span>
          </div>

          {/* Form Body */}
          <div style={{ padding: '26px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  style={inputStyle('email')}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  {...bind('email')}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Password</label>
                  <a href="#" style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6C63FF',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                    onMouseEnter={e => e.target.style.opacity = '0.7'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  style={inputStyle('password')}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  {...bind('password')}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#F0EFF8', marginBottom: '20px' }} />

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: '600',
                padding: '11px 22px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? '#C4BFFF'
                  : 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
                border: 'none',
                color: '#fff',
                width: '100%',
                transition: 'opacity 0.15s, transform 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(108,99,255,0.35)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <path d="M6.5 1.5A5 5 0 0 1 11.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M5 2.5H3C2.17 2.5 1.5 3.17 1.5 4V10C1.5 10.83 2.17 11.5 3 11.5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8.5 9.5L11.5 6.5L8.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.5 6.5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Sign in
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#9B97B8',
          marginTop: '20px',
        }}>
          Don&apos;t have an account?{' '}
          <a href="#" style={{
            color: '#6C63FF',
            fontWeight: '600',
            textDecoration: 'none',
          }}
            onMouseEnter={e => e.target.style.opacity = '0.7'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Contact admin
          </a>
        </p>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}