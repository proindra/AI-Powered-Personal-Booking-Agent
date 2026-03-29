"use client";
import { useRef, useEffect, useState } from "react";
import { createGoogleCalendarEvent } from "@/lib/auth/google";

const STORAGE_KEY = "connect_sphere_events";

const DEFAULT_EVENTS = [
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

export type EventItem = (typeof DEFAULT_EVENTS)[0];

export default function EventStackScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [bookedKeys, setBookedKeys] = useState<Set<string>>(new Set());

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEvents(JSON.parse(stored));
      // Load previously booked event keys
      const storedBooked = localStorage.getItem('cs_booked_events');
      if (storedBooked) setBookedKeys(new Set(JSON.parse(storedBooked)));
    } catch {}

    // Listen for events added from AddEventSection component
    const handleNewEvent = (e: Event) => {
      const ev = (e as CustomEvent<EventItem>).detail;
      setEvents(prev => {
        const updated = [...prev, ev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    };
    const handleReset = (e: Event) => {
      const defaults = (e as CustomEvent<EventItem[]>).detail;
      setEvents(defaults);
    };
    window.addEventListener('cs:add-event', handleNewEvent);
    window.addEventListener('cs:reset-events', handleReset);
    return () => {
      window.removeEventListener('cs:add-event', handleNewEvent);
      window.removeEventListener('cs:reset-events', handleReset);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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

  const [bookingIndex, setBookingIndex] = useState<number | null>(null);

  const parseEventDate = (dateStr: string) => {
    try {
      // E.g. "Aug 20 • 6:00 PM UTC" — parse explicitly as UTC
      const [dayPart, timePart] = dateStr.split(" \u2022 ");
      const timeClean = timePart.replace(" UTC", "").trim();
      const currentYear = new Date().getFullYear();
      // Try current year first; if the date is in the past, use next year
      let startDate = new Date(`${dayPart} ${currentYear} ${timeClean} UTC`);
      if (isNaN(startDate.getTime()) || startDate < new Date()) {
        startDate = new Date(`${dayPart} ${currentYear + 1} ${timeClean} UTC`);
      }
      
      return {
        startIso: startDate.toISOString(),
        endIso: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(), // +1 hour
      };
    } catch {
      const now = new Date();
      return {
        startIso: now.toISOString(),
        endIso: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      };
    }
  };

  const handleBookSession = async (ev: any, index: number) => {
    const token = localStorage.getItem("calendar_token");
    if (!token) {
      showToast("Connect Google Calendar in the AI Dashboard first!", "info");
      setTimeout(scrollToBooking, 1500);
      return;
    }

    // Build a unique key for this event
    const eventKey = `${ev.title}__${ev.date}`;

    // Prevent duplicate booking
    if (bookedKeys.has(eventKey)) {
      showToast(`"${ev.title}" is already in your Google Calendar!`, "info");
      return;
    }

    setBookingIndex(index);
    try {
      const { startIso, endIso } = parseEventDate(ev.date);
      const res = await createGoogleCalendarEvent(token, {
        summary: ev.title,
        description: ev.sub,
        start: startIso,
        end: endIso,
      });

      if (res.success) {
        // Persist the booked key so it survives page refreshes
        const updated = new Set(bookedKeys).add(eventKey);
        setBookedKeys(updated);
        localStorage.setItem('cs_booked_events', JSON.stringify([...updated]));
        showToast(`"${ev.title}" added to your Google Calendar! ✓`, "success");
      } else {
        if (res.error?.includes("invalid authentication") || res.error?.includes("OAuth 2")) {
          showToast("Session expired — please reconnect your Calendar.", "error");
          localStorage.removeItem("calendar_token");
          setTimeout(scrollToBooking, 2000);
        } else {
          showToast("Booking failed: " + (res.error || "Unknown error."), "error");
        }
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setBookingIndex(null);
    }
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
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-8 right-8 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-500"
          style={{
            background: toast.type === 'success' ? 'rgba(20,40,25,0.95)' : toast.type === 'error' ? 'rgba(40,15,15,0.95)' : 'rgba(15,20,40,0.95)',
            borderColor: toast.type === 'success' ? 'rgba(212,252,121,0.4)' : toast.type === 'error' ? 'rgba(255,100,100,0.4)' : 'rgba(100,150,255,0.4)',
            animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '380px',
          }}
        >
          <span style={{ fontSize: '20px' }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p style={{ color: toast.type === 'success' ? '#d4fc79' : toast.type === 'error' ? '#ff8080' : '#80aaff', fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>
            {toast.message}
          </p>
        </div>
      )}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>

      <div className="sticky top-0 h-screen flex flex-col pt-24 md:pt-32 lg:pt-40 overflow-hidden bg-dark">

        {/* Heading */}
        <div className="max-w-7xl mx-auto px-8 w-full mb-8 flex-shrink-0">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-center leading-none">
            UPCOMING EVENTS
          </h2>
        </div>

        {/* Card stack */}
        <div className="relative max-w-7xl mx-auto px-8 w-full flex-1 min-h-0" style={{ maxHeight: "50vh" }}>
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
                    onClick={() => handleBookSession(ev, i)}
                    disabled={bookingIndex === i || bookedKeys.has(`${ev.title}__${ev.date}`)}
                    className={`flex-shrink-0 font-black px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 shadow-xl disabled:cursor-not-allowed ${
                      bookedKeys.has(`${ev.title}__${ev.date}`)
                        ? 'bg-[#d4fc79] text-black opacity-90 cursor-default'
                        : bookingIndex === i
                        ? 'bg-white/60 text-black opacity-60 cursor-wait'
                        : 'bg-white text-black hover:bg-brand'
                    }`}
                  >
                    {bookedKeys.has(`${ev.title}__${ev.date}`)
                      ? '✓ Added to Calendar'
                      : bookingIndex === i
                      ? 'Booking...'
                      : 'Book Session'}
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
                  background: i === activeIndex ? "#0066FF" : "rgba(255,255,255,0.2)",
                }}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}


