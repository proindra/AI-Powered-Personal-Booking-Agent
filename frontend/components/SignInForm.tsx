'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

// Static export safe navigation
const goto = (path: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  window.location.href = base + path;
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem('auth_token', tokenResponse.access_token);
      localStorage.setItem('auth_type', 'google');
      goto('/');
    },
    onError: () => {
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    },
    onNonOAuthError: () => {
      setError('Popup was closed. Please try again.');
      setLoading(false);
    },
  });

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not configured.');
      return;
    }
    setError('');
    setLoading(true);
    googleLogin();
  };

  const handleGuestClick = () => {
    localStorage.setItem('auth_type', 'guest');
    localStorage.setItem('auth_token', 'guest');
    goto('/');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    localStorage.setItem('auth_type', 'email');
    localStorage.setItem('auth_email', email);
    goto('/');
  };

  return (
    <div className="w-full max-w-sm relative my-8">
      {/* Corner brackets */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-brand" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-brand" />

      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.6rem] font-bold tracking-[0.4em] text-white/30 uppercase mb-3">Connect Sphere</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-3">
          WELCOME<br /><span className="text-brand">BACK</span>
        </h1>
        <p className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-white/30">
          Enter your credentials to continue
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Email/Password form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase">
            Email Address
          </label>
          <input
            type="email" id="email" name="email" required placeholder="you@company.com"
            className="bg-white/5 border border-white/10 focus:border-brand w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-brand/5 focus:shadow-[0_0_20px_rgba(255,95,31,0.15)]"
          />
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
          <input
            type="password" id="password" name="password" required placeholder="••••••••"
            className="bg-white/5 border border-white/10 focus:border-brand w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-brand/5 focus:shadow-[0_0_20px_rgba(255,95,31,0.15)]"
          />
        </div>
        <button
          type="submit"
          className="mt-1 w-full py-4 px-8 text-sm font-black uppercase tracking-widest transition-all duration-300 bg-white text-black hover:bg-brand hover:text-white"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-white/40 font-medium">
          New to Connect Sphere?{' '}
          <a href="#" className="text-brand font-bold uppercase tracking-widest ml-1 hover:text-white transition-colors border-b border-brand hover:border-white pb-0.5">
            Create Account
          </a>
        </p>
      </div>

      {/* Social auth */}
      <div className="mt-5 flex flex-col gap-3">
        <p className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase text-center">Or continue with</p>
        <div className="grid grid-cols-2 gap-3">

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="border border-white/10 hover:border-white/30 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="text-xs font-bold uppercase tracking-widest">Google</span>
          </button>

          {/* Guest */}
          <button
            type="button"
            onClick={handleGuestClick}
            className="border border-white/10 hover:border-white/30 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[1rem]">person</span>
            <span className="text-xs font-bold uppercase tracking-widest">Guest</span>
          </button>

        </div>
      </div>
    </div>
  );
}
