"use client";
import Link from "next/link";
import { getPath } from "@/utils/paths";

const ArrowIcon = () => (
  <svg width="24" height="24" fill="none" className="group-hover:text-black" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

function smoothScrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.querySelectorAll(".reveal").forEach((el) => el.classList.remove("active"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: -128, duration: 1.2 });
  } else {
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 128;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function HashLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const [path, hash] = href.split("#");
  function handleClick(e: React.MouseEvent) {
    if (!hash) return;
    e.preventDefault();
    const resolvedPath = getPath(path === "" ? "/" : path);
    if (window.location.pathname === resolvedPath || 
        window.location.pathname === resolvedPath + '/' ||
        window.location.pathname === resolvedPath.replace(/\/$/, '')) {
      smoothScrollToHash(`#${hash}`);
    } else {
      window.location.href = getPath(href);
    }
  }
  return <Link href={href} onClick={handleClick} className={className}>{children}</Link>;
}

export default function Footer() {
  return (
    <footer className="relative z-20 bg-dark pt-16 pb-8 border-t border-white/10">
      <div className="max-w-[1600px] mx-auto">

        {/* Social Links Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/10 mb-16">
          <a href="#" className="group p-8 lg:p-10 border-r border-b lg:border-b-0 border-white/10 flex items-center justify-between hover:bg-brand transition-colors duration-300">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter group-hover:text-black">YouTube</span>
            <ArrowIcon />
          </a>
          <a href="#" className="group p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex items-center justify-between hover:bg-brand transition-colors duration-300">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter group-hover:text-black">X</span>
            <ArrowIcon />
          </a>
          <a href="#" className="group p-8 lg:p-10 border-r border-white/10 flex items-center justify-between hover:bg-brand transition-colors duration-300">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter group-hover:text-black">LinkedIn</span>
            <ArrowIcon />
          </a>
          <a href="#" className="group p-8 lg:p-10 flex items-center justify-between hover:bg-brand transition-colors duration-300">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter group-hover:text-black">Facebook</span>
            <ArrowIcon />
          </a>
        </div>

        {/* Links Grid */}
        <div className="px-8 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-5">
            <p className="text-[0.65rem] font-bold tracking-[0.3em] text-white/40 uppercase">Explore</p>
            <HashLink href="/#explore-tech" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Business Today</HashLink>
            <HashLink href="/#useful-for" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Who We Help</HashLink>
            <HashLink href="/#explore-tech" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Take Action</HashLink>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-[0.65rem] font-bold tracking-[0.3em] text-white/40 uppercase">Events</p>
            <HashLink href="/#upcoming-events" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Upcoming Sessions</HashLink>
            <HashLink href="/#upcoming-events" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Past Highlights</HashLink>
            <HashLink href="/#upcoming-events" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Event Calendar</HashLink>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-[0.65rem] font-bold tracking-[0.3em] text-white/40 uppercase">AI Booking</p>
            <HashLink href="/#booking" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Schedule Session</HashLink>
            <HashLink href="/#booking" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">LangGraph Agent</HashLink>
            <HashLink href="/#booking" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Manage Booking</HashLink>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-[0.65rem] font-bold tracking-[0.3em] text-white/40 uppercase">Company</p>
            <HashLink href="/#contact" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Support Center</HashLink>
            <a href="#" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Partnership Inquiry</a>
            <a href="#" className="text-sm font-black uppercase text-white hover:text-brand transition-colors">Press & Media</a>
          </div>
        </div>

        {/* Newsletter & Brand */}
        <div className="px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg width="32" height="32" fill="none" stroke="#0066FF" viewBox="0 0 40 40" strokeWidth="4">
                <path d="M5 30 L15 5 L25 35 L35 10" />
              </svg>
              <span className="text-xl font-black tracking-tighter">Connect Sphere</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              Whether you lead teams or just launched your career — ConnectSphere helps you grow through live events, expert insights, and real interaction.
            </p>
          </div>
          <div className="lg:justify-self-end w-full lg:w-auto">
            <h4 className="text-xl font-black tracking-tighter mb-5">Newsletters</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="adamcrangston@gmail.com"
                className="flex-1 bg-white/5 border border-white/20 px-4 py-3 rounded-lg text-white text-sm outline-none focus:border-brand transition-colors"
              />
              <button className="bg-brand text-white font-black px-6 py-3 rounded-lg uppercase tracking-widest text-xs hover:bg-white hover:text-brand transition-colors shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-8 lg:px-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[0.6rem] uppercase tracking-[0.2em] font-bold text-white/30">
          <p>Team Net-Y @ 2026</p>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p>made with love TEAM NET-Y</p>
        </div>

      </div>
    </footer>
  );
}


