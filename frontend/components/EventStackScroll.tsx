"use client";
import { useRef, useEffect, useState } from "react";

const events = [
  {
    date: "Aug 20 • 6:00 PM UTC",
    title: "Design Systems for Scale",
    sub: "[Live + Replay] — With Adam Cooper, Lead Product Designer at Wise",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Workshop",
  },
  {
    date: "Sep 5 • 4:00 PM UTC",
    title: "The Future of AI in Product",
    sub: "[Live + Replay] — With Sarah Chen, Principal Architect at DeepMind",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Conference",
  },
  {
    date: "Sep 18 • 7:00 PM UTC",
    title: "Kinetic Leadership Masterclass",
    sub: "[Live + Replay] — With Marcus Thorne, Head of Design Ops at Stripe",
    img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Lecture",
  },
  {
    date: "Oct 2 • 5:00 PM UTC",
    title: "Scaling Startups to Unicorns",
    sub: "[Live + Replay] — With Elon Musk, CEO at Tesla & SpaceX",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Conference",
  },
];

export default function EventStackScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0); // 0 to 1 across entire section

  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      setScrollRatio(Math.max(0, Math.min(1, scrolled / totalScrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBooking = () => {
    const t = document.querySelector("#booking");
    if (!t) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis;
    lenis
      ? lenis.scrollTo(t, { offset: -128, duration: 1.2 })
      : window.scrollTo({ top: (t as HTMLElement).getBoundingClientRect().top + window.scrollY - 128, behavior: "smooth" });
  };

  // Each card occupies 1/events.length of the total scroll range
  // Card i starts entering at ratio = i / events.length
  // Card i is fully in at ratio = (i + 0.3) / events.length
  const perCard = 1 / events.length;

  return (
    <div
      ref={containerRef}
      style={{ height: `${(events.length + 1) * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-dark">

        {/* Heading */}
        <div className="max-w-7xl mx-auto px-8 w-full mb-8 flex-shrink-0">
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter text-center leading-none">
            UPCOMING EVENTS
          </h2>
        </div>

        {/* Card stack */}
        <div className="relative max-w-7xl mx-auto px-8 w-full flex-1 min-h-0" style={{ maxHeight: "58vh" }}>
          {events.map((ev, i) => {
            // How far into this card's scroll window are we (0 = not started, 1 = fully covered by next)
            const cardStart = i * perCard;
            const cardProgress = Math.max(0, Math.min(1, (scrollRatio - cardStart) / perCard));

            // Card slides UP from bottom as its turn comes
            // translateY: 100% (off screen below) → 0% (fully visible)
            const translateY = i === 0 ? 0 : (1 - cardProgress) * 100;

            // Cards underneath scale down slightly as they get covered
            // Only apply to cards that are already fully in (i < current active)
            const activeIndex = Math.min(Math.floor(scrollRatio / perCard), events.length - 1);
            const depth = activeIndex - i;
            const scaleDown = i < activeIndex ? Math.max(0.88, 1 - depth * 0.04) : 1;
            const darken = i < activeIndex ? Math.min(0.6, depth * 0.2) : 0;

            return (
              <div
                key={i}
                className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                style={{
                  transform: `translateY(${translateY}%) scale(${scaleDown})`,
                  zIndex: i + 1,
                  transformOrigin: "top center",
                  willChange: "transform",
                }}
              >
                {/* Image */}
                <img
                  src={ev.img}
                  alt={ev.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Darken overlay for cards underneath */}
                <div
                  className="absolute inset-0 bg-dark transition-none"
                  style={{ opacity: darken }}
                />

                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-8 left-8">
                  <span className="px-3 py-1 border border-white/30 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm bg-black/20">
                    {ev.tag}
                  </span>
                </div>

                {/* Card number */}
                <div className="absolute top-6 right-8 text-[100px] font-black leading-none text-white/5 select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between gap-8">
                  <div>
                    <p className="text-brand font-bold uppercase tracking-[0.3em] mb-3 text-sm">
                      {ev.date}
                    </p>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-none mb-4 text-white">
                      {ev.title}
                    </h3>
                    <p className="text-white/60 uppercase text-xs tracking-widest max-w-lg">
                      {ev.sub}
                    </p>
                  </div>
                  <button
                    onClick={scrollToBooking}
                    className="flex-shrink-0 bg-white text-black font-black px-8 py-4 uppercase tracking-widest text-sm hover:bg-brand transition-all duration-300 shadow-xl"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-3 mt-6 flex-shrink-0">
          {events.map((_, i) => {
            const activeIndex = Math.min(Math.floor(scrollRatio / perCard), events.length - 1);
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  background: i === activeIndex ? "#FF5F1F" : "rgba(255,255,255,0.2)",
                }}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}


