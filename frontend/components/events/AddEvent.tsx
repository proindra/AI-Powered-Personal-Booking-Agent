"use client";
import { useState } from "react";
import { createGoogleCalendarEvent } from "@/lib/auth/google";
import type { EventItem } from "./EventStack";

const STORAGE_KEY = "4d_workspace_events";

const DEFAULT_EVENTS: EventItem[] = [
  {
    date: "Aug 20 \u2022 6:00 PM UTC",
    title: "Design Systems for Scale",
    sub: "[Live + Replay] \u2014 With Adam Cooper, Lead Product Designer at Wise",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Workshop",
  },
  {
    date: "Sep 5 \u2022 4:00 PM UTC",
    title: "The Future of AI in Product",
    sub: "[Live + Replay] \u2014 With Sarah Chen, Principal Architect at DeepMind",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Conference",
  },
  {
    date: "Sep 18 \u2022 7:00 PM UTC",
    title: "Kinetic Leadership Masterclass",
    sub: "[Live + Replay] \u2014 With Marcus Thorne, Head of Design Ops at Stripe",
    img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Lecture",
  },
  {
    date: "Oct 2 \u2022 5:00 PM UTC",
    title: "Scaling Startups to Unicorns",
    sub: "[Live + Replay] \u2014 With Elon Musk, CEO at Tesla & SpaceX",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    tag: "Conference",
  },
];

const TAGS = ["Workshop", "Conference", "Lecture", "Masterclass", "Seminar", "Hackathon"];

