'use client';

import { useEffect, useState } from 'react';
import { getSession, AuthSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';
import LanyardLoader from '@/components/LanyardLoader';
import Link from 'next/link';
import { useCalendar } from '@/lib/calendar/useCalendar';

// ─── Calendar Events Panel ────────────────────────────────────────────────────

function CalendarPanel() {
  const { events, loading, error } = useCalendar();

  const formatDate = (dt: { dateTime?: string; date?: string }) => {
    const raw = dt.dateTime ?? dt.date;
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: dt.dateTime ? '2-digit' : undefined,
      minute: dt.dateTime ? '2-digit' : undefined,
    });
  };

  return (
    <div className="brutalist-card p-5 lg:p-6 relative overflow-hidden w-full mt-4">
      <span className="font-bold text-brand text-[9px] tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[12px]">calendar_month</span>
        Upcoming Events
        {!loading && !error && (
          <span className="ml-auto text-[#71717a] normal-case tracking-normal font-normal">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
        )}
      </span>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex items-start gap-2 text-red-400 text-xs mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded">
          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center text-[#71717a] text-xs py-6 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-2xl opacity-40">event_busy</span>
          No upcoming events
        </div>
      )}

      {/* Events list */}
      {!loading && !error && events.length > 0 && (
        <div className="space-y-2 mt-2 max-h-[180px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
          {events.map((ev) => (
            <a
              key={ev.id}
              href={ev.htmlLink ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-dark/60 border border-white/5 hover:border-brand/30 hover:bg-brand/5 transition-all p-3 rounded group/ev"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-white text-xs font-semibold line-clamp-1 group-hover/ev:text-brand transition-colors">
                  {ev.summary || '(No title)'}
                </span>
                <span className="material-symbols-outlined text-[11px] text-[#71717a] group-hover/ev:text-brand shrink-0 transition-colors">
                  open_in_new
                </span>
              </div>
              <p className="text-[#71717a] text-[10px] mt-1">{formatDate(ev.start)}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}


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
    <div className="fixed inset-0 flex overflow-hidden bg-dark page-enter">
      
      {/* ── Left: Profile Control Panel ─────────────────── */}
      <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 h-full border-r border-white/5 relative flex flex-col pt-16 lg:pt-20 pb-6 px-6 sm:px-10 lg:px-12 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Subtle dot-grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 w-full max-w-[400px] mx-auto lg:mx-0 flex flex-col h-full justify-center">
          {/* Header */}
          <div className="mb-6 reveal-left shrink-0">
            <span className="inline-flex items-center gap-2 px-2.5 py-1.5 border border-brand/30 bg-brand/5 text-[0.55rem] font-bold tracking-[0.4em] text-brand uppercase mb-3 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Active Session
            </span>
            <h1 className="font-black text-5xl lg:text-6xl xl:text-7xl uppercase leading-[0.85] tracking-tighter text-white mb-2">
              USER<br /><span className="text-brand">PROFILE</span>
            </h1>
            <p className="text-[#a1a1aa] text-sm leading-relaxed hidden sm:block max-w-[300px]">
              Manage your digital identity via distributed session protocol.
            </p>
          </div>

          {/* Profile Data Box */}
          <div className="brutalist-card p-5 lg:p-6 relative overflow-hidden group stagger-children active w-full flex-1 max-h-[460px] flex flex-col">
            {/* Avatar Row */}
            <div className="flex items-center gap-5 mb-5 border-b border-white/10 pb-5 shrink-0">
              <div className="w-16 h-16 rounded-full border border-brand/40 bg-dark overflow-hidden relative shadow-[0_0_20px_rgba(255,95,31,0.15)] shrink-0 group-hover:border-brand transition-colors animate-float-subtle">
                {session.profile?.picture ? (
                  <img src={session.profile.picture} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-brand/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-brand group-hover:scale-110 transition-transform">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tighter leading-none mb-1 text-white line-clamp-2">
                  {session.profile?.name || 'Guest User'}
                </h2>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase">Identity Confirmed</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3 mb-6 flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="brutalist-card bg-dark/50 border-l-4 border-l-accent p-4 hover:bg-accent/10 transition-colors relative overflow-hidden group/item">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-accent text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[12px]">mail</span>
                  Registered Email
                </span>
                <p className="relative z-10 text-white text-sm truncate">{session.email || session.profile?.email || 'Not Provided'}</p>
              </div>

              <div className="brutalist-card bg-dark/50 border-l-4 border-l-brand p-4 hover:bg-brand/10 transition-colors relative overflow-hidden group/item">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-brand text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[12px]">shield_person</span>
                  Auth Vector
                </span>
                <p className="relative z-10 text-white text-sm capitalize flex items-center gap-2">
                   {session.type} Authentication
                </p>
              </div>
            </div>

            {/* Calendar Events */}
            <CalendarPanel />

            {/* Actions */}
            <div className="shrink-0 mt-4 pt-2">
              <Link
                href="/"
                className="w-full glow-btn bg-brand text-black font-black uppercase tracking-[0.2em] text-[10px] py-4 px-6 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-center shadow-[0_0_30px_rgba(255,95,31,0.3)]"
              >
                RETURN TO DIRECTORY
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Environmental Lanyard ────────────────── */}
      <div className="hidden lg:block flex-1 h-full relative overflow-hidden bg-dark">
        {/* Subtle grid and glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-80" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,102,255,0.08) 0%, transparent 80%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,95,31,0.05) 0%, transparent 60%)' }} />

        {/* 3D Canvas */}
        <div className="relative w-full h-full z-20">
          <LanyardLoader image={session.profile?.picture} />
        </div>

        {/* Technical Overlays */}
        <div className="absolute top-8 right-8 z-30 pointer-events-none flex flex-col items-end gap-2">
          <span className="font-bold text-[#a1a1aa] text-[10px] uppercase tracking-[0.3em] border-b border-white/10 pb-1">Lanyard // Physics Env</span>
          <span className="font-bold text-[#71717a] text-[10px] uppercase tracking-[0.3em]">Load state: Complete</span>
        </div>
        
        <div className="absolute bottom-8 left-8 z-30 pointer-events-none flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-xl">
             <span className="material-symbols-outlined text-white/50 text-[14px]">360</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#d4d4d8] text-[10px] uppercase tracking-widest">Interactive Element</span>
            <span className="font-medium text-brand text-[9px] uppercase tracking-[0.2em] animate-pulse mt-0.5">Drag to rotate object</span>
          </div>
        </div>
      </div>

    </div>
  );
}
