import LanyardLoader from '@/components/LanyardLoader';

export default function SignInPage() {
  return (
    <div className="fixed inset-0 flex" style={{ top: '56px' }}>

      {/* ── Left: Sign-in form panel ─────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-center w-full md:w-[440px] shrink-0 px-8 overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(20,20,20,0.85) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Subtle glow accents */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,95,31,0.12) 0%, transparent 70%)' }} />
        <div className="absolute -top-20 right-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.1) 0%, transparent 70%)' }} />

        <div className="w-full max-w-sm relative my-8">
          {/* Corner brackets */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-orange-500" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-orange-500" />

          {/* Header */}
          <div className="mb-8">
            <p className="text-[0.6rem] font-bold tracking-[0.4em] text-white/30 uppercase mb-3">Connect Sphere</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-3">
              WELCOME<br /><span className="text-orange-500">BACK</span>
            </h1>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-white/30">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" action="/">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase">
                Email Address
              </label>
              <input
                type="email" id="email" required placeholder="you@company.com"
                className="bg-white/5 border border-white/10 focus:border-orange-500 w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-orange-500/5 focus:shadow-[0_0_20px_rgba(255,95,31,0.15)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase">
                  Password
                </label>
                <a href="#" className="text-[0.65rem] font-bold tracking-[0.1em] text-orange-500 hover:text-white transition-colors uppercase">
                  Forgot?
                </a>
              </div>
              <input
                type="password" id="password" required placeholder="••••••••"
                className="bg-white/5 border border-white/10 focus:border-orange-500 w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-orange-500/5 focus:shadow-[0_0_20px_rgba(255,95,31,0.15)]"
              />
            </div>
            <button
              type="submit"
              className="mt-1 w-full py-4 px-8 text-sm font-black uppercase tracking-widest transition-all duration-300 bg-white text-black hover:bg-orange-500 hover:text-white"
            >
              Sign In
            </button>
          </form>

          {/* Divider + create account */}
          <div className="mt-6 pt-6 border-t border-white/8 text-center">
            <p className="text-xs text-white/40 font-medium">
              New to Connect Sphere?{' '}
              <a href="#" className="text-orange-500 font-bold uppercase tracking-widest ml-1 hover:text-white transition-colors border-b border-orange-500 hover:border-white pb-0.5">
                Create Account
              </a>
            </p>
          </div>

          {/* Social buttons */}
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase text-center">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="border border-white/10 hover:border-white/30 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">Google</span>
              </button>
              <button type="button" className="border border-white/10 hover:border-white/30 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined text-[1rem]">person</span>
                <span className="text-xs font-bold uppercase tracking-widest">Guest</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Lanyard 3D (fills remaining space) ────────────────── */}
      <div className="hidden md:block flex-1 relative" style={{ background: '#080810' }}>
        <LanyardLoader />
      </div>

    </div>
  );
}
