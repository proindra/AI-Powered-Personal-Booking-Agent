"use client";
import React from "react";

interface Slot {
  start: string;
  end: string;
}

interface CalendarDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  calendarConnected: boolean;
  connectCalendar: () => void;
  disconnectCalendar: () => void;
  calendarState?: {
    bookedSlots: Slot[];
    suggestedSlots: Slot[];
  };
}

export default function CalendarDashboard({
  isOpen,
  onClose,
  calendarConnected,
  connectCalendar,
  disconnectCalendar,
  calendarState
}: CalendarDashboardProps) {

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return "";
    }
  };

  const hasEvents = calendarState?.bookedSlots && calendarState.bookedSlots.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0f1218]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-[101] flex flex-col transition-transform duration-500 will-change-transform ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14f1d9]/30 to-transparent" />
          <h2 className="text-[18px] font-medium text-white flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-[#14f1d9]">calendar_today</span>
            Your Schedule
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          
          {/* Connection Status Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-8 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] blur-[30px] opacity-20 pointer-events-none ${calendarConnected ? "bg-[#14f1d9]" : "bg-red-500"}`} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${calendarConnected ? "bg-[rgba(20,241,217,0.15)] text-[#14f1d9]" : "bg-red-500/10 text-red-400"}`}>
                <span className="material-symbols-outlined text-[24px]">
                  {calendarConnected ? "sync_alt" : "cloud_off"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-[15px] font-medium mb-1">Google Calendar</h3>
                <p className="text-white/50 text-[13px]">
                  {calendarConnected ? "Connected and syncing" : "Not connected"}
                </p>
              </div>
            </div>

            <div className="mt-5 relative z-10">
              {calendarConnected ? (
                <button 
                  onClick={disconnectCalendar}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-[13px] font-medium text-white/70 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 transition-all"
                >
                  Disconnect Account
                </button>
              ) : (
                <button 
                  onClick={connectCalendar}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#14f1d9] to-[#00b8ff] text-black text-[13px] font-bold shadow-[0_0_20px_rgba(20,241,217,0.2)] hover:shadow-[0_0_30px_rgba(20,241,217,0.4)] hover:scale-[1.02] transition-all"
                >
                  Connect Calendar
                </button>
              )}
            </div>
          </div>

          {/* Agenda Section */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/40 px-1">Upcoming Events Data</h3>
            
            {!calendarConnected ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-50 text-center">
                <span className="material-symbols-outlined text-[40px] mb-3 text-white/30">event_busy</span>
                <p className="text-[13px] text-white/70">Connect your calendar to see your schedule mapped automatically.</p>
              </div>
            ) : !hasEvents ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-60 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-[40px] mb-3 text-[#14f1d9]/50">event_available</span>
                <p className="text-[13px] text-white/70">No busy slots detected in current context.</p>
                <p className="text-[11px] text-white/40 mt-1">Try asking the agent to check your availability.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {calendarState?.bookedSlots.map((slot, idx) => (
                  <div key={idx} className="flex relative group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-orange-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="pl-3 flex-1">
                      <h4 className="text-[14px] font-medium text-white mb-1">Busy Slot</h4>
                      <div className="flex items-center gap-1.5 text-[12px] text-white/50 mb-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {formatDate(slot.start)}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-white/50">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {formatTime(slot.start)} — {formatTime(slot.end)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
