import SignInForm from '@/components/SignInForm';
import LanyardLoader from '@/components/LanyardLoader';

export default function SignInPage() {
  return (
    <div className="fixed inset-0 flex" style={{ top: '56px' }}>

      {/* Left — Brand Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 border-r border-white/5 relative overflow-hidden bg-dark/40 backdrop-blur-sm shrink-0">
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase mb-6">Welcome Back</p>
          <h2 className="text-6xl xl:text-8xl font-black uppercase leading-none tracking-tighter mb-8">
            YOUR<br />GLOBAL<br /><span className="text-brand">STAGE</span><br />AWAITS
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Connect with world-class speakers, attend live events, and grow your network — all in one place.
          </p>
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-white/20">Team Net-Y @ 2026</p>
      </div>

      {/* Right — Form + Lanyard */}
      <div className="flex-1 flex overflow-hidden">

        {/* Form */}
        <div className="flex items-center justify-center w-full lg:w-[420px] shrink-0 px-8 overflow-y-auto">
          <SignInForm />
        </div>

        {/* Lanyard — fills remaining space, hidden on mobile */}
        <div className="hidden lg:block flex-1 relative">
          <LanyardLoader />
        </div>

      </div>

    </div>
  );
}
