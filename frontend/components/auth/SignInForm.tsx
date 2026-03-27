'use client';

import { useState, useEffect } from 'react';
import { signInWithGoogle } from '@/lib/auth/google';
import { saveSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';

export default function SignInForm() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleGoogle = () => {
    setError('');
    setLoading(true);
    signInWithGoogle(
      (token, profile) => {
        saveSession({ type: 'google', token, email: profile.email, profile });
        goto('/');
      },
      (msg) => { setError(msg); setLoading(false); }
    );
  };

  const handleGuest = () => {
    saveSession({ type: 'guest', token: 'guest' });
    goto('/');
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(24px)',
      padding: '2.5rem',
      position: 'relative',
    }}>
      {/* Corner accents */}
      <span style={{ position:'absolute', top:-1, left:-1, width:20, height:20, borderTop:'2px solid #0066FF', borderLeft:'2px solid #0066FF' }} />
      <span style={{ position:'absolute', top:-1, right:-1, width:20, height:20, borderTop:'2px solid #0066FF', borderRight:'2px solid #0066FF' }} />
      <span style={{ position:'absolute', bottom:-1, left:-1, width:20, height:20, borderBottom:'2px solid #0066FF', borderLeft:'2px solid #0066FF' }} />
      <span style={{ position:'absolute', bottom:-1, right:-1, width:20, height:20, borderBottom:'2px solid #0066FF', borderRight:'2px solid #0066FF' }} />

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.4em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:'0.75rem' }}>
          Sign in to continue
        </p>
        <h1 style={{ fontSize:'2.5rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.04em', lineHeight:1, marginBottom:'0.5rem' }}>
          WELCOME<br />
          <span style={{ background:'linear-gradient(135deg,#0066FF,#FF9A5C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            BACK
          </span>
        </h1>
        <p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.3)', fontWeight:500 }}>
          No account needed — just pick how to sign in
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom:'1.25rem', padding:'0.75rem 1rem', border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#F87171', fontSize:'0.75rem', fontWeight:500 }}>
          {error}
        </div>
      )}

      {/* Divider label */}
      <p style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.35em', color:'rgba(255,255,255,0.18)', textTransform:'uppercase', marginBottom:'1rem', textAlign:'center' }}>
        Choose your entry
      </p>

      {/* Google Button — primary */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          padding: '1rem 1.25rem',
          marginBottom: '0.75rem',
          background: loading ? 'rgba(0, 102, 255,0.08)' : 'rgba(0, 102, 255,0.06)',
          border: '1px solid rgba(0, 102, 255,0.25)',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s',
          opacity: loading ? 0.7 : 1,
          textAlign: 'left',
        }}
        onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background = 'rgba(0, 102, 255,0.14)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 102, 255,0.6)'; } }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0, 102, 255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 102, 255,0.25)'; }}
      >
        {/* Icon */}
        <span style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.05)', flexShrink:0 }}>
          {loading ? (
            <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
        </span>
        <span style={{ flex:1 }}>
          <span style={{ display:'block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'rgba(255,255,255,0.5)', marginBottom:'0.1rem' }}>Recommended</span>
          <span style={{ fontSize:'0.85rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em' }}>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </span>
        </span>
        <span style={{ fontSize:'1rem', color:'rgba(0, 102, 255,0.6)' }}>→</span>
      </button>

      {/* Guest Button — secondary */}
      <button
        onClick={handleGuest}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          padding: '1rem 1.25rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.25s',
          textAlign: 'left',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
      >
        <span style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.04)', flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </span>
        <span style={{ flex:1 }}>
          <span style={{ display:'block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)', marginBottom:'0.1rem' }}>No account needed</span>
          <span style={{ fontSize:'0.85rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.7)' }}>Browse as Guest</span>
        </span>
        <span style={{ fontSize:'1rem', color:'rgba(255,255,255,0.2)' }}>→</span>
      </button>

      {/* Footer note */}
      <p style={{ marginTop:'1.5rem', fontSize:'0.6rem', color:'rgba(255,255,255,0.18)', textAlign:'center', lineHeight:1.6 }}>
        By signing in you agree to our Terms & Privacy Policy
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

