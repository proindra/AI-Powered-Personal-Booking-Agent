"use client";
import { useState, useRef, useEffect } from "react";
import { getPath } from "@/utils/paths";
import { getSession } from "@/lib/auth/types";
import { createGoogleCalendarEvent, CalendarEventDetails } from "@/lib/auth/google";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content: "Hi! I'm your Connect Sphere AI. I can help you book sessions, check speaker availability, and manage your calendar. What would you like to schedule?",
};

const quickHits = [
  { pill: "Schedule Meeting", label: "Book a 30-min catch up with checking availability", pillColor: "bg-[#c7e0f4] text-[#1d3557]", hoverColor: "hover:bg-[rgba(30,41,59,0.8)]" },
  { pill: "Check Calendar", label: "What's on my schedule for tomorrow?", pillColor: "bg-[#f4c7c7] text-[#571d1d]", hoverColor: "hover:bg-[rgba(59,30,30,0.8)]" },
  { pill: "Resolve Conflict", label: "Reschedule my 2 PM meeting to later this week", pillColor: "bg-[#c7f4c7] text-[#1d571d]", hoverColor: "hover:bg-[rgba(30,59,30,0.8)]" },
];

export default function BookingChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const session = getSession();
    if (session?.profile?.name) {
      setUserName(session.profile.name.split(" ")[0]);
    }
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading, isChatActive]);

  const handleCalendarSync = async (text: string) => {
    if (text.includes("Booking confirmed for") || text.includes("I have scheduled your session")) {
      const session = getSession();
      if (session?.type === 'google' && session.token) {
        setMessages(prev => [...prev, { role: "assistant", content: "Syncing with your Google Calendar..." }]);
        const calendarToken = typeof window !== 'undefined' ? localStorage.getItem('calendar_token') : null;
        if (!calendarToken) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "Your booking is confirmed, but I couldn't sync the event to your Google Calendar because you haven't granted Calendar permissions."
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
            content: "I couldn't sync the event to your Google Calendar."
          }]);
        }
      } else if (!session) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Your booking is confirmed, but you need to be signed in to sync it to your calendar."
        }]);
      }
    }
  };

  const send = async (textOverride?: string) => {
    const text = textOverride ?? input.trim();
    if (!text || loading) return;

    if (!isChatActive) setIsChatActive(true);

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInput("");
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
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || parsed.content || "";
              aiContent += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: aiContent };
                return updated;
              });
            } catch {}
          }
        }
      }
      if (aiContent) await handleCalendarSync(aiContent);

    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection failed." }]);
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

  // --- shared input JSX (inlined to avoid remount-on-every-render focus loss) ---
  const chatInput = (
    <div className="w-full bg-[rgba(26,30,35,0.8)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-5 flex items-center gap-3 backdrop-blur-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <span className="material-symbols-outlined text-[#8e959c] text-[20px] shrink-0">auto_awesome</span>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask me to schedule a meeting, check my calendar..."
        className="flex-1 bg-transparent text-white text-[16px] placeholder-[#4b5563] resize-none outline-none border-none py-1"
        rows={1}
        disabled={loading}
      />
      <button
        onClick={() => send()}
        disabled={loading || !input.trim()}
        className="w-10 h-10 rounded-full bg-[#14f1d9] flex items-center justify-center text-black hover:bg-[#4deeea] hover:scale-105 transition-all shadow-[0_4px_12px_rgba(20,241,217,0.3)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
      </button>
    </div>
  );

  return (
    <div className="flex h-[800px] w-full bg-transparent text-[#ffffff] font-['Inter',sans-serif] overflow-hidden border border-white/5 shadow-2xl relative backdrop-blur-sm">
      
      {/* Sidebar */}
      <div className="hidden lg:flex w-[72px] bg-black/40 border-r border-white/5 flex-col items-center py-6 z-20 backdrop-blur-[10px]">
        <div className="w-8 h-8 bg-[#14f1d9] rounded-lg flex items-center justify-center text-black mb-[48px] shrink-0">
          <span className="material-symbols-outlined text-[20px]">ac_unit</span>
        </div>
        <div className="flex flex-col gap-6 flex-1 w-full items-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#14f1d9] bg-[rgba(20,241,217,0.1)] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">home</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#8e959c] hover:text-[#14f1d9] hover:bg-[rgba(20,241,217,0.1)] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full items-center mt-auto">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#8e959c] hover:text-[#14f1d9] hover:bg-[rgba(20,241,217,0.1)] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#8e959c] hover:text-[#14f1d9] hover:bg-[rgba(20,241,217,0.1)] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col z-10 w-full overflow-hidden">
        
        {/* Grid background */}
        <div className="absolute top-0 left-0 w-full h-[50%] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] z-0 pointer-events-none"></div>

        {/* Topbar */}
        <div className="flex justify-end p-6 lg:px-12 relative z-20 w-full">
          <Link href="/profile" className="flex items-center gap-3 bg-transparent border-none text-white cursor-pointer px-2 py-2 rounded-[20px] transition-all hover:bg-[rgba(255,255,255,0.05)] text-[14px]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#14f1d9] to-blue-500 opacity-80" />
            <span>Profile</span>
            <span className="material-symbols-outlined text-[#8e959c] text-[16px]">expand_more</span>
          </Link>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col items-center w-full max-w-[800px] mx-auto relative z-20 px-6 overflow-hidden">

          {!isChatActive ? (
            <div className="flex flex-col items-center justify-center w-full h-full gap-8">
              {/* Title */}
              <div className="text-left w-full">
                <h1 className="text-[32px] font-normal mb-[8px] text-[#e2e8f0]">Welcome, {userName}</h1>
                <h2 className="text-[42px] font-medium bg-[linear-gradient(to_right,#fff,#94a3b8)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Ready to manage your schedule?</h2>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {quickHits.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => send(card.label)}
                    className={`bg-[rgba(26,30,35,0.6)] border border-[rgba(255,255,255,0.03)] rounded-[16px] p-[20px] cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:-translate-y-1 hover:border-[rgba(255,255,255,0.1)] ${card.hoverColor}`}
                  >
                    <div className={`inline-block px-3 py-1.5 rounded-[20px] text-[12px] font-medium mb-[12px] ${card.pillColor}`}>{card.pill}</div>
                    <p className="text-[14px] text-[#8e959c] leading-[1.5]">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Input */}
              {chatInput}
            </div>
          ) : (
            <div className="flex flex-col w-full h-full pb-6 pt-0">
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-6 scrollbar-hide py-4 pr-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-[#14f1d9]/10 border border-[#14f1d9]/30 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[#14f1d9] text-[16px]">smart_toy</span>
                      </div>
                    )}
                    <div className={`max-w-[85%] px-5 py-4 text-[15px] leading-relaxed rounded-2xl ${msg.role === "user" ? "bg-[#1a1e23]/80 border border-white/5 text-white" : "bg-transparent text-white/90"}`}>
                      {msg.content || (
                        <span className="text-white/30 italic text-sm flex items-center gap-2">
                          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{animationDelay: '0ms'}}/>
                          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{animationDelay: '150ms'}}/>
                          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{animationDelay: '300ms'}}/>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-[#14f1d9]/10 border border-[#14f1d9]/30 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[#14f1d9] text-[16px]">smart_toy</span>
                    </div>
                    <div className="px-5 py-4">
                      <span className="text-white/30 italic text-sm flex items-center gap-2">
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{animationDelay: '0ms'}}/>
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{animationDelay: '150ms'}}/>
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{animationDelay: '300ms'}}/>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} className="h-4" />
              </div>

              {/* Input */}
              {chatInput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


