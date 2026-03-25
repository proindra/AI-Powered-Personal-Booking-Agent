export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Left */}
      <div className="lg:col-span-5 flex flex-col space-y-8 reveal delay-1">
        <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs">Direct Connection</span>
        <h1 className="font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tighter text-white">
          GET IN <br />TOUCH
        </h1>
        <p className="text-white/60 text-lg max-w-md leading-relaxed">
          Whether you&apos;re looking to speak, sponsor, or connect, our kinetic network is ready to accelerate your journey.
        </p>
        <div className="mt-12 space-y-6">
          <div className="p-8 brutalist-card border-l-4 border-l-brand flex items-start gap-6">
            <span className="material-symbols-outlined text-brand text-3xl">hub</span>
            <div>
              <h3 className="font-bold uppercase text-white tracking-widest mb-2">Network Hub</h3>
              <p className="text-sm text-white/60">Silicon Valley / Berlin / Tokyo</p>
            </div>
          </div>
          <div className="p-8 brutalist-card border-l-4 border-l-accent flex items-start gap-6">
            <span className="material-symbols-outlined text-accent text-3xl">alternate_email</span>
            <div>
              <h3 className="font-bold uppercase text-white tracking-widest mb-2">Direct Channel</h3>
              <p className="text-sm text-white/60">hello@connectsphere.tech</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-7 brutalist-card p-12 lg:p-20 relative overflow-hidden reveal delay-2">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/10 rounded-full blur-[100px]" />
        <form action="#" className="relative z-10 space-y-12">
          <div className="relative group">
            <input
              className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none"
              id="name"
              placeholder=" "
              type="text"
            />
            <label className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85" htmlFor="name">
              Full Name
            </label>
          </div>
          <div className="relative group">
            <input
              className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none"
              id="email"
              placeholder=" "
              type="email"
            />
            <label className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85" htmlFor="email">
              Email Address
            </label>
          </div>
          <div className="relative group">
            <textarea
              className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl resize-none placeholder-transparent outline-none"
              id="message"
              placeholder=" "
              rows={4}
            />
            <label className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85" htmlFor="message">
              Your Message
            </label>
          </div>
          <div className="pt-8">
            <button
              className="w-full md:w-auto glow-btn bg-brand text-black px-12 py-6 uppercase font-black tracking-[0.2em] text-sm hover:bg-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,95,31,0.3)]"
              type="submit"
            >
              SEND MESSAGE
              <span className="material-symbols-outlined">north_east</span>
            </button>
          </div>
        </form>
        <div className="mt-20 pt-12 border-t border-white/10 flex flex-wrap gap-12">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-brand block" />
            <span className="font-bold text-[10px] uppercase tracking-widest text-white/60">Press: press@sphere.com</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-accent block" />
            <span className="font-bold text-[10px] uppercase tracking-widest text-white/60">Support: 24/7 Kinetic Support</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <section className="lg:col-span-12 mb-24">
        <div className="h-[400px] w-full relative group overflow-hidden brutalist-card">
          <img
            alt="World map digital visualization"
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-700"
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
          <div className="absolute bottom-12 left-12">
            <h4 className="font-black text-4xl text-white uppercase tracking-tighter">Global Presence</h4>
            <div className="flex gap-4 mt-4">
              {["San Francisco", "London", "Singapore"].map((city) => (
                <span key={city} className="px-3 py-1 bg-white/10 text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


