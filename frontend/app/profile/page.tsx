'use client';

import { useEffect, useState } from 'react';
import { getSession, AuthSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';
import LanyardLoader from '@/components/LanyardLoader';
import Link from 'next/link';

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
      
      // Trigger reveal animations on mount
      setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
          el.classList.add('active');
        });
      }, 50);
    }
  }, []);

  if (!mounted || !session) return null;

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#050505] page-enter">
      
      {/* ── Left: Profile Control Panel ─────────────────── */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 h-full border-r border-white/5 relative flex flex-col justify-center px-8 sm:px-12 lg:px-16 pt-20 pb-8 overflow-y-auto">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
        {/* Subtle dot-grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 w-full max-w-[460px] mx-auto lg:mx-0">
          {/* Header */}
          <div className="mb-12 reveal-left">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand/30 bg-brand/5 text-[0.6rem] font-bold tracking-[0.4em] text-brand uppercase mb-6 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Active Session
            </span>
            <h1 className="font-black text-6xl lg:text-7xl xl:text-8xl uppercase leading-[0.85] tracking-tighter text-white mb-6">
              USER<br /><span className="text-brand">PROFILE</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed font-medium hidden sm:block">
              Manage your digital identity, view your authentication layer securely logged via our distributed session protocol.
            </p>
          </div>

          {/* Profile Data Box */}
          <div className="brutalist-card p-8 lg:p-10 relative overflow-hidden group stagger-children active w-full">
            {/* Avatar Row */}
            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
              <div className="w-20 h-20 rounded-full border border-brand/40 bg-black overflow-hidden relative shadow-[0_0_30px_rgba(255,95,31,0.15)] shrink-0 group-hover:border-brand transition-colors">
                {session.profile?.picture ? (
                  <img src={session.profile.picture} alt="Profile" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-brand/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-brand group-hover:scale-110 transition-transform">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-2 text-white truncate">
                  {session.profile?.name || 'Guest User'}
                </h2>
                <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Identity Confirmed</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="bg-dark/50 border border-white/5 p-5 hover:border-white/20 transition-colors relative overflow-hidden group/item">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-accent text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[12px]">mail</span>
                  Registered Email
                </span>
                <p className="relative z-10 text-white text-sm lg:text-base truncate font-medium">{session.email || session.profile?.email || 'Not Provided'}</p>
              </div>

              <div className="bg-dark/50 border border-white/5 p-5 hover:border-brand/30 transition-colors relative overflow-hidden group/item">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-brand text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[12px]">shield_person</span>
                  Auth Vector
                </span>
                <p className="relative z-10 text-white text-sm lg:text-base capitalize font-medium flex items-center gap-2">
                   {session.type} Authentication
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="w-full glow-btn bg-transparent border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] py-4 px-6 hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-center"
            >
              RETURN TO DIRECTORY
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right: Environmental Lanyard ────────────────── */}
      <div className="hidden lg:block flex-1 h-full relative overflow-hidden bg-[#020202]">
        {/* Subtle grid and glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-80" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,102,255,0.08) 0%, transparent 80%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,95,31,0.05) 0%, transparent 60%)' }} />

        {/* 3D Canvas */}
        <div className="relative w-full h-full z-20">
          <LanyardLoader />
        </div>

        {/* Technical Overlays */}
        <div className="absolute top-8 right-8 z-30 pointer-events-none flex flex-col items-end gap-2">
          <span className="font-bold text-white/20 text-[9px] uppercase tracking-[0.3em] border-b border-white/10 pb-1">Lanyard // Physics Env</span>
          <span className="font-bold text-white/10 text-[9px] uppercase tracking-[0.3em]">Load state: Complete</span>
        </div>
        
        <div className="absolute bottom-8 left-8 z-30 pointer-events-none flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-xl">
             <span className="material-symbols-outlined text-white/50 text-[16px]">360</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white/70 text-[10px] uppercase tracking-widest">Interactive Element</span>
            <span className="font-medium text-brand text-[9px] uppercase tracking-[0.2em] animate-pulse mt-0.5">Drag to rotate object</span>
          </div>
        </div>
      </div>

    </div>
  );
}
