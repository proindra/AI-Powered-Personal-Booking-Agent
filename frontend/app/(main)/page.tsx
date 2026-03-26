"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import ExploreTechSection from "@/components/ExploreTechSection";
import TrustedByLeaders from "@/components/TrustedByLeaders";
import BookingPageClient from "@/components/BookingPageClient";

const EventStackScroll = dynamic(() => import("@/components/EventStackScroll"), {
  ssr: false,
  loading: () => <div className="h-screen bg-dark flex items-center justify-center text-white/50 text-xs font-mono uppercase tracking-widest">Loading Events...</div>
});

const speakers = [
  { name: "Lionel Messi", img: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg", delay: "0s" },
  { name: "Taylor Swift", img: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png", delay: "-1.5s", tall: true },
  { name: "Albert Einstein", img: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg", delay: "-3s" },
  { name: "Elon Musk", img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg", delay: "-4.5s", tallest: true },
  { name: "Bill Gates", img: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bill_Gates_2018.jpg", delay: "-2s" },
  { name: "Virat Kohli", img: "https://upload.wikimedia.org/wikipedia/commons/7/7c/The_President%2C_Shri_Pranab_Mukherjee_presenting_the_Padma_Shri_Award_to_Shri_Virat_Kohli%2C_at_a_Civil_Investiture_Ceremony%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_March_30%2C_2017_%28cropped%29.jpg", delay: "-1s", tall: true },
  { name: "Barack Obama", img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg", delay: "-5s" },
];

const featuredSpeakers = [
  { name: "Cristiano Ronaldo", role: "Global Sports Icon • Portugal", img: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg" },
  { name: "Elon Musk", role: "CEO & Product Architect • Tesla", img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg" },
  { name: "Virat Kohli", role: "Global Sports Icon • India", img: "https://upload.wikimedia.org/wikipedia/commons/7/7c/The_President%2C_Shri_Pranab_Mukherjee_presenting_the_Padma_Shri_Award_to_Shri_Virat_Kohli%2C_at_a_Civil_Investiture_Ceremony%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_March_30%2C_2017_%28cropped%29.jpg" },
];

const usefulFor = [
  { num: "01", title: "Founders", desc: "Scale your vision with insights from industry veterans who've been there.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { num: "02", title: "Design Leads", desc: "Master the craft of leadership and design systems at enterprise scale.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { num: "03", title: "Marketers", desc: "Connect with creators defining the next generation of digital storytelling.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { num: "04", title: "Engineers", desc: "Bridge the gap between development and design with kinetic workflows.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

const eventImages = [
  { alt: "Tech Audience", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { alt: "Presentation Stage", src: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { alt: "Networking", src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { alt: "Cyber Event", src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { alt: "Massive Scale Event", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

export default function EventsPage() {
  return (
    <div className="pt-32">
      {/* HERO */}
      <section className="relative reveal active">
        <div className="speaker-strip flex items-center justify-center -space-x-4 mb-12 px-4">
          {speakers.map((s) => (
            <div
              key={s.name}
              className={`speaker-item animate-float-subtle overflow-hidden border-x border-dark shadow-2xl relative ${
                s.tallest ? "w-48 h-96 z-30" : s.tall ? "w-48 h-[22rem] z-10" : "w-48 h-80"
              }`}
              style={{ animationDelay: s.delay }}
            >
              <img
                alt={s.name}
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all bg-dark"
                src={s.img}
              />
            </div>
          ))}
        </div>

        <div className="marquee-container py-4 border-y border-white/10 mt-8">
          <div className="marquee-content text-[8vw] font-black uppercase leading-none tracking-tighter italic">
            Conferences • Lectures • Workshops • Conferences • Lectures • Workshops • Conferences • Lectures • Workshops •{" "}
          </div>
          <div aria-hidden className="marquee-content text-[8vw] font-black uppercase leading-none tracking-tighter italic">
            Conferences • Lectures • Workshops • Conferences • Lectures • Workshops • Conferences • Lectures • Workshops •{" "}
          </div>
        </div>

        <div className="flex justify-center mt-12 mb-24">
          <button
            onClick={() => {
              const t = document.querySelector('#contact');
              if (!t) return;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const lenis = (window as any).lenis;
              lenis ? lenis.scrollTo(t, { offset: -128, duration: 1.2 }) : window.scrollTo({ top: (t as HTMLElement).getBoundingClientRect().top + window.scrollY - 128, behavior: 'smooth' });
            }}
            className="glow-btn bg-brand text-black font-black py-4 px-12 rounded-lg text-lg uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(255,95,31,0.3)] animate-[glowPulse_3s_ease-in-out_infinite]"
          >
            Save My Spot
          </button>
        </div>
      </section>

      {/* USEFUL FOR */}
      <section className="py-24 px-8 border-t border-white/10 reveal" id="useful-for">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-12 lg:mb-16 leading-none reveal-left delay-1">
            WOULD BE<br /><span className="text-brand">USEFUL FOR</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {usefulFor.map((item, i) => (
              <div
                key={item.num}
                className={`brutalist-card p-6 lg:p-8 flex flex-col justify-between h-64 md:h-72 lg:h-80 group relative overflow-hidden`}
              >
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000 z-0" />
                <div className="absolute inset-0 bg-dark/80 group-hover:bg-brand/20 transition-colors duration-500 z-10 pointer-events-none mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10 pointer-events-none" />
                <span className="relative z-20 text-xs font-bold uppercase tracking-widest text-brand group-hover:text-white transition-colors drop-shadow-lg">{item.num}</span>
                <h3 className="relative z-20 text-3xl lg:text-4xl font-black uppercase leading-none mt-auto text-white drop-shadow-xl">{item.title}</h3>
                <p className="relative z-20 mt-4 text-xs md:text-sm text-white/80 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS — SCROLL STACK */}
      <section className="scroll-mt-32" id="upcoming-events">
        <EventStackScroll />
      </section>

      {/* FEATURED SPEAKERS */}
      <section className="py-24 border-t border-white/10 scroll-mt-32 reveal" id="featured-speakers">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 reveal-left delay-1">
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              FEATURED<br /><span className="text-brand">SPEAKERS</span>
            </h2>
            <div className="max-w-xs text-right">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/40 mb-4">Curating excellence in digital innovation and creative leadership.</p>
              <a href="#" className="text-brand font-black uppercase text-sm tracking-widest border-b-2 border-brand pb-1 hover:text-white hover:border-white transition-all duration-300 inline-block hover:-translate-y-1">View All Speakers</a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 stagger-children">
            {featuredSpeakers.map((s, i) => (
              <div key={s.name} className={`group cursor-pointer reveal delay-${i + 1}`}>
                <div className="aspect-[4/5] overflow-hidden bg-white/5 relative mb-6 rounded-lg shadow-xl">
                  <img alt={s.name} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" src={s.img} />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand transition-all duration-500 pointer-events-none rounded-lg z-10" />
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter group-hover:text-brand transition-colors duration-300">{s.name}</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mt-2">{s.role}</p>
                <button
                  onClick={() => { const t = document.querySelector('#booking'); if(!t) return; const lenis=(window as any).lenis; lenis ? lenis.scrollTo(t,{offset:-128,duration:1.2}) : window.scrollTo({top:(t as HTMLElement).getBoundingClientRect().top+window.scrollY-128,behavior:'smooth'}); }}
                  className="mt-4 text-xs font-bold uppercase tracking-widest text-brand border-b border-brand hover:text-white hover:border-white transition-all"
                >
                  Book Session →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS REEL */}
      <section className="py-24 border-t border-white/10 overflow-hidden reveal" id="upcoming-events-alt">
        <div className="max-w-7xl mx-auto px-8 mb-20">
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
            UPCOMING<br /><span className="text-brand">EVENTS</span>
          </h2>
        </div>
        <div
          className="relative h-[400px] mb-20 overflow-hidden"
          style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
        >
          <div className="flex animate-[carousel-flow_30s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[...eventImages, ...eventImages].map((img, i) => (
              <div key={i} className="w-[300px] h-[400px] flex-shrink-0 bg-white/5 overflow-hidden rounded-xl border border-white/10 group cursor-pointer hover:border-brand transition-colors mx-2">
                <img alt={img.alt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" src={img.src} />
              </div>
            ))}
          </div>
        </div>
        <div className="marquee-container py-4 border-y border-white/10">
          <div className="marquee-content marquee-fast text-[8vw] font-black uppercase leading-none tracking-tighter italic text-white/10">
            Workshops • Conferences • Lectures • Workshops • Conferences • Lectures •{" "}
          </div>
          <div aria-hidden className="marquee-content marquee-fast text-[8vw] font-black uppercase leading-none tracking-tighter italic text-white/10">
            Workshops • Conferences • Lectures • Workshops • Conferences • Lectures •{" "}
          </div>
        </div>
      </section>

      {/* NETWORKING */}
      <section className="py-24 px-8 border-t border-white/10 scroll-mt-32 reveal" id="networking">
        <div className="max-w-[1440px] mx-auto">

          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
            <div className="lg:col-span-7 reveal-left delay-1">
              <h2 className="font-black text-6xl md:text-8xl uppercase leading-[0.9] tracking-tighter mb-8">
                Hyper <span className="text-accent italic">Human</span><br />Connectivity
              </h2>
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

            <div className="lg:col-span-5 relative flex justify-center items-center reveal-right delay-2">
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
          </div>

          {/* Bento Grid */}
          <div className="mb-32 reveal delay-2">
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
                {[{ name: "Sarah Chen", role: "Principal Architect" }, { name: "Marcus Thorne", role: "Head of Design Ops" }].map((expert) => (
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
                <button className="w-full py-4 border border-brand text-brand font-bold text-xs uppercase tracking-widest group-hover:bg-brand group-hover:text-black transition-all duration-300">View Schedule</button>
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
          </div>

          {/* Networking CTA */}
          <div className="brutalist-card p-16 text-center border-t border-t-brand/30 relative reveal delay-3">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#FF5F1F 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10">
              <h2 className="font-black text-5xl md:text-7xl uppercase mb-8 leading-none text-white">Ready to<br />Sync?</h2>
              <button
                onClick={() => {
                  const t = document.querySelector('#contact');
                  if (!t) return;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const lenis = (window as any).lenis;
                  lenis ? lenis.scrollTo(t, { offset: -128, duration: 1.2 }) : window.scrollTo({ top: (t as HTMLElement).getBoundingClientRect().top + window.scrollY - 128, behavior: 'smooth' });
                }}
                className="glow-btn bg-brand text-black font-bold uppercase tracking-widest text-sm px-12 py-6 hover:scale-105 hover:bg-white transition-all active:scale-95 shadow-[0_0_30px_rgba(255,95,31,0.3)]"
              >
                Activate Connection Protocol
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* BOOKING */}
      <section className="py-24 px-8 border-t border-white/10 scroll-mt-32 reveal" id="booking">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16 reveal-left">
            <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs">AI-Powered</span>
            <h2 className="font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tighter text-white mt-4 mb-6">
              BOOK A<br /><span className="text-brand">SESSION</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Our LangGraph-powered booking agent understands natural language. Just tell it what you need — it handles availability, conflicts, and confirmations.
            </p>
          </div>
          <BookingPageClient />
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-8 border-t border-white/10 scroll-mt-32 reveal" id="contact">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left */}
          <div className="lg:col-span-5 flex flex-col space-y-8 reveal-left delay-1">
            <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs">Direct Connection</span>
            <h2 className="font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tighter text-white">
              GET IN <br />TOUCH
            </h2>
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
          <div className="lg:col-span-7 brutalist-card p-12 lg:p-20 relative overflow-hidden reveal-right delay-2">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/10 rounded-full blur-[100px]" />
            <form action="#" className="relative z-10 space-y-12">
              <div className="relative">
                <input className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none" id="contact-name" placeholder=" " type="text" />
                <label className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85" htmlFor="contact-name">Full Name</label>
              </div>
              <div className="relative">
                <input className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none" id="contact-email" placeholder=" " type="email" />
                <label className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85" htmlFor="contact-email">Email Address</label>
              </div>
              <div className="relative">
                <textarea className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl resize-none placeholder-transparent outline-none" id="contact-message" placeholder=" " rows={4} />
                <label className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85" htmlFor="contact-message">Your Message</label>
              </div>
              <div className="pt-8">
                <button className="w-full md:w-auto glow-btn bg-brand text-black px-12 py-6 uppercase font-black tracking-[0.2em] text-sm hover:bg-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,95,31,0.3)]" type="submit">
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
          <div className="lg:col-span-12 reveal delay-3">
            <div className="h-[400px] w-full relative group overflow-hidden brutalist-card">
              <img alt="World map digital visualization" className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-700" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h4 className="font-black text-4xl text-white uppercase tracking-tighter">Global Presence</h4>
                <div className="flex gap-4 mt-4">
                  {["San Francisco", "London", "Singapore"].map((city) => (
                    <span key={city} className="px-3 py-1 bg-white/10 text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">{city}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TRUSTED BY LEADERS */}
      <TrustedByLeaders />

      {/* EXPLORE TECH TODAY */}
      <ExploreTechSection />
    </div>
  );
}


