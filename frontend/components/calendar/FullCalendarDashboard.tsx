"use client";
import React, { useState, useEffect } from "react";
import { fetchGoogleCalendarEvents, createGoogleCalendarEvent } from "@/lib/auth/google";

interface FullCalendarDashboardProps {
  onBack: () => void;
  onDisconnect: () => void;
}

export default function FullCalendarDashboard({ onBack, onDisconnect }: FullCalendarDashboardProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    summary: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const token = localStorage.getItem("calendar_token");
    setIsConnected(!!token);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      const token = localStorage.getItem("calendar_token");
      if (!token) return;
      setIsLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const timeMin = new Date(year, month, -15).toISOString();
      const timeMax = new Date(year, month + 1, 15).toISOString();
      try {
        const data = await fetchGoogleCalendarEvents(token, timeMin, timeMax);
        setEvents(data);
      } catch (err: any) {
        if (err.message === "401") {
          onDisconnect();
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [currentDate, refreshCount]);

  // ── Calendar grid logic ──────────────────────────────────────────────────
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dateNum = currentDate.getDate();
  const dayOfWeek = currentDate.getDay();

  const gridCells: {
    day: string;
    empty: boolean;
    dateStr: string;
    isToday: boolean;
    longDayStr?: string;
  }[] = [];

  let totalRows = 5;
  const todayDateStr = new Date().toISOString().split("T")[0];

  if (viewMode === "month") {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++)
      gridCells.push({ day: "", empty: true, dateStr: "", isToday: false });
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = new Date(year, month, i, 12).toISOString().split("T")[0];
      gridCells.push({ day: i.toString(), empty: false, dateStr: dStr, isToday: dStr === todayDateStr });
    }
    // Always use 42 cells (6 rows) so the last row never overflows
    totalRows = 6;
    while (gridCells.length < 42)
      gridCells.push({ day: "", empty: true, dateStr: "", isToday: false });
  } else {
    totalRows = 1;
    const sunday = new Date(year, month, dateNum - dayOfWeek, 12);
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i, 12);
      const dStr = d.toISOString().split("T")[0];
      gridCells.push({
        day: d.getDate().toString(),
        empty: false,
        dateStr: dStr,
        isToday: dStr === todayDateStr,
        longDayStr: d.toLocaleDateString([], { weekday: "short", month: "short" }),
      });
    }
  }

  const currentLabelStr =
    viewMode === "month"
      ? currentDate.toLocaleDateString([], { month: "long", year: "numeric" })
      : `Week of ${new Date(year, month, dateNum - dayOfWeek).toLocaleDateString([], { month: "short", day: "numeric" })}`;

  const nextTime = () => {
    if (viewMode === "month")
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  const prevTime = () => {
    if (viewMode === "month")
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const handleSaveEvent = async () => {
    if (!newEvent.summary || !newEvent.date || !newEvent.startTime || !newEvent.endTime) return;
    setIsSaving(true);
    try {
      const startIso = new Date(`${newEvent.date}T${newEvent.startTime}:00`).toISOString();
      const endIso = new Date(`${newEvent.date}T${newEvent.endTime}:00`).toISOString();
      const token = localStorage.getItem("calendar_token");
      if (token) {
        const res = await createGoogleCalendarEvent(token, {
          summary: newEvent.summary,
          description: newEvent.description,
          start: startIso,
          end: endIso,
        });
        if (res.success) {
          setIsCreatingEvent(false);
          setNewEvent({ ...newEvent, summary: "", description: "" });
          setRefreshCount((c) => c + 1);
        } else {
          if (res.error?.includes("invalid authentication") || res.error?.includes("OAuth 2")) {
            onDisconnect();
          }
        }
      }
    } catch {
      // invalid date/time
    } finally {
      setIsSaving(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const EVENT_COLORS = [
    { dot: "bg-brand", pill: "bg-brand/15 border-brand/30", text: "text-brand" },
    { dot: "bg-purple-400", pill: "bg-purple-400/15 border-purple-400/30", text: "text-purple-400" },
    { dot: "bg-emerald-400", pill: "bg-emerald-400/15 border-emerald-400/30", text: "text-emerald-400" },
    { dot: "bg-amber-400", pill: "bg-amber-400/15 border-amber-400/30", text: "text-amber-400" },
    { dot: "bg-rose-400", pill: "bg-rose-400/15 border-rose-400/30", text: "text-rose-400" },
  ];

  const getColor = (title: string = "") => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
    return EVENT_COLORS[Math.abs(hash) % EVENT_COLORS.length];
  };

  const getEventsForDay = (dateStr: string) => {
    if (!dateStr) return [];
    return events.filter((e) => {
      if (e.start?.date) return e.start.date === dateStr;
      if (e.start?.dateTime) return e.start.dateTime.startsWith(dateStr);
      return false;
    });
  };

  const formatTime = (isoVal: string) => {
    if (!isoVal || !isoVal.includes("T")) return "All day";
    try {
      return new Date(isoVal).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "All day";
    }
  };

  const formatDate = (isoVal: string) => {
    if (!isoVal) return "";
    try {
      return new Date(isoVal).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return isoVal;
    }
  };

  // ── Not connected state ──────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-8 px-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-brand text-[40px]">calendar_month</span>
          </div>
          <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs mb-4 block">
            Calendar Sync
          </span>
          <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-white mb-4">
            CONNECT YOUR<br />
            <span className="text-brand">CALENDAR</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-8">
            Link your Google Calendar to view, create, and manage events directly from the workspace.
          </p>
          <button
            onClick={() => {
              import("@/lib/auth/google").then(({ requestCalendarAccess }) => {
                requestCalendarAccess(
                  () => { setIsConnected(true); setRefreshCount((c) => c + 1); },
                  () => {}
                );
              });
            }}
            className="glow-btn bg-brand text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(0,102,255,0.3)] flex items-center gap-3 mx-auto"
          >
            <span className="material-symbols-outlined text-[20px]">add_link</span>
            Connect Google Calendar
          </button>
        </div>
      </div>
    );
  }

  // ── Connected calendar view ──────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col gap-0 overflow-hidden">

      {/* ── Page Header ── */}
      <div className="shrink-0 mb-8">
        <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs mb-3 block">
          Google Calendar
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-white flex items-baseline gap-3">
            {currentLabelStr.split(" ")[0]}
            <span className="text-brand">{currentLabelStr.split(" ").slice(1).join(" ")}</span>
          </h2>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* View toggle */}
            <div className="flex bg-white/[0.04] border border-white/[0.08] p-1">
              {(["month", "week"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all ${
                    viewMode === v
                      ? "bg-brand text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-1">
              <button
                onClick={prevTime}
                className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                onClick={nextTime}
                className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* New event */}
            <button
              onClick={() => setIsCreatingEvent(true)}
              className="glow-btn bg-brand text-white px-5 py-2 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.3)]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Event
            </button>

            {/* Disconnect */}
            <button
              onClick={onDisconnect}
              className="px-4 py-2 border border-white/[0.08] text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">link_off</span>
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* ── Calendar Grid ── */}
      <div className="flex-1 min-h-0 brutalist-card overflow-hidden flex flex-col">

        {/* Loading bar */}
        {isLoading && (
          <div className="h-[2px] w-full bg-white/5 shrink-0">
            <div className="h-full bg-brand animate-pulse w-1/2 mx-auto" />
          </div>
        )}

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/[0.06] shrink-0">
          {days.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-[11px] font-black uppercase tracking-widest text-white/60 border-r border-white/[0.04] last:border-r-0"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div
          className="flex-1 grid grid-cols-7 overflow-y-auto overflow-x-hidden"
          style={{
            gridTemplateRows:
              viewMode === "month"
                ? `repeat(${totalRows}, 1fr)`
                : "minmax(300px, 1fr)",
          }}
        >
          {gridCells.map((cell, idx) => {
            const dayEvents = getEventsForDay(cell.dateStr);
            const isWeekend = idx % 7 === 0 || idx % 7 === 6;

            return (
              <div
                key={idx}
                className={`border-r border-b border-white/[0.04] last:border-r-0 flex flex-col min-h-0 transition-colors group/cell ${
                  cell.empty
                    ? "bg-transparent"
                    : isWeekend
                    ? "bg-white/[0.01]"
                    : "bg-transparent hover:bg-white/[0.02]"
                } ${cell.isToday ? "bg-brand/[0.06] border-brand/20" : ""}`}
              >
                {!cell.empty && (
                  <>
                    {/* Day number */}
                    <div className="px-2 pt-2 pb-1 shrink-0">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-[11px] font-black transition-all ${
                          cell.isToday
                            ? "bg-brand text-white shadow-[0_0_12px_rgba(0,102,255,0.6)]"
                            : "text-white/70 group-hover/cell:text-white"
                        }`}
                      >
                        {cell.day}
                      </span>
                      {viewMode === "week" && cell.longDayStr && (
                        <span className="text-[9px] text-white/25 font-bold uppercase tracking-widest ml-1">
                          {cell.longDayStr}
                        </span>
                      )}
                    </div>

                    {/* Events — strictly clipped inside the cell */}
                    <div className="flex-1 overflow-hidden px-1 pb-1 flex flex-col gap-[3px] min-h-0">
                      {dayEvents.slice(0, 3).map((evt, eIdx) => {
                        const c = getColor(evt.summary);
                        return (
                          <button
                            key={eIdx}
                            onClick={() => setSelectedEvent(evt)}
                            className={`w-full text-left px-1.5 py-[3px] border text-[9px] font-bold leading-tight flex items-center gap-1 min-w-0 transition-opacity hover:opacity-80 shrink-0 ${c.pill} ${c.text}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${c.dot} shrink-0`} />
                            <span className="truncate">{evt.summary || "(No title)"}</span>
                          </button>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-white/30 font-bold px-1.5 shrink-0">
                          +{dayEvents.length - 3} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Event Detail Modal ── */}
      {selectedEvent && !isCreatingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="relative z-10 w-full max-w-[400px] brutalist-card p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-bold text-brand uppercase tracking-[0.3em] text-[10px] mb-2 block">
                  Event Details
                </span>
                <h3 className="font-black text-xl uppercase tracking-tighter text-white leading-tight">
                  {selectedEvent.summary || "(No title)"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/30 hover:text-white transition-colors ml-4 shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 border-t border-white/[0.06] pt-6">
              {selectedEvent.description && (
                <p className="text-white/60 text-sm leading-relaxed">{selectedEvent.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">Date</span>
                <span className="text-sm font-bold text-white">
                  {formatDate(selectedEvent.start?.dateTime || selectedEvent.start?.date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">Time</span>
                <span className="text-sm font-bold text-white">
                  {formatTime(selectedEvent.start?.dateTime)} — {formatTime(selectedEvent.end?.dateTime || selectedEvent.end?.date)}
                </span>
              </div>
            </div>

            {selectedEvent.htmlLink && (
              <button
                onClick={() => window.open(selectedEvent.htmlLink, "_blank")}
                className="mt-6 w-full glow-btn bg-brand text-white py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                Open in Google Calendar
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Create Event Modal ── */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreatingEvent(false)} />
          <div className="relative z-10 w-full max-w-[440px] brutalist-card p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="font-bold text-brand uppercase tracking-[0.3em] text-[10px] mb-2 block">
                  New Event
                </span>
                <h3 className="font-black text-xl uppercase tracking-tighter text-white">
                  Create Schedule
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder=" "
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-3 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-base placeholder-transparent outline-none"
                />
                <label className="absolute left-0 top-3 text-white/40 uppercase font-bold tracking-widest text-[10px] transition-all pointer-events-none peer-focus:-translate-y-5 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-5">
                  Event Title *
                </label>
              </div>

              {/* Date */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 px-0 text-white focus:border-brand outline-none transition-colors text-sm [color-scheme:dark]"
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-6">
                {(["startTime", "endTime"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">
                      {field === "startTime" ? "Start" : "End"} Time *
                    </label>
                    <input
                      type="time"
                      value={newEvent[field]}
                      onChange={(e) => setNewEvent({ ...newEvent, [field]: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-white/20 py-3 px-0 text-white focus:border-brand outline-none transition-colors text-sm [color-scheme:dark]"
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="relative">
                <textarea
                  placeholder=" "
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-3 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-base placeholder-transparent outline-none resize-none"
                />
                <label className="absolute left-0 top-3 text-white/40 uppercase font-bold tracking-widest text-[10px] transition-all pointer-events-none peer-focus:-translate-y-5 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-5">
                  Notes / Description
                </label>
              </div>
            </div>

            <button
              onClick={handleSaveEvent}
              disabled={isSaving || !newEvent.summary}
              className="mt-8 w-full glow-btn bg-brand text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,102,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand disabled:hover:text-white"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  Save Event
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
