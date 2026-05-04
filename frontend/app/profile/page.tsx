'use client';

import { useEffect, useState } from 'react';
import { getSession, AuthSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';
import LanyardLoader from '@/components/3d/LanyardLoader';
import Link from 'next/link';
import { useCalendar } from '@/lib/calendar/useCalendar';
import { requestCalendarAccess } from '@/lib/auth/google';

// ─── Calendar Events Panel ────────────────────────────────────────────────────

function CalendarPanel() {
  const { events, loading, error, connected, refetch } = useCalendar();
  const [requesting, setRequesting] = useState(false);

  const handleConnect = () => {
    setRequesting(true);
    requestCalendarAccess(
      () => {
        setRequesting(false);
        refetch();
      },
      (msg) => {
        setRequesting(false);
        if (msg) alert(msg);
      }
    );
  };

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
    <div className="bg-dark/40 border border-white/5 p-3 relative overflow-hidden w-full flex flex-col flex-1 min-h-0">
      <span className="font-bold text-brand text-[8px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1">
        <span className="material-symbols-outlined text-[10px]">calendar_month</span>
        Google Calendar
        {connected && !loading && !error && (
          <span className="ml-auto text-white/40 normal-case tracking-normal font-normal">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
        )}
      </span>

      {!connected ? (
        <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
          <p className="text-white/40 text-[9px] uppercase tracking-wider mb-2">Connect to sync sessions</p>
          <button
            onClick={handleConnect}
            disabled={requesting}
            className="w-full py-2 px-3 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:text-black hover:border-brand transition-all flex items-center justify-center gap-2 group"
          >
            {requesting ? (
              <span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                CONNECT
                <span className="material-symbols-outlined text-[12px] group-hover:translate-x-1 transition-transform">api</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-2 mt-2">
              {[1, 2].map((i) => (
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
            <div className="text-center text-white/40 text-xs py-6 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-2xl opacity-40">event_busy</span>
              No upcoming events
            </div>
          )}

          {/* Events list */}
          {!loading && !error && events.length > 0 && (
            <div className="space-y-1.5 mt-1 overflow-y-auto pr-1 flex-1 min-h-0" style={{ scrollbarWidth: 'none' }}>
              {events.map((ev) => (
                <a
                  key={ev.id}
                  href={ev.htmlLink ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-dark/60 border border-white/5 hover:border-brand/30 hover:bg-brand/5 transition-all p-2 rounded group/ev"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-white text-[10px] font-semibold line-clamp-1 group-hover/ev:text-brand transition-colors">
                      {ev.summary || '(No title)'}
                    </span>
                    <span className="material-symbols-outlined text-[10px] text-white/40 group-hover/ev:text-brand shrink-0 transition-colors">
                      open_in_new
                    </span>
                  </div>
                  <p className="text-white/40 text-[9px] mt-0.5">{formatDate(ev.start)}</p>
                </a>
              ))}
            </div>
          )}
        </>
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
      <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 h-[100dvh] border-r border-white/5 relative flex flex-col pt-16 lg:pt-20 pb-4 px-4 sm:px-8 lg:px-10 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        {/* Subtle dot-grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 -z-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 w-full max-w-[420px] mx-auto lg:mx-0 flex flex-col h-full justify-between py-2">
          {/* Header */}
          <div className="mb-4 reveal-left shrink-0">
            <span className="inline-flex items-center gap-2 px-2 py-1 border border-brand/30 bg-brand/5 text-[0.5rem] font-bold tracking-[0.4em] text-brand uppercase mb-2">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse inline-block" />
              Active Session
            </span>
            <h1 className="font-black text-4xl lg:text-5xl xl:text-6xl uppercase leading-[0.85] tracking-tighter text-white mb-2 mt-1">
              USER<br /><span className="text-brand drop-shadow-[0_0_15px_rgba(0,102,255,0.4)]">PROFILE</span>
            </h1>
            <p className="text-white/60 text-xs leading-relaxed max-w-[280px]">
              Manage your digital identity via distributed session protocol.
            </p>
          </div>

          {/* Profile Data Box */}
          <div className="brutalist-card p-4 relative overflow-hidden group stagger-children active w-full flex-1 flex flex-col gap-3 min-h-0">
            {/* Avatar Row */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-3 shrink-0">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-brand/40 bg-dark overflow-hidden relative shadow-[0_0_20px_rgba(0, 102, 255,0.15)] shrink-0 group-hover:border-brand transition-colors animate-float-subtle">
                {session.profile?.picture ? (
                  <img src={session.profile.picture} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-brand/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-brand group-hover:scale-110 transition-transform">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg lg:text-xl font-black uppercase tracking-tighter leading-none mb-1 text-white line-clamp-1">
                  {session.profile?.name || 'Guest User'}
                </h2>
                <div className="text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Identity Confirmed</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-2 shrink-0">
              <div className="brutalist-card bg-dark/50 border-l-4 border-l-accent p-3 hover:bg-accent/10 transition-colors relative overflow-hidden group/item">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-accent text-[8px] tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[10px]">mail</span>
                  Registered Email
                </span>
                <p className="relative z-10 text-white text-xs truncate">{session.email || session.profile?.email || 'Not Provided'}</p>
              </div>

              <div className="brutalist-card bg-dark/50 border-l-4 border-l-brand p-3 hover:bg-brand/10 transition-colors relative overflow-hidden group/item">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-brand text-[8px] tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[10px]">shield_person</span>
                  Auth Vector
                </span>
                <p className="relative z-10 text-white text-xs capitalize flex items-center gap-1.5">
                   {session.type} Authentication
                </p>
              </div>
            </div>

            {/* Calendar Events */}
            <CalendarPanel />

            {/* Actions */}
            <div className="shrink-0 pt-1">
              <Link
                href="/"
                className="w-full glow-btn bg-brand text-black font-black uppercase tracking-[0.2em] text-[9px] py-3 px-4 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-center shadow-[0_0_30px_rgba(0, 102, 255,0.3)]"
              >
                RETURN TO DIRECTORY
                <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
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
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(0, 102, 255,0.05) 0%, transparent 60%)' }} />

        {/* 3D Canvas */}
        <div className="relative w-full h-full z-20">
          <LanyardLoader image={session.profile?.picture} />
        </div>

        {/* Technical Overlays */}
        <div className="absolute top-8 right-8 z-30 pointer-events-none flex flex-col items-end gap-2">
          <span className="font-bold text-white/50 text-[10px] uppercase tracking-[0.3em] border-b border-white/10 pb-1">Lanyard // Physics Env</span>
          <span className="font-bold text-white/30 text-[10px] uppercase tracking-[0.3em]">Load state: Complete</span>
        </div>
        
        <div className="absolute bottom-8 left-8 z-30 pointer-events-none flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-xl">
             <span className="material-symbols-outlined text-white/50 text-[14px]">360</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white/80 text-[10px] uppercase tracking-widest">Interactive Element</span>
            <span className="font-medium text-brand text-[9px] uppercase tracking-[0.2em] animate-pulse mt-0.5">Drag to rotate object</span>
          </div>
        </div>
      </div>

    </div>
  );
}
