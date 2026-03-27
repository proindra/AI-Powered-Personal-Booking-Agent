"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
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
      <section className="py-32 relative flex flex-col items-center justify-center text-center overflow-hidden z-10" id="explore-tech">
        <p className="text-[0.65rem] font-bold tracking-[0.4em] text-white/40 uppercase mb-6">TAKE ACTION</p>
        <h2 className="text-5xl md:text-[100px] font-black uppercase tracking-tighter leading-none mb-12">EXPLORE <span className="text-brand">BUSINESS</span> TODAY</h2>
        <div className="w-full md:w-[55%] max-w-[600px] mt-8 px-4">
          <svg className="w-full h-auto" viewBox="0 0 1000 400">
            <path className="neon-path" d="M100,300 L300,50 L500,350 L700,100 L900,300" fill="none" stroke="#0066FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="60"></path>
          </svg>
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


