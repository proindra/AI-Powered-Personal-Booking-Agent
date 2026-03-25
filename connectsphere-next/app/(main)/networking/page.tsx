import Link from "next/link";

export default function NetworkingPage() {
  return (
    <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32 reveal delay-1">
        <div className="lg:col-span-7">
          <h1 className="font-black text-6xl md:text-8xl uppercase leading-[0.9] tracking-tighter mb-8">
            Hyper <span className="text-accent italic">Human</span>
            <br />Connectivity
          </h1>
          <p className="text-xl text-white/60 max-w-xl mb-12">
            Forge precision alliances through our kinetic matching engine. Where data-driven design meets high-frequency networking.
          </p>
          <div className="flex flex-col gap-4 max-w-md">
            {["UX Strategy", "System Thinking", "AI in Design", "Design Ops"].map((item) => (
              <div key={item} className="group flex items-center justify-between p-6 brutalist-card border-l-4 border-l-accent cursor-pointer hover:scale-[1.02] hover:bg-accent/10 hover:border-accent transition-all">
                <span className="font-bold text-lg uppercase tracking-widest text-white">{item}</span>
                <span className="material-symbols-outlined text-accent">arrow_forward</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-[120px]" />
            <div className="relative w-full h-full rounded-full border border-accent/30 flex items-center justify-center p-12">
              <div className="w-full h-full rounded-full brutalist-card flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-dark opacity-50" />
                <img
                  alt="Cybernetic network"
                  className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                />
                <div className="relative z-10 text-center px-8">
                  <span className="material-symbols-outlined text-6xl text-accent mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>language</span>
                  <h3 className="font-black text-3xl uppercase leading-tight text-white">Join<br />the Global Mesh</h3>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 right-10 bg-brand text-black p-4 rotate-12 shadow-xl">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div className="absolute bottom-10 -left-6 brutalist-card border border-accent/50 p-4 -rotate-6 shadow-xl bg-dark">
              <span className="font-bold text-accent text-sm tracking-widest uppercase">LIVE: 1.2K ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="mb-32 reveal delay-2">
        <div className="mb-16">
          <h2 className="font-black text-4xl uppercase tracking-tight mb-2 text-white">
            Protocol <span className="text-brand">Features</span>
          </h2>
          <div className="w-24 h-1 bg-brand" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 brutalist-card p-8 border-t border-t-accent/50 relative overflow-hidden group">
            <span className="font-bold text-accent text-xs tracking-widest uppercase mb-6 block">Module 01</span>
            <h3 className="font-black text-3xl uppercase mb-4 text-white">Neural Matching</h3>
            <p className="text-white/60 mb-8">Our proprietary algorithm connects you with 5 high-value peers based on your shared technical stack and strategic goals.</p>
            <img alt="Tech interface" className="w-full h-48 object-cover -rotate-2 group-hover:rotate-0 transition-transform duration-500" src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
          </div>

          <div className="bg-accent text-white p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform cursor-pointer border border-white/10">
            <span className="material-symbols-outlined text-5xl mb-12 text-white">dynamic_feed</span>
            <div>
              <h3 className="font-black text-2xl uppercase mb-2">Real-time Pulse</h3>
              <p className="font-bold text-xs uppercase tracking-widest opacity-80">Sync with the latest industry shifts as they happen in the networking lounge.</p>
            </div>
          </div>

          <div className="brutalist-card p-8 flex flex-col gap-6">
            <h3 className="font-black text-xl uppercase text-white">Expert Circles</h3>
            {[
              { name: "Sarah Chen", role: "Principal Architect" },
              { name: "Marcus Thorne", role: "Head of Design Ops" },
            ].map((expert) => (
              <div key={expert.name} className="flex items-center gap-4">
                <div className="w-12 h-12 brutalist-card bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-brand">person</span>
                </div>
                <div>
                  <p className="font-bold text-xs text-white uppercase tracking-widest">{expert.name}</p>
                  <p className="text-[10px] text-brand uppercase tracking-widest">{expert.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="brutalist-card p-8 border-r-4 border-r-brand group cursor-pointer hover:bg-white/5 transition-colors">
            <h3 className="font-black text-2xl text-white uppercase mb-6">Design Labs</h3>
            <p className="text-white/60 text-sm mb-6">Interactive workshops featuring 1:1 sessions with industry disruptors.</p>
            <button className="w-full py-4 border border-brand text-brand font-bold text-xs uppercase tracking-widest group-hover:bg-brand group-hover:text-black transition-all duration-300">
              View Schedule
            </button>
          </div>

          <div className="md:col-span-3 brutalist-card p-8 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full">
              <div className="max-w-md">
                <h3 className="font-black text-4xl uppercase mb-4 text-white">The Sphere Lobby</h3>
                <p className="text-white/60">Access the 24/7 digital foyer. No small talk, just high-impact knowledge exchange for the global design community.</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-dark p-4 border border-white/10 group-hover:border-accent transition-colors">
                  <span className="text-3xl font-black text-accent">48</span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/50">Active Hubs</span>
                </div>
                <div className="bg-dark p-4 border border-white/10 group-hover:border-brand transition-colors">
                  <span className="text-3xl font-black text-brand">850</span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/50">Sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="brutalist-card p-16 text-center border-t border-t-brand/30 relative reveal delay-3">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#FF5F1F 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10">
          <h2 className="font-black text-5xl md:text-7xl uppercase mb-8 leading-none text-white">Ready to<br />Sync?</h2>
          <Link href="/contact">
            <button className="glow-btn bg-brand text-black font-bold uppercase tracking-widest text-sm px-12 py-6 hover:scale-105 hover:bg-white transition-all active:scale-95 shadow-[0_0_30px_rgba(255,95,31,0.3)]">
              Activate Connection Protocol
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}


