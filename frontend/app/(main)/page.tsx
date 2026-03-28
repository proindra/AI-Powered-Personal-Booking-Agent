"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BookingPageClient from "@/components/BookingPageClient";
import { TypeAnimation } from 'react-type-animation';
import { getSession } from "@/lib/auth/types";

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
  const router = useRouter();
  const [guestNotice, setGuestNotice] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  // Prefetch routes to make transitions instant
  useEffect(() => {
    router.prefetch("/booking");
    router.prefetch("/signin");
  }, [router]);

  const handleBookingClick = () => {
    setIsRouting(true); // Immediate visual feedback!
    const session = getSession();
    
    // Only fully authenticated Google users can access the booking page
    if (session && session.type === 'google') {
      router.push("/booking");
    } else if (session?.type === 'guest') {
      // Guests get a brief toast explaining why they are redirected
      setGuestNotice(true);
      setTimeout(() => {
        setGuestNotice(false);
        router.push("/signin?from=booking");
      }, 1500); 
    } else {
      // Completely unauthenticated users redirect instantly without the guest toast
      router.push("/signin?from=booking");
    }
  };

  return (
    <div className="pt-32">
      {/* HERO / INTRO */}
      <section className="py-8 lg:py-12 relative flex flex-col items-center justify-center overflow-hidden z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 gap-y-6 lg:gap-y-10 min-h-[calc(100vh-140px)]" id="explore-tech">

        {/* Decorative Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-brand/10 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-white/5 rounded-full blur-[80px] pointer-events-none z-[-1]"></div>

        {/* Top Row: Logo & Headings */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 lg:gap-12 relative z-10">

          {/* Top Left: Animated SVG Logo (Floating) */}
          <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1 relative mt-4 md:mt-0">
            <svg className="w-full h-auto max-w-[350px] lg:max-w-[420px] animate-float-subtle" viewBox="0 0 1000 400">
              <path className="neon-path" d="M100,300 L300,50 L500,350 L700,100 L900,300" fill="none" stroke="#0066FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="60"></path>
            </svg>
          </div>

          {/* Top Right: Headings */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/5 backdrop-blur-sm mb-4 lg:mb-6">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_10px_rgba(0,102,255,0.8)]"></span>
              <p className="text-[0.6rem] font-bold tracking-[0.2em] text-brand uppercase">CONNECTSPHERE AI</p>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[60px] xl:text-[70px] font-black uppercase tracking-tighter leading-[0.95] mb-4">
              ELEVATE YOUR <br className="hidden md:block" />
              <span className="text-brand inline-block min-w-[220px] lg:min-w-[300px]">
                <TypeAnimation sequence={['BUSINESS', 3000, 'SCHEDULE', 3000, 'MEETINGS', 3000, 'WORKFLOW', 3000]} wrapper="span" speed={50} repeat={Infinity} cursor={false} />
              </span>
              <br className="hidden md:block" /> WITH AI
            </h2>
          </div>
        </div>

        {/* Bottom Center: Paragraph & Buttons */}
        <div className="flex flex-col items-center text-center w-full max-w-3xl mt-0 relative z-10">
          <p className="text-white/70 text-base md:text-lg lg:text-xl px-4 md:px-0 mb-8 font-light leading-relaxed">
            Experience seamless, intelligent booking. Let our AI assistant manage your calendar, resolve scheduling conflicts, and save you countless hours of back-and-forth emails.
          </p>

          {/* Centered Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center w-full gap-4 px-4 md:px-0">

            {/* Guest sign-in notice toast */}
            {guestNotice && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[13px] font-medium shadow-xl pointer-events-none animate-fade-in">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Guest accounts can&apos;t access AI Booking &mdash; redirecting you to sign in&hellip;</span>
              </div>
            )}

            <button
              onClick={handleBookingClick}
              disabled={isRouting}
              className={`group flex items-center justify-center gap-2 bg-brand text-white font-bold uppercase tracking-widest text-xs lg:text-sm px-8 py-3.5 lg:py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 ${isRouting ? 'opacity-80 cursor-wait' : 'hover:bg-white hover:text-black'}`}
            >
              {isRouting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Try AI Booking</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                </>
              )}
            </button>
            <Link href="#useful-for" className="flex items-center justify-center bg-white/5 text-white font-bold uppercase tracking-widest text-xs lg:text-sm px-8 py-3.5 lg:py-4 rounded-full hover:bg-white/10 transition-all duration-300 border border-white/10 backdrop-blur-md hover:border-white/30 hover:-translate-y-1">
              Learn More
            </Link>
          </div>
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
                <button className="w-full md:w-auto glow-btn bg-brand text-black px-12 py-6 uppercase font-black tracking-[0.2em] text-sm hover:bg-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0, 102, 255,0.3)]" type="submit">
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



        </div>
      </section>

    </div>
  );
}


