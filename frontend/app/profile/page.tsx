'use client';

import { useEffect, useState } from 'react';
import { getSession, AuthSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';
import LanyardLoader from '@/components/LanyardLoader';

export default function ProfilePage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sessionData = getSession();
    if (!sessionData) {
      goto('/signin');
    } else {
      setSession(sessionData);
    }
  }, []);

  if (!mounted || !session) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden pt-24 pb-16">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] lg:w-[60vw] h-[60vh] bg-brand/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Two-column layout container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 relative z-10">
        
        {/* Left: Profile Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          padding: '3rem 2.5rem',
          position: 'relative',
          width: '100%',
          maxWidth: '28rem',
        }}>
          {/* Corner accents */}
          <span style={{ position:'absolute', top:-1, left:-1, width:20, height:20, borderTop:'2px solid #FF5F1F', borderLeft:'2px solid #FF5F1F' }} />
          <span style={{ position:'absolute', top:-1, right:-1, width:20, height:20, borderTop:'2px solid #FF5F1F', borderRight:'2px solid #FF5F1F' }} />
          <span style={{ position:'absolute', bottom:-1, left:-1, width:20, height:20, borderBottom:'2px solid #FF5F1F', borderLeft:'2px solid #FF5F1F' }} />
          <span style={{ position:'absolute', bottom:-1, right:-1, width:20, height:20, borderBottom:'2px solid #FF5F1F', borderRight:'2px solid #FF5F1F' }} />

          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full border border-brand/40 mb-6 overflow-hidden relative shadow-[0_0_30px_rgba(255,95,31,0.2)]">
              {session.profile?.picture ? (
                <img src={session.profile.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-brand/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-brand">person</span>
                </div>
              )}
            </div>
            <p style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.4em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:'0.75rem' }}>
              User Profile
            </p>
            <h1 style={{ fontSize:'2rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.04em', lineHeight:1, marginBottom:'0.5rem', textAlign:'center' }}>
              <span style={{ background:'linear-gradient(135deg,#FF5F1F,#FF9A5C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {session.profile?.name || 'Guest User'}
              </span>
            </h1>
          </div>

          {/* Details List */}
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest text-white/40 uppercase mb-2">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                Email Address
              </label>
              <div className="w-full bg-[#0a0a0a]/50 border border-white/5 p-4 text-sm text-white/90 truncate rounded-sm">
                {session.email || session.profile?.email || 'Not Provided'}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest text-white/40 uppercase mb-2">
                <span className="material-symbols-outlined text-[14px]">shield_person</span>
                Authentication Layer
              </label>
              <div className="w-full bg-[#0a0a0a]/50 border border-white/5 p-4 text-sm text-white/90 capitalize flex items-center gap-2 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_rgba(255,95,31,0.5)]"></span>
                {session.type} Auth
              </div>
            </div>
          </div>

          {/* Return Home Button */}
          <button
            onClick={() => goto('/')}
            className="mt-10 w-full block text-center bg-transparent border border-brand/30 px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 group"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Right: 3D Lanyard */}
        <div className="w-full max-w-[400px] h-[550px] lg:h-[650px] shrink-0 relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.01]">
          {/* Subtle backdrop gradient for depth */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,102,255,0.06) 0%, transparent 70%)' }} />
          <LanyardLoader />
        </div>

      </div>
    </main>
  );
}
