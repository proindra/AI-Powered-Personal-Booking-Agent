import SignInForm from '@/components/auth/SignInForm';
import LanyardLoader from '@/components/3d/LanyardLoader';
import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <div
      className="fixed inset-0 flex flex-col lg:flex-row overflow-hidden"
      style={{ top: '56px' }}
    >
      {/* ── Left: Brand Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/3 xl:w-[400px] 2xl:w-[480px] shrink-0 flex-col justify-between p-10 xl:p-16 relative overflow-hidden border-r border-white/5">
        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Orange glow blob */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0, 102, 255,0.12) 0%, transparent 70%)' }}
        />
        {/* Blue glow blob */}
        <div className="absolute -top-20 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)' }}
        />

        {/* Top badge */}
        <div className="relative z-10 mt-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand/30 bg-brand/5 text-[0.6rem] font-bold tracking-[0.4em] text-brand uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse inline-block" />
            4th Dimension
          </span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 my-auto">
          <p className="text-[0.65rem] font-bold tracking-[0.4em] text-white/25 uppercase mb-6">
            Your Global Stage
          </p>
          <h2
            className="font-black uppercase leading-[0.88] tracking-tighter mb-8"
            style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}
          >
            WHERE<br />
            IDEAS<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #0066FF 0%, #FF9A5C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MEET
            </span>
          </h2>
          <p className="text-white/35 text-sm leading-relaxed max-w-[260px]">
            Connect with world-class speakers, attend live events, and grow your global network — all in one place.
          </p>

          {/* Social proof strip */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['#0066FF','#0066FF','#34D399','#F59E0B'].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#0e0e0e] shadow-md"
                  style={{ background: c }}
                />
              ))}
            </div>
            <p className="text-[0.65rem] text-white/30 font-medium">
              <span className="text-white font-bold">12,000+</span> professionals joined
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[0.55rem] uppercase tracking-[0.35em] font-bold text-white/15">
          4th Dimension @ 2026
        </p>
      </div>

      {/* ── Centre: Sign-In Card ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-dark">
        {/* Subtle dot-grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Centre glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 102, 255,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Sign In Container */}
        <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up">
          <Suspense fallback={<div className="text-white/50 text-xs text-center p-8">Loading authentication...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>

      {/* ── Right: Lanyard 3D ─────────────────────────── */}
      <div className="hidden xl:block xl:w-[35%] 2xl:w-[420px] shrink-0 relative border-l border-white/5 bg-dark overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,102,255,0.06) 0%, transparent 70%)' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
        <LanyardLoader />
      </div>
    </div>
  );
}
