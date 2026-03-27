"use client";
import { useState, useRef, useEffect } from "react";
import { getPath } from "@/utils/paths";
import { getSession, AuthSession } from "@/lib/auth/types";
import { createGoogleCalendarEvent, CalendarEventDetails } from "@/lib/auth/google";
import Link from "next/link";
import { goto } from "@/lib/auth/config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function BookingPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const sessionData = getSession();
    if (!sessionData) {
      goto("/signin");
    } else {
      setSession(sessionData);
    }
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCalendarSync = async (text: string) => {
    if (text.includes("Booking confirmed for") || text.includes("I have scheduled your session")) {
      const currentSession = getSession();
      if (currentSession?.type === 'google' && currentSession.token) {
        setMessages(prev => [...prev, { role: "assistant", content: "Syncing with your Google Calendar..." }]);

        const calendarToken = typeof window !== 'undefined' ? localStorage.getItem('calendar_token') : null;
        if (!calendarToken) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "Your booking is confirmed, but I couldn't sync the event to your Google Calendar because you haven't granted Calendar permissions yet. Please connect your calendar from your profile page."
          }]);
          return;
        }

        const mockEvent: CalendarEventDetails = {
          summary: "Connect Sphere Session",
          description: "Your booked session via Connect Sphere AI.",
          start: new Date(Date.now() + 86400000).toISOString(),
          end: new Date(Date.now() + 90000000).toISOString(),
        };

        const result = await createGoogleCalendarEvent(calendarToken, mockEvent);
        if (result.success && result.link) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `Event successfully added to your Google Calendar! [View Event](${result.link})`
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "I couldn't sync the event to your Google Calendar. Make sure you granted Calendar permissions when signing in."
          }]);
        }
      } else if (!currentSession) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Your booking is confirmed, but you need to be signed in to sync it to your calendar."
        }]);
      }
    }
  };

  const send = async (textToUse?: string) => {
    const text = (textToUse || input).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const calendarToken = typeof window !== "undefined" ? localStorage.getItem("calendar_token") : null;
      const res = await fetch(getPath("/api/booking"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          ...(calendarToken ? { calendar_token: calendarToken } : {}),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last partial line in the buffer
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "").trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || parsed.content || "";
                aiContent += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: aiContent,
                  };
                  return updated;
                });
              } catch {
                // skip
              }
            }
          }
        }
      }

      if (aiContent) {
        await handleCalendarSync(aiContent);
      }

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the booking agent right now. Make sure your backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!mounted || !session) return null;

  return (
    <div className="fixed inset-0 flex bg-[#0c0c0c] text-white overflow-hidden font-sans">
      {/* 1. Left Sidebar */}
      <div className="w-[80px] shrink-0 border-r border-white/5 flex flex-col items-center py-6 bg-[#0a0a0a] z-50">
        <Link href="/" className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center mb-12 shadow-[0_0_15px_rgba(255,95,31,0.5)]">
          <span className="material-symbols-outlined text-black font-bold">north_east</span>
        </Link>
        <div className="flex flex-col gap-8 text-white/40">
          <Link href="/" className="hover:text-white transition-colors"><span className="material-symbols-outlined">home</span></Link>
          <Link href="/profile" className="hover:text-white transition-colors"><span className="material-symbols-outlined">inbox</span></Link>
          <button className="hover:text-white transition-colors text-white"><span className="material-symbols-outlined">calendar_today</span></button>
          <button className="hover:text-white transition-colors"><span className="material-symbols-outlined">grid_view</span></button>
        </div>
        <div className="mt-auto flex flex-col gap-6 text-white/40">
           <button className="hover:text-white transition-colors"><span className="material-symbols-outlined">settings</span></button>
           <button className="hover:text-white transition-colors"><span className="material-symbols-outlined">help</span></button>
        </div>
      </div>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0a0a]">
         {/* Background Effects */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
         <div className="absolute top-[-10%] left-[30%] w-[50%] h-[60%] bg-gradient-to-b from-[#40e0d0]/20 to-[#2e8b57]/20 rounded-full blur-[120px] pointer-events-none opacity-50" />

         {/* Top Nav / Profile */}
         <div className="w-full flex justify-end p-6 z-20">
            <Link href="/profile" className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1.5 hover:bg-white/10 transition-colors">
               <div className="w-6 h-6 rounded-full overflow-hidden bg-brand/20">
                  {session.profile?.picture ? (
                    <img src={session.profile.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-xs text-brand">person</span>
                  )}
               </div>
               <span className="text-xs font-medium text-white/80">{session.profile?.name || 'Guest'}</span>
               <span className="material-symbols-outlined text-white/40 text-sm">expand_more</span>
            </Link>
         </div>

         {/* Content Area */}
         <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-4xl mx-auto overflow-hidden">

            {messages.length === 0 ? (
              /* Empty State */
              <div className="w-full flex flex-col justify-center animate-fade-in mb-32">
                <h1 className="text-4xl lg:text-5xl text-white/90 mb-2">Hey! {session.profile?.name?.split(' ')[0] || 'Raf'}</h1>
                <h2 className="text-4xl lg:text-5xl text-white/70 mb-10">What can I help with?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                   <button onClick={() => send("Help me book a session with a design leader")} className="bg-[#101b1e] border-none rounded-2xl p-5 text-left hover:bg-[#152327] transition-colors group flex flex-col justify-between h-28">
                      <span className="bg-[#bdf3f6] text-black text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit mb-3">Content Help</span>
                      <span className="text-xs text-white/50 group-hover:text-white/70">Help with me create a Presentation</span>
                   </button>
                   <button onClick={() => send("What events are happening next week?")} className="bg-[#241313] border-none rounded-2xl p-5 text-left hover:bg-[#2e1919] transition-colors group flex flex-col justify-between h-28">
                      <span className="bg-[#f6d7d7] text-black text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit mb-3">Suggestions</span>
                      <span className="text-xs text-white/50 group-hover:text-white/70">Help with me ideas</span>
                   </button>
                   <button onClick={() => send("I need to reschedule my upcoming meeting")} className="bg-[#121c13] border-none rounded-2xl p-5 text-left hover:bg-[#172519] transition-colors group flex flex-col justify-between h-28">
                      <span className="bg-[#d7f6d7] text-black text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit mb-3">Job Application</span>
                      <span className="text-xs text-white/50 group-hover:text-white/70">Help with me apply for job application</span>
                   </button>
                </div>
              </div>
            ) : (
              /* Chat History */
              <div className="w-full flex-1 overflow-y-auto mb-32 pr-2 scrollbar-hide flex flex-col gap-6 py-4" ref={scrollContainerRef}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-6 py-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#263e46] text-[#e0f7fa]' : 'bg-[#1a1a1a] border border-white/10 text-white/80'}`}>
                      {msg.content || <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"/> <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}/> <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/></span>}
                    </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex justify-start">
                     <div className="bg-[#1a1a1a] border border-white/10 px-6 py-4 rounded-2xl flex gap-1 items-center h-[52px]">
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"/>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}/>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/>
                     </div>
                   </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Input Box - Pinned to bottom center */}
            <div className="absolute bottom-12 left-0 right-0 px-6 flex justify-center z-30">
              <div className="w-full max-w-3xl bg-[#20292f] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                 <div className="flex items-center gap-2 px-6 py-4 pb-0">
                    <span className="material-symbols-outlined text-white/80 text-xl">auto_awesome</span>
                 </div>
                 <textarea
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={handleKey}
                   placeholder="Ask me anything......."
                   className="w-full bg-transparent border-0 px-6 py-3 text-white placeholder-white/60 outline-none resize-none min-h-[50px] text-[15px]"
                   rows={1}
                 />
                 <div className="flex justify-between items-center px-6 py-4 pt-2 border-t border-white/5">
                    <button className="flex items-center gap-2 text-white/80 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 transition-colors">
                       <span className="material-symbols-outlined text-[16px]">attach_file</span>
                       Attach file
                    </button>
                    <button
                      onClick={() => send()}
                      disabled={!input.trim() || loading}
                      className="w-8 h-8 rounded-lg bg-[#40e0d0] flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#48eedd] transition-colors"
                    >
                       <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                    </button>
                 </div>
              </div>
            </div>

         </div>
      </div>
    </div>
  );
}
