'use client';

import React, { useEffect, useState, useRef } from 'react';

export interface TimeSlot {
  start: string; // ISO datetime
  end: string;   // ISO datetime
}

interface VerticalTimelineProps {
  bookedSlots: TimeSlot[];
  suggestedSlots: TimeSlot[];
}

export default function VerticalTimeline({ bookedSlots, suggestedSlots }: VerticalTimelineProps) {
  const [now, setNow] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update "now" every minute to keep the timeline current
  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Create an array of 50 hour markers starting from 2 hours AGO so the red line isn't stuck at 0px top
  const startOfCurrentHour = new Date(now);
  startOfCurrentHour.setMinutes(0, 0, 0);
  startOfCurrentHour.setHours(startOfCurrentHour.getHours() - 2);

  const HOURS_TO_SHOW = 48 + 2; // Show 50 hours total to include the 2 past hours
  const PIXELS_PER_HOUR = 60; // 1 pixel per minute

  const hours = Array.from({ length: HOURS_TO_SHOW + 1 }).map((_, i) => {
    const d = new Date(startOfCurrentHour.getTime() + i * 3600000);
    return d;
  });

  const timelineStart = startOfCurrentHour.getTime();
  const timelineEnd = timelineStart + HOURS_TO_SHOW * 3600000;

  // Helper to calculate top and height styles (in percentage of total container)
  const getStyleForSegment = (startStr: string, endStr: string) => {
    const startMs = new Date(startStr).getTime();
    const endMs = new Date(endStr).getTime();

    // Clip to our 48h window
    if (endMs <= timelineStart || startMs >= timelineEnd) return null;

    const visibleStart = Math.max(startMs, timelineStart);
    const visibleEnd = Math.min(endMs, timelineEnd);

    const topPx = ((visibleStart - timelineStart) / 3600000) * PIXELS_PER_HOUR;
    const heightPx = ((visibleEnd - visibleStart) / 3600000) * PIXELS_PER_HOUR;

    return { top: `${topPx}px`, height: `${heightPx}px` };
  };

  // Pre-calculate the current time line position
  const currentTimeTopPx = ((now.getTime() - timelineStart) / 3600000) * PIXELS_PER_HOUR;

  return (
    <div className="flex flex-col h-full w-full font-sans">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent z-10 shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Live Timeline</h3>
          <p className="text-[10px] text-[#8e959c] mt-0.5 font-medium tracking-wide">Next 48 Hours</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0066FF]"></div><span className="text-[9px] text-white/50 uppercase font-bold">Busy</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_rgba(20,241,217,0.5)]"></div><span className="text-[9px] text-white/50 uppercase font-bold">Suggest</span></div>
        </div>
      </div>

      {/* Scrollable Timeline Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide select-none"
      >
        {!isMounted ? (
          <div className="flex items-center justify-center h-full w-full">
            <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-[#14f1d9] animate-spin"></span>
          </div>
        ) : (
          <div 
            className="relative w-full" 
            style={{ height: `${HOURS_TO_SHOW * PIXELS_PER_HOUR}px`, paddingLeft: '64px' }}
          >
          {/* Base dashed line for the entire 48h indicating "Free" default */}
          <div 
            className="absolute left-[70px] top-0 bottom-0 w-[2px]"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 50%)', backgroundSize: '100% 8px' }}
          ></div>

          {/* Current Time Indicator */}
          <div 
            className="absolute left-[64px] right-0 z-20 pointer-events-none flex items-center"
            style={{ top: `${currentTimeTopPx}px`, transform: 'translateY(-50%)' }}
          >
            <div className="w-[14px] h-[14px] rounded-full bg-[#ff3366] shrink-0 shadow-[0_0_10px_rgba(255,51,102,0.6)] flex items-center justify-center relative -left-[6px]">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-[#ff3366] to-transparent w-full opacity-60"></div>
          </div>

          {/* Render Booked Slots (Blue) */}
          {bookedSlots.map((slot, i) => {
            const style = getStyleForSegment(slot.start, slot.end);
            if (!style) return null;
            return (
              <div 
                key={`booked-${i}`}
                className="absolute left-[65px] w-[12px] bg-[#0066FF] rounded-full z-10 shadow-[0_0_15px_rgba(0,102,255,0.4)] opacity-80"
                style={style}
              />
            );
          })}

          {/* Render Suggested Slots (Pulsing Green) */}
          {suggestedSlots.map((slot, i) => {
            const style = getStyleForSegment(slot.start, slot.end);
            if (!style) return null;
            
            // Format time for tooltip
            const timeStr = new Date(slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            return (
              <div 
                key={`suggested-${i}`}
                className="absolute left-[63px] right-4 bg-[rgba(20,241,217,0.15)] border border-[#14f1d9] rounded-lg z-30 shadow-[0_0_20px_rgba(20,241,217,0.3)] animate-pulse group cursor-pointer"
                style={style}
              >
                {/* Thick accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#14f1d9] rounded-l-lg shadow-[0_0_10px_#14f1d9]"></div>
                
                {/* Embedded details */}
                <div className="absolute inset-0 pl-4 py-2 flex items-center">
                  <span className="text-[11px] font-bold text-[#14f1d9] tracking-wider bg-[#0a0a0a]/80 px-2 py-0.5 rounded-full border border-[#14f1d9]/30">
                    {timeStr} Suggested
                  </span>
                </div>
              </div>
            );
          })}

          {/* Hour Markers & Grid */}
          {hours.map((d, i) => {
            const topPx = i * PIXELS_PER_HOUR;
            // E.g. "3 PM", "12 AM"
            const label = d.toLocaleTimeString([], { hour: 'numeric' });
            // Is it midnight? Show the date
            const isMidnight = d.getHours() === 0;

            return (
              <div 
                key={i} 
                className="absolute w-full left-0 border-t border-white/[0.03] flex items-center pointer-events-none"
                style={{ top: `${topPx}px` }}
              >
                <div className="w-[64px] shrink-0 text-right pr-4 relative -top-[8px]">
                  {isMidnight ? (
                    <span className="text-[9px] font-black tracking-widest uppercase text-white/70 block leading-tight pt-1">
                      {d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#8e959c] block">
                      {label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