const TAG_COLORS: Record<string, string> = {
  Workshop: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Conference: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Lecture: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Masterclass: "bg-green-500/20 text-green-300 border-green-500/30",
  Seminar: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Hackathon: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1920&q=80",
];

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [calendarStatus, setCalendarStatus] = useState<'idle' | 'syncing' | 'synced' | 'no-token' | 'error'>('idle');
  const [tag, setTag] = useState(TAGS[0]);
  const [sub, setSub] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    // Reset to defaults - remove any added events from storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
    window.dispatchEvent(new CustomEvent("cs:reset-events", { detail: DEFAULT_EVENTS }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    setSaving(true);
    setCalendarStatus('idle');

    // Build the date string matching our display format: "Aug 20 • 6:00 PM UTC"
    const d = new Date(`${date}T${time}:00Z`);
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    const timeFmt = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });
    const dateStr = `${monthDay} \u2022 ${timeFmt} UTC`;
    const endIso = new Date(d.getTime() + 60 * 60 * 1000).toISOString(); // +1 hour

    const finalImg = imgUrl.trim() || (selectedStock !== null ? STOCK_IMAGES[selectedStock] : STOCK_IMAGES[0]);

    const newEvent: EventItem = {
      date: dateStr,
      title,
      sub: sub || "[Live + Replay]",
      img: finalImg,
      tag,
    };

    // 1. Add to the upcoming events stack live
    window.dispatchEvent(new CustomEvent("cs:add-event", { detail: newEvent }));

    // 2. Also push to Google Calendar if the user is connected
    const token = localStorage.getItem("calendar_token");
    if (token) {
      setCalendarStatus('syncing');
      const res = await createGoogleCalendarEvent(token, {
        summary: title,
        description: sub || `[Live + Replay] — ${tag} event`,
        start: d.toISOString(),
        end: endIso,
      });
      if (res.success) {
        setCalendarStatus('synced');
      } else if (res.error?.includes('invalid authentication') || res.error?.includes('OAuth 2')) {
        setCalendarStatus('error');
        localStorage.removeItem('calendar_token');
      } else {
        setCalendarStatus('error');
      }
    } else {
      setCalendarStatus('no-token');
    }

    setSaving(false);
    setSuccess(true);
    setTitle("");
    setSub("");
    setDate("");
    setTime("");
    setImgUrl("");
    setSelectedStock(null);
    setTimeout(() => { setSuccess(false); setCalendarStatus('idle'); }, 5000);
  };

  return (
    <section className="py-24 px-8 border-t border-white/10" id="add-event">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-14">
          <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs mb-4 block">
            Event Management
          </span>
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
              ADD TO<br />
              <span className="text-brand">UPCOMING</span>
            </h2>
            <button
              onClick={handleReset}
              className="text-white/40 text-xs uppercase tracking-widest font-bold border border-white/10 px-5 py-2.5 rounded-full hover:border-white/30 hover:text-white/70 transition-all"
            >
              Reset to defaults
            </button>
          </div>
          <p className="text-white/50 text-base mt-6 max-w-xl">
            Add a new event below — it will appear live in the{" "}
            <a href="#upcoming-events" className="text-brand underline underline-offset-4">Upcoming Events</a> stack
            and stays saved across page refreshes.
          </p>
        </div>

        {/* Main form card */}
        <form
          onSubmit={handleSubmit}
          className="brutalist-card p-10 lg:p-14 relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {/* Left column */}
            <div className="space-y-10">
              {/* Title */}
              <div className="relative">
                <input
                  id="ev-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none"
                />
                <label
                  htmlFor="ev-title"
                  className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85"
                >
                  Event Title *
                </label>
              </div>

              {/* Speaker / sub */}
              <div className="relative">
                <input
                  id="ev-sub"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none"
                />
                <label
                  htmlFor="ev-sub"
                  className="absolute left-0 top-4 text-white/60 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85"
                >
                  Speaker / Description
                </label>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                  <input
                    id="ev-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-base outline-none [color-scheme:dark]"
                  />
                  <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mt-1">Date *</label>
                </div>
                <div className="relative">
                  <input
                    id="ev-time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-base outline-none [color-scheme:dark]"
                  />
                  <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mt-1">Time (UTC) *</label>
                </div>
              </div>

              {/* Tag selector */}
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-3">Event Type</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border rounded-full transition-all ${
                        tag === t
                          ? (TAG_COLORS[t] || "bg-brand/20 text-brand border-brand/40")
                          : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: image picker */}
            <div className="space-y-6">
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Cover Image URL (optional)</p>
                <input
                  id="ev-img"
                  type="url"
                  value={imgUrl}
                  onChange={(e) => { setImgUrl(e.target.value); setSelectedStock(null); }}
                  placeholder="https://..."
                  className="w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-base placeholder-white/20 outline-none"
                />
              </div>

              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Or pick a stock background</p>
              <div className="grid grid-cols-3 gap-3">
                {STOCK_IMAGES.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedStock(i); setImgUrl(""); }}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedStock === i ? "border-brand scale-[1.04] shadow-[0_0_20px_rgba(0,102,255,0.4)]" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Stock ${i + 1}`} className="w-full h-full object-cover" />
                    {selectedStock === i && (
                      <div className="absolute inset-0 bg-brand/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[20px]">check_circle</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Preview */}
              {(imgUrl || selectedStock !== null) && (
                <div className="relative h-32 rounded-xl overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl || STOCK_IMAGES[selectedStock!]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = STOCK_IMAGES[0])}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold uppercase tracking-widest opacity-70">Preview</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-14 pt-10 border-t border-white/10 flex items-center gap-6">
            <button
              type="submit"
              disabled={saving || !title || !date || !time}
              className="glow-btn bg-brand text-black px-12 py-5 uppercase font-black tracking-[0.2em] text-sm hover:bg-white transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_30px_rgba(0,102,255,0.3)]"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  ADD TO STACK
                  <span className="material-symbols-outlined">add_circle</span>
                </>
              )}
            </button>

            {success && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Event added to stack!
                </div>

                {calendarStatus === 'syncing' && (
                  <div className="flex items-center gap-2 text-blue-400 text-xs uppercase tracking-widest font-semibold">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
                    Syncing to Google Calendar...
                  </div>
                )}
                {calendarStatus === 'synced' && (
                  <div className="flex items-center gap-2 text-[#d4fc79] text-xs uppercase tracking-widest font-semibold">
                    <span className="material-symbols-outlined text-[16px]">event_available</span>
                    Saved to Google Calendar ✓
                  </div>
                )}
                {calendarStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-xs uppercase tracking-widest font-semibold">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    Calendar sync failed — session may have expired. Please reconnect.
                  </div>
                )}
                {calendarStatus === 'no-token' && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-semibold">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Connect Google Calendar in the AI Dashboard to auto-sync events.
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
