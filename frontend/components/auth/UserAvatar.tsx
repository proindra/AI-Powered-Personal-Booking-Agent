'use client';

import { useEffect, useRef, useState } from 'react';
import { getSession, clearSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';
import Link from 'next/link';

export default function UserAvatar() {
  const [profile, setProfile] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getSession();
    if (session?.profile) setProfile(session.profile);
    else if (session?.type === 'guest') setProfile({ name: 'Guest', email: '', picture: '' });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!profile) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        {profile.picture ? (
          <img
            src={profile.picture}
            alt={profile.name}
            className="w-8 h-8 rounded-full border border-white/20 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full border border-white/20 bg-brand/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-brand">person</span>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-56 bg-[#111] border border-white/10 shadow-xl z-50 p-1">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-bold text-white truncate">{profile.name}</p>
            {profile.email && (
              <p className="text-[0.65rem] text-white/40 truncate mt-0.5">{profile.email}</p>
            )}
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 border-b border-white/10"
          >
            <span className="material-symbols-outlined text-sm">person</span>
            View Profile
          </Link>
          <button
            onClick={() => { clearSession(); goto('/signin'); }}
            className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
