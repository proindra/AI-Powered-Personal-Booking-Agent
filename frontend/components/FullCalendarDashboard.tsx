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
  
  // New Event Modal State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [newEvent, setNewEvent] = useState({
    summary: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "10:00"
  });

  // View Mode State
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const loadEvents = async () => {
      const token = localStorage.getItem("calendar_token");
      if (!token) return;

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Buffer time span to get events overlapping the edge of the month/week
      const timeMin = new Date(year, month, -15).toISOString();
      const timeMax = new Date(year, month + 1, 15).toISOString();

      try {
        const data = await fetchGoogleCalendarEvents(token, timeMin, timeMax);
        setEvents(data);
      } catch (err: any) {
        if (err.message === "401") {
            alert("Your Calendar session expired tracking token. Please reconnect.");
            onDisconnect();
        }
        console.error("Failed to fetch calendar events:", err);
      }
    };
    loadEvents();
  }, [currentDate, refreshCount]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dateNum = currentDate.getDate();
  const dayOfWeek = currentDate.getDay();

  const gridCells = [];
  let totalRows = 5;

  if (viewMode === "month") {
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month padding
    for (let i = 0; i < firstDayOfWeek; i++) {
        gridCells.push({ day: "", empty: true, dateStr: "", isToday: false });
    }
    
    // Current month days
    const todayDateStr = new Date().toISOString().split("T")[0];
    for (let i = 1; i <= daysInMonth; i++) {
        const dStr = new Date(year, month, i, 12).toISOString().split("T")[0];
        const isToday = dStr === todayDateStr;
        gridCells.push({ day: i.toString(), empty: false, dateStr: dStr, isToday });
    }

    // Next month padding
    const totalCells = gridCells.length <= 35 ? 35 : 42;
    totalRows = totalCells / 7;
    while (gridCells.length < totalCells) {
        gridCells.push({ day: "", empty: true, dateStr: "", isToday: false });
    }
  } else {
    // Week Mode (7 days)
    totalRows = 1;
    const sunday = new Date(year, month, dateNum - dayOfWeek, 12);
    const todayDateStr = new Date().toISOString().split("T")[0];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i, 12);
      const dStr = d.toISOString().split("T")[0];
      const isToday = dStr === todayDateStr;
      gridCells.push({ 
        day: d.getDate().toString(), 
        empty: false, 
        dateStr: dStr, 
        isToday,
        longDayStr: d.toLocaleDateString([], { weekday: 'short', month: 'short' })
      });
    }
  }

  const currentLabelStr = viewMode === 'month' 
    ? currentDate.toLocaleDateString([], { month: "long", year: "numeric" })
    : `Week of ${new Date(year, month, dateNum - dayOfWeek).toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  
  const nextTime = () => {
    if (viewMode === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    }
  };

  const prevTime = () => {
    if (viewMode === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
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
            end: endIso
          });
          
          if (res.success) {
              setIsCreatingEvent(false);
              setNewEvent({ ...newEvent, summary: "", description: "" });
              setRefreshCount(c => c + 1);
          } else {
              if (res.error?.includes('invalid authentication') || res.error?.includes('OAuth 2')) {
                  alert("Your Google Calendar session has expired. Please reconnect.");
                  onDisconnect();
              } else {
                  alert("Failed to save event: " + (res.error || "Unknown"));
              }
          }
      }
    } catch (e) {
      alert("Invalid date/time format.");
    } finally {
      setIsSaving(false);
    }
  };


  // Hashed UI colors for event pills
  const getEventColorObj = (title: string = "") => {
    const palette = [
      { bg: 'bg-[#ff6b6b]', text: 'text-[#ff6b6b]', border: 'border-[#ff6b6b]' },
      { bg: 'bg-[#a370f7]', text: 'text-[#a370f7]', border: 'border-[#a370f7]' },
      { bg: 'bg-[#34d399]', text: 'text-[#34d399]', border: 'border-[#34d399]' },
      { bg: 'bg-[#38bdf8]', text: 'text-[#38bdf8]', border: 'border-[#38bdf8]' },
      { bg: 'bg-[#fcd34d]', text: 'text-[#fcd34d]', border: 'border-[#fcd34d]' }
    ];
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
  };

  const getEventsForDay = (dateStr: string) => {
    if (!dateStr) return [];
    return events.filter(e => {
        if (e.start?.date) return e.start.date === dateStr;
        if (e.start?.dateTime) return e.start.dateTime.startsWith(dateStr);
        return false;
    });
  };

  const formatTime = (isoVal: string) => {
    if (!isoVal) return "All day";
    try {
      if (!isoVal.includes('T')) return "All day"; // is just a date string
      return new Date(isoVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "All day";
    }
  };

  const formatDate = (isoVal: string) => {
    if (!isoVal) return "";
    try {
      return new Date(isoVal).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoVal;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#161a18] flex flex-col sm:flex-row overflow-hidden font-['Inter',sans-serif]">
      {/* ── Optional nested sidebar mimicking the image ── */}
      <div className="hidden sm:flex w-[80px] border-r border-white/5 bg-[#121614] flex-col items-center py-6 gap-8 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-[#d4fc79] flex items-center justify-center shadow-[0_0_15px_rgba(212,252,121,0.3)]">
          <span className="material-symbols-outlined text-black">calendar_month</span>
        </div>
        
        <div className="flex flex-col gap-6 w-full items-center text-[#55695e]">
          <button className="flex flex-col items-center gap-1 hover:text-[#d4fc79] transition-colors">
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#d4fc79] transition-colors relative">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d4fc79] rounded-r-full" />
            <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            <span className="text-[10px] font-medium">Calendar</span>
          </button>
        </div>
        
        <div className="mt-auto flex flex-col gap-6 w-full items-center text-[#55695e]">
          <button className="flex flex-col items-center gap-1 hover:text-[#ff6b6b] transition-colors" onClick={onDisconnect}>
            <span className="material-symbols-outlined text-[24px]">logout</span>
            <span className="text-[10px] font-medium">Disconnect</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-[#d4fc79] transition-colors" onClick={onBack}>
            <span className="material-symbols-outlined text-[24px]">close</span>
            <span className="text-[10px] font-medium">Close</span>
          </button>
        </div>
      </div>

      {/* ── Main Dashboard Area ── */}
      <div className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden p-6 gap-6">
        
        {/* Left/Center: Calendar Grid */}
        <div className="flex-1 flex flex-col bg-[#1d2320] rounded-[24px] border border-white/5 py-6 px-8 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 z-10 w-full shrink-0">
            <div className="flex items-center gap-4">
              <h1 className="text-[28px] font-bold text-white tracking-tight">{currentLabelStr}</h1>
              <button 
                className="px-4 py-2 rounded-xl bg-[#d4fc79] text-[#121614] text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(212,252,121,0.2)] hover:scale-105 transition-transform" 
                onClick={() => setIsCreatingEvent(true)}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New event
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-[#252c28] rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => setViewMode("month")} 
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${viewMode === 'month' ? 'bg-[#2e3631] text-white shadow' : 'text-[#889d91] hover:text-white'}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setViewMode("week")} 
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${viewMode === 'week' ? 'bg-[#2e3631] text-white shadow' : 'text-[#889d91] hover:text-white'}`}
                >
                  Week
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={prevTime} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#252c28] text-[#889d91] hover:text-white border border-white/5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button onClick={nextTime} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#252c28] text-[#889d91] hover:text-white border border-white/5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid Headers */}
          <div className="grid grid-cols-7 gap-4 mb-3 z-10 w-full shrink-0">
            {days.map(d => (
              <div key={d} className="text-center text-[13px] font-medium text-[#889d91]">{d}</div>
            ))}
          </div>

          {/* Grid Body */}
          <div 
            className="flex-1 grid grid-cols-7 gap-3 z-10 overflow-y-auto w-full custom-scrollbar pr-1" 
            style={{ 
              gridTemplateRows: viewMode === "month" ? `repeat(${totalRows}, minmax(100px, 1fr))` : `minmax(350px, 1fr)` 
            }}
          >
            {gridCells.map((cell, idx) => {
              const dayEvents = getEventsForDay(cell.dateStr);
              return (
                <div key={idx} className={`rounded-[16px] p-2 border transition-colors flex flex-col overflow-hidden ${cell.empty ? 'bg-transparent border-transparent' : 'bg-[#252c28] border-white/5 hover:border-white/10'} ${cell.isToday ? 'bg-[#29362c] border-[#d4fc79]/20' : ''}`}>
                  {!cell.empty && (
                    <>
                      <div className={`text-[12px] mb-1.5 pl-1 flex items-center gap-1 overflow-hidden shrink-0 ${cell.isToday ? 'text-[#d4fc79] font-bold' : 'text-[#889d91] font-medium'}`}>
                        {cell.day} 
                        {viewMode === 'week' && cell.longDayStr && <span className="opacity-60 truncate">({cell.longDayStr})</span>}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide py-1">
                        {dayEvents.map((evt, eIdx) => {
                          const c = getEventColorObj(evt.summary);
                          return (
                            <div 
                              key={eIdx}
                              onClick={() => setSelectedEvent(evt)}
                              className={`w-full bg-[#2a2933] px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#32313d] transition-colors relative shadow-[0_0_15px_rgba(0,0,0,0.1)] border ${c.border.replace('border-', 'border-')}/20 shrink-0`}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${c.bg} shrink-0`} />
                                <span className="text-[10px] text-white font-medium truncate leading-none">{evt.summary || '(No title)'}</span>
                              </div>
                              <div className={`text-[9px] ${c.text} font-medium pl-3 mt-0.5 opacity-80 truncate`}>
                                {formatTime(evt.start?.dateTime)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4fc79] opacity-[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

          {/* ── Active Event Modal Overlay ── */}
          {selectedEvent && !isCreatingEvent && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-[#222a25] rounded-[24px] border border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-[17px] font-bold text-white leading-tight pr-4">{selectedEvent.summary || '(No title)'}</h2>
                <button onClick={() => setSelectedEvent(null)} className="text-[#889d91] hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedEvent.description && (
                  <div className="text-[12px] text-white/70 max-h-[80px] overflow-y-auto mb-2 custom-scrollbar pr-2 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#889d91]">Time</span>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-[12px] bg-[#2a2d2a] px-2 py-1 rounded-md border border-white/5">{formatTime(selectedEvent.start?.dateTime || selectedEvent.start?.date)}</span>
                    <span className="text-[#889d91] text-[10px]">-</span>
                    <span className="text-[12px] bg-[#2a2d2a] px-2 py-1 rounded-md border border-white/5">{formatTime(selectedEvent.end?.dateTime || selectedEvent.end?.date)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#889d91]">Date</span>
                  <span className="text-[12px] text-white bg-[#2a2d2a] px-2 py-1 rounded-md border border-white/5 whitespace-nowrap">
                    {formatDate(selectedEvent.start?.dateTime || selectedEvent.start?.date)}
                  </span>
                </div>

                {selectedEvent.htmlLink && (
                  <div className="pt-3">
                    <button 
                      onClick={() => window.open(selectedEvent.htmlLink, '_blank')}
                      className="w-full py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] border border-white/10 text-[13px] font-bold transition-colors"
                    >
                      View in Google Calendar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Create New Event Modal Overlay ── */}
          {isCreatingEvent && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-[#222a25] rounded-[24px] border border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50 backdrop-blur-xl flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d4fc79]">event_note</span>
                  Create Schedule
                </h2>
                <button onClick={() => setIsCreatingEvent(false)} className="text-[#889d91] hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-[#889d91] font-medium ml-1">Title</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g., Weekly Sync" 
                  className="bg-[#1d2320] border border-white/10 rounded-xl px-4 py-2 text-[14px] text-white outline-none focus:border-[#d4fc79]/50 transition-colors"
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({...newEvent, summary: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-[#889d91] font-medium ml-1">Date</label>
                <input 
                  type="date" 
                  className="bg-[#1d2320] border border-white/10 rounded-xl px-4 py-2 text-[14px] text-white outline-none focus:border-[#d4fc79]/50 transition-colors"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[12px] text-[#889d91] font-medium ml-1">Start Time</label>
                  <input 
                    type="time" 
                    className="bg-[#1d2320] border border-white/10 rounded-xl px-4 py-2 text-[14px] text-white outline-none focus:border-[#d4fc79]/50 transition-colors"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[12px] text-[#889d91] font-medium ml-1">End Time</label>
                  <input 
                    type="time" 
                    className="bg-[#1d2320] border border-white/10 rounded-xl px-4 py-2 text-[14px] text-white outline-none focus:border-[#d4fc79]/50 transition-colors"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-[#889d91] font-medium ml-1">Notes / Description</label>
                <textarea 
                  placeholder="Add details..." 
                  className="bg-[#1d2320] border border-white/10 rounded-xl px-4 py-2 text-[14px] text-white outline-none focus:border-[#d4fc79]/50 transition-colors h-20 resize-none"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                />
              </div>

              <div className="pt-3">
                <button 
                  onClick={handleSaveEvent}
                  disabled={isSaving || !newEvent.summary}
                  className="w-full py-3 rounded-xl bg-[#d4fc79] text-[#121614] text-[14px] font-bold shadow-[0_0_15px_rgba(212,252,121,0.2)] hover:shadow-[0_0_25px_rgba(212,252,121,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSaving ? (
                     <>
                        <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                        Saving...
                     </>
                  ) : "Save Event"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto hidden xl:flex custom-scrollbar pr-2">
          
          {/* Mini Calendar */}
          <div className="bg-[#1d2320] rounded-[24px] border border-white/5 px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-white">{currentLabelStr.split(' ')[0]} {currentLabelStr.split(' ')[1]}</h3>
              <div className="flex gap-1 text-[#889d91]">
                <span onClick={prevTime} className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white">chevron_left</span>
                <span onClick={nextTime} className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white">chevron_right</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-y-2 text-center text-[12px]">
              {["S","M","T","W","T","F","S"].map((c, i) => (
                <div key={i} className="text-[#889d91] mb-2 font-medium">{c}</div>
              ))}
              {/* Note: The mini calendar usually just shows a month strictly. We'll render exactly 35 or 42 cells representing the current month context */}
              {Array.from({length: 42}).map((_, i) => {
                const miniYear = currentDate.getFullYear();
                const miniMonth = currentDate.getMonth();
                const firstDay = new Date(miniYear, miniMonth, 1).getDay();
                const daysInM = new Date(miniYear, miniMonth + 1, 0).getDate();
                const d = i - firstDay + 1;
                
                if (d <= 0 || d > daysInM) return <div key={i} className="py-1" />;
                const isSelected = viewMode === "week" && (
                   d >= currentDate.getDate() - currentDate.getDay() &&
                   d <= currentDate.getDate() - currentDate.getDay() + 6
                ) || (viewMode === "month" && d === new Date().getDate());

                return (
                  <div key={i} className={`py-0.5 mx-0.5 rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-[#d4fc79] text-[#121614] font-bold shadow-[0_0_10px_rgba(212,252,121,0.4)]' : 'text-white hover:bg-white/10'}`}>
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resource Consumption Widget */}
          <div className="bg-gradient-to-br from-[#242d28] to-[#1a231e] rounded-[24px] border border-[#d4fc79]/20 px-6 py-6 shadow-xl relative overflow-hidden shrink-0">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#d4fc79] opacity-10 rounded-full blur-[30px]" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-semibold text-white">Resource Consumption</h3>
              <span className="material-symbols-outlined text-[16px] text-[#889d91]">more_horiz</span>
            </div>
            
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#323d38] border-t-[#d4fc79] border-r-[#d4fc79] flex items-center justify-center transform -rotate-45 relative shrink-0">
                    <span className="transform rotate-45 text-[14px] font-bold text-white">{events.length * 3}%</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between bg-[#1d2420] px-3 py-2 rounded-[10px] border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[13px] text-[#d4fc79]">task_alt</span>
                        <span className="text-[11px] text-white">Events Total</span>
                      </div>
                      <span className="text-[12px] font-bold text-white">{events.length}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* My Events Category List */}
          <div className="bg-[#1d2320] rounded-[24px] border border-white/5 px-6 py-6 shadow-xl flex-1 shrink-0">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-semibold text-white">My event categories</h3>
              <span className="material-symbols-outlined text-[16px] text-[#889d91] cursor-pointer">expand_less</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b] border-[2px] border-[#2c2020] shadow-[0_0_8px_rgba(255,107,107,0.3)]" />
                <span className="text-[12px] text-white/80 font-medium">Work / Meetings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] border-[2px] border-[#1f2933] shadow-[0_0_8px_rgba(56,189,248,0.3)]" />
                <span className="text-[12px] text-white/80 font-medium">Synced Events</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#a370f7] border-[2px] border-[#292233] shadow-[0_0_8px_rgba(163,112,247,0.3)]" />
                <span className="text-[12px] text-white/80 font-medium">Personal Time</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
