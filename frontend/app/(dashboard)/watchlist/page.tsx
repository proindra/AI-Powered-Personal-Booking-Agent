"use client";

import { useCalendar, CalendarEvent } from "@/lib/calendar/useCalendar";
import { requestCalendarAccess } from "@/lib/auth/google";
import { useState } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getEventStart(ev: CalendarEvent): Date | null {
  const raw = ev.start?.dateTime ?? ev.start?.date;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function getEventEnd(ev: CalendarEvent): Date | null {
  const raw = ev.end?.dateTime ?? ev.end?.date;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function isAllDay(ev: CalendarEvent) {
  return !ev.start?.dateTime;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatCountdown(start: Date): string {
  const diff = start.getTime() - Date.now();
  if (diff <= 0) return "Now";
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `In ${days}d ${hrs % 24}h`;
  if (hrs > 0) return `In ${hrs}h ${mins % 60}m`;
  return `In ${mins}m`;
}

function isUrgent(start: Date): boolean {
  return start.getTime() - Date.now() < 24 * 60 * 60 * 1000; // within 24h
}

function isPast(end: Date | null): boolean {
  if (!end) return false;
  return end.getTime() < Date.now();
}

// Deterministic color per event title
const COLORS = [
  { dot: "bg-brand", border: "border-brand", text: "text-brand", glow: "shadow-[0_0_14px_rgba(0,102,255,0.8)]", pill: "bg-brand/10 border-brand/30 text-brand" },
  { dot: "bg-purple-400", border: "border-purple-400", text: "text-purple-400", glow: "shadow-[0_0_14px_rgba(192,132,252,0.6)]", pill: "bg-purple-400/10 border-purple-400/30 text-purple-400" },
  { dot: "bg-emerald-400", border: "border-emerald-400", text: "text-emerald-400", glow: "shadow-[0_0_14px_rgba(52,211,153,0.6)]", pill: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" },
  { dot: "bg-amber-400", border: "border-amber-400", text: "text-amber-400", glow: "shadow-[0_0_14px_rgba(251,191,36,0.6)]", pill: "bg-amber-400/10 border-amber-400/30 text-amber-400" },
  { dot: "bg-rose-400", border: "border-rose-400", text: "text-rose-400", glow: "shadow-[0_0_14px_rgba(251,113,133,0.6)]", pill: "bg-rose-400/10 border-rose-400/30 text-rose-400" },
];

function getColor(title: string = "") {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonNode() {
  return (
    <div className="relative z-10">
      <div className="absolute -left-[37px] md:-left-[69px] top-8 w-5 h-5 rounded-full bg-white/10 animate-pulse" />
      <div className="brutalist-card p-8 space-y-4 animate-pulse">
        <div className="flex justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-6 w-3/4 bg-white/10 rounded" />
          </div>
          <div className="h-16 w-24 bg-white/10 rounded shrink-0" />
        </div>
        <div className="h-4 w-full bg-white/[0.06] rounded" />
        <div className="h-4 w-2/3 bg-white/[0.06] rounded" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WatchlistPage() {
  const { events, loading, error, connected, refetch } = useCalendar();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    requestCalendarAccess(
      () => { setConnecting(false); refetch(); },
      () => setConnecting(false)
    );
  };

  // Sort: upcoming first, then past
  const sorted = [...events].sort((a, b) => {
    const da = getEventStart(a)?.getTime() ?? 0;
    const db = getEventStart(b)?.getTime() ?? 0;
    return da - db;
  });

  const upcoming = sorted.filter((e) => !isPast(getEventEnd(e)));
  const past = sorted.filter((e) => isPast(getEventEnd(e)));
  const display = [...upcoming, ...past];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs mb-3 block">
            Google Calendar
          </span>
          <h2 className="font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none text-white mb-3">
            MY<br /><span className="text-brand">WATCHLIST</span>
          </h2>
          <p className="text-white/60 text-base">Your upcoming events pulled live from Google Calendar.</p>
        </div>

        {connected && (
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-all text-[11px] font-bold uppercase tracking-widest shrink-0"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Refresh
          </button>
        )}
      </div>

      {/* ── Not connected ── */}
      {!connected && !loading && (
        <div className="brutalist-card p-12 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-brand/10 border border-brand/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-brand text-[32px]">calendar_month</span>
          </div>
          <div>
            <h3 className="font-black text-2xl uppercase tracking-tighter text-white mb-2">
              Connect Your Calendar
            </h3>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              Link Google Calendar to see your upcoming events, deadlines, and meetings here in real time.
            </p>
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="glow-btn bg-brand text-white px-8 py-3 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.3)] disabled:opacity-50"
          >
            {connecting ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Connecting...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">add_link</span> Connect Google Calendar</>
            )}
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="brutalist-card p-6 border-red-500/20 flex items-start gap-4">
          <span className="material-symbols-outlined text-red-400 text-[20px] shrink-0 mt-0.5">error</span>
          <div>
            <p className="text-red-400 font-bold text-sm uppercase tracking-widest mb-1">Calendar Error</p>
            <p className="text-white/60 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="relative pl-8 md:pl-16 ml-4 md:ml-8 space-y-10">
          <div className="absolute top-0 bottom-0 left-[1px] md:left-[3px] w-[2px] bg-gradient-to-b from-brand via-white/20 to-transparent rounded-full" />
          {[1, 2, 3].map((i) => <SkeletonNode key={i} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && connected && display.length === 0 && (
        <div className="brutalist-card p-12 flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-white/20 text-[48px]">event_available</span>
          <p className="text-white/60 font-bold uppercase tracking-widest text-sm">No upcoming events found</p>
          <p className="text-white/40 text-xs max-w-xs">Your Google Calendar looks clear. Events you create will appear here automatically.</p>
        </div>
      )}

      {/* ── Timeline ── */}
      {!loading && display.length > 0 && (
        <div className="relative pl-8 md:pl-16 ml-4 md:ml-8 space-y-10">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-[1px] md:left-[3px] w-[2px] bg-gradient-to-b from-brand via-white/20 to-transparent rounded-full shadow-[0_0_12px_rgba(0,102,255,0.5)]" />

          {display.map((ev) => {
            const start = getEventStart(ev);
            const end = getEventEnd(ev);
            const past = isPast(end);
            const urgent = !past && start ? isUrgent(start) : false;
            const allDay = isAllDay(ev);
            const color = getColor(ev.summary);

            return (
              <div
                key={ev.id}
                className={`relative z-10 group transition-all duration-500 ${past ? "opacity-50 hover:opacity-80" : ""}`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[37px] md:-left-[69px] top-8 w-5 h-5 rounded-full bg-dark border-[3px] group-hover:scale-125 transition-all duration-300 flex items-center justify-center
                    ${past ? "border-white/20" : urgent ? "border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" : `${color.border} ${color.glow}`}`}
                >
                  {urgent && !past && (
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  )}
                  {!urgent && !past && (
                    <div className={`w-2 h-2 rounded-full ${color.dot}`} />
                  )}
                </div>

                {/* Card */}
                <div className={`brutalist-card p-6 md:p-8 relative overflow-hidden group/card ${urgent ? "border-red-500/20" : ""}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${urgent ? "from-red-500/5" : "from-brand/5"} to-transparent`} />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4 relative z-10">
                    {/* Left: tags + title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {/* Status tag */}
                        {past ? (
                          <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                            Past
                          </span>
                        ) : urgent ? (
                          <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest border border-red-500/30 animate-pulse flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">timer</span>
                            Upcoming Soon
                          </span>
                        ) : (
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${color.pill}`}>
                            Upcoming
                          </span>
                        )}
                        {/* All-day badge */}
                        {allDay && (
                          <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                            All Day
                          </span>
                        )}
                      </div>

                      <h3 className={`text-[22px] md:text-[26px] font-black uppercase tracking-tighter leading-tight ${past ? "text-white/50 line-through decoration-white/20" : "text-white"}`}>
                        {ev.summary || "(No title)"}
                      </h3>

                      {ev.location && (
                        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          {ev.location}
                        </p>
                      )}
                    </div>

                    {/* Right: date/time box */}
                    {start && (
                      <div className={`text-left md:text-right flex-shrink-0 p-4 border ${past ? "border-white/[0.06] bg-white/[0.02]" : "border-white/[0.08] bg-white/[0.03]"}`}>
                        <div className={`text-[26px] font-black ${past ? "text-white/40" : color.text}`}>
                          {formatDay(start)}
                        </div>
                        {!allDay && (
                          <div className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
                            {formatTime(start)}
                            {end && !isPast(end) && ` — ${formatTime(end)}`}
                          </div>
                        )}
                        {!past && (
                          <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${urgent ? "text-red-400" : "text-white/50"}`}>
                            {formatCountdown(start)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {ev.description && (
                    <p className="text-white/60 text-sm mb-6 relative z-10 leading-relaxed max-w-2xl line-clamp-2">
                      {ev.description}
                    </p>
                  )}

                  {/* Footer actions */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-5 relative z-10 gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {allDay
                        ? "All day event"
                        : start && end
                        ? `${formatTime(start)} – ${formatTime(end)}`
                        : start
                        ? formatTime(start)
                        : "No time set"}
                    </div>

                    {ev.htmlLink && (
                      <a
                        href={ev.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-colors ${past ? "text-white/30 hover:text-white/60" : `${color.text} hover:text-white`}`}
                      >
                        Open in Calendar
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer tip ── */}
      {connected && !loading && (
        <div className="px-6 py-5 border border-white/[0.06] bg-white/[0.02] flex gap-4 items-center">
          <div className="w-9 h-9 bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-brand text-[18px]">sync</span>
          </div>
          <p className="text-[13px] text-white/60 leading-relaxed font-medium">
            Showing <span className="text-white font-bold">{upcoming.length} upcoming</span> and{" "}
            <span className="text-white/70 font-bold">{past.length} past</span> events from your Google Calendar.
            Events update when you hit Refresh.
          </p>
        </div>
      )}
    </div>
  );
}
