'use client';

import { useState, useEffect } from 'react';
import { signInWithGoogle } from '@/lib/auth/google';
import { saveSession, AuthSession } from '@/lib/auth/types';
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
      (token) => {
        saveSession({ type: 'google', token });
        goto('/');
      },
      (msg) => { setError(msg); setLoading(false); }
    );
  };

  const handleGuest = () => {
    saveSession({ type: 'guest', token: 'guest' });
    goto('/');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    saveSession({ type: 'email', token: 'email', email });
    goto('/');
  };

  return (
    <div className="w-full max-w-sm relative my-8">
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-brand" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-brand" />

      <div className="mb-8">
        <p className="text-[0.6rem] font-bold tracking-[0.4em] text-white/30 uppercase mb-3">Connect Sphere</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-3">
          WELCOME<br /><span className="text-brand">BACK</span>
        </h1>
        <p className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-white/30">
          Enter your credentials to continue
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase">
            Email Address
          </label>
          <input type="email" id="email" name="email" required placeholder="you@company.com"
            className="bg-white/5 border border-white/10 focus:border-brand w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-brand/5 focus:shadow-[0_0_20px_rgba(255,95,31,0.15)]" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase">
              Password
            </label>
            <a href="#" className="text-[0.65rem] font-bold tracking-[0.1em] text-brand hover:text-white transition-colors uppercase">
              Forgot?
            </a>
          </div>
          <input type="password" id="password" name="password" required placeholder="••••••••"
            className="bg-white/5 border border-white/10 focus:border-brand w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-brand/5 focus:shadow-[0_0_20px_rgba(255,95,31,0.15)]" />
        </div>
        <button type="submit"
          className="mt-1 w-full py-4 px-8 text-sm font-black uppercase tracking-widest transition-all duration-300 bg-white text-black hover:bg-brand hover:text-white">
          Sign In
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-white/40 font-medium">
          New to Connect Sphere?{' '}
          <a href="#" className="text-brand font-bold uppercase tracking-widest ml-1 hover:text-white transition-colors border-b border-brand hover:border-white pb-0.5">
            Create Account
          </a>
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <p className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase text-center">Or continue with</p>
        <div className="grid grid-cols-2 gap-3">
          <GoogleButton onClick={handleGoogle} loading={loading} />
          <GuestButton onClick={handleGuest} />
        </div>
      </div>
    </div>
  );
}
