'use client';

import { useState, useEffect } from 'react';
import { signInWithGoogle } from '@/lib/auth/google';
import { saveSession } from '@/lib/auth/types';
import { goto } from '@/lib/auth/config';
import GoogleButton from './GoogleButton';
import GuestButton from './GuestButton';

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
    <div className="w-full max-w-sm relative my-8">
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-brand" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-brand" />

      <div className="mb-10">
        <p className="text-[0.6rem] font-bold tracking-[0.4em] text-white/30 uppercase mb-3">Connect Sphere</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-3">
          WELCOME<br /><span className="text-brand">BACK</span>
        </h1>
        <p className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-white/30">
          Choose how you want to continue
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <p className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase text-center">Sign in with</p>
        <div className="grid grid-cols-2 gap-3">
          <GoogleButton onClick={handleGoogle} loading={loading} />
          <GuestButton onClick={handleGuest} />
        </div>
      </div>
    </div>
  );
}
