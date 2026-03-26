import SignInForm from '@/components/auth/SignInForm';
import LanyardLoader from '@/components/LanyardLoader';

export default function SignInPage() {
  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{ top: '56px' }}
    >
      {/* ── Left: Brand Panel ──────────────────────────── */}
      <div className="hidden lg:flex w-[420px] xl:w-[480px] shrink-0 flex-col justify-between p-12 xl:p-16 relative overflow-hidden border-r border-white/5">
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
          style={{ background: 'radial-gradient(circle, rgba(255,95,31,0.12) 0%, transparent 70%)' }}
        />
        {/* Blue glow blob */}
        <div className="absolute -top-20 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)' }}
        />

        {/* Top badge */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand/30 bg-brand/5 text-[0.6rem] font-bold tracking-[0.4em] text-brand uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse inline-block" />
            Connect Sphere
          </span>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <p className="text-[0.65rem] font-bold tracking-[0.4em] text-white/25 uppercase mb-6">
            Your Global Stage
          </p>
          <h2
            className="font-black uppercase leading-[0.88] tracking-tighter mb-8"
            style={{ fontSize: 'clamp(4rem, 7vw, 6rem)' }}
          >
            WHERE<br />
            IDEAS<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #FF5F1F 0%, #FF9A5C 100%)',
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
              {['#FF5F1F','#0066FF','#34D399','#F59E0B'].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#0e0e0e]"
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
          Team Net-Y @ 2026
        </p>
      </div>

      {/* ── Centre: Sign-In Card ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
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
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,95,31,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 w-full max-w-[380px]">
          <SignInForm />
        </div>
      </div>

      {/* ── Right: Lanyard 3D ─────────────────────────── */}
      <div className="hidden xl:block w-[420px] shrink-0 relative border-l border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,102,255,0.06) 0%, transparent 70%)' }}
        />
        <LanyardLoader />
      </div>
    </div>
  );
}
