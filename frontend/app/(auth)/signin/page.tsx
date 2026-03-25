export default function SignInPage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex pt-14">

      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 border-r border-white/5 relative overflow-hidden bg-dark/40 backdrop-blur-sm">
        {/* Ambient glow */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Center copy */}
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase mb-6">Welcome Back</p>
          <h2 className="text-6xl xl:text-8xl font-black uppercase leading-none tracking-tighter mb-8">
            YOUR<br />GLOBAL<br /><span className="text-brand">STAGE</span><br />AWAITS
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Connect with world-class speakers, attend live events, and grow your network — all in one place.
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-white/20">
          Team Net-Y @ 2026
        </p>
      </div>

      {/* Right — Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 relative overflow-hidden bg-dark/20 backdrop-blur-sm">
        <div className="w-full max-w-sm">
          {/* Corner accents */}
          <div className="relative brutalist-card p-10 bg-white/2 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand" />

            <div className="mb-8">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">
                WELCOME<br /><span className="text-brand">BACK</span>
              </h1>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-white/30">
                Enter your credentials to continue
              </p>
            </div>

            <form className="flex flex-col gap-5" action="/">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="you@company.com"
                  className="bg-white/3 border border-white/10 focus:border-brand w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-brand/5 focus:shadow-[0_0_15px_rgba(255,95,31,0.2)]"
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
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  className="bg-white/3 border border-white/10 focus:border-brand w-full px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-brand/5 focus:shadow-[0_0_15px_rgba(255,95,31,0.2)]"
                />
              </div>

              <button
                type="submit"
                className="glow-btn bg-white text-black font-black py-4 px-8 mt-2 text-sm uppercase tracking-widest hover:bg-brand hover:text-white transition-all duration-300 w-full"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/40 font-medium">
                New to Connect Sphere?{" "}
                <a href="#" className="text-brand font-bold uppercase tracking-widest ml-1 hover:text-white transition-colors border-b border-brand hover:border-white pb-0.5">
                  Create Account
                </a>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
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
      </div>

    </div>
  );
}


