"use client";
import { useState, useRef, useEffect } from "react";
import { getSession, clearSession } from "@/lib/auth/types";
import { createGoogleCalendarEvent, CalendarEventDetails, requestCalendarAccess, hasCalendarAccess, clearCalendarToken } from "@/lib/auth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
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

const STORAGE_KEY = "cs_chat_sessions";

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function newSession(): ChatSession {
  return { id: Date.now().toString(), title: "New conversation", messages: [WELCOME], createdAt: Date.now() };
}

export default function BookingChat() {
  const [sessions, setSessions]       = useState<ChatSession[]>([]);
  const [activeId, setActiveId]       = useState<string>("");
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [userName, setUserName]       = useState("Guest");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarMsg, setCalendarMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [backendUrl, setBackendUrl] = useState("");
  const [backendSaved, setBackendSaved] = useState(false);

  const router = useRouter();

  const bottomRef          = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load sessions, user name & calendar status on mount
  useEffect(() => {
    const session = getSession();
    if (session?.profile?.name) setUserName(session.profile.name.split(" ")[0]);

    // If session is guest, clear any stale calendar token that may have leaked
    if (session?.type === 'guest') {
      clearCalendarToken();
      setCalendarConnected(false);
    } else {
      setCalendarConnected(hasCalendarAccess());
    }

    setBackendUrl(localStorage.getItem("cs_backend_url") || process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:8123");

    let stored = loadSessions();
    if (stored.length === 0) {
      const s = newSession();
      stored = [s];
      saveSessions(stored);
    }
    setSessions(stored);
    setActiveId(stored[0].id);
  }, []);

  const connectCalendar = () => {
    const session = getSession();

    // Guest users cannot connect Google Calendar
    if (!session || session.type === 'guest') {
      showCalMsg("Sign in with Google to connect Calendar", false);
      return;
    }

    if (calendarConnected) {
      showCalMsg("Google Calendar already connected ✓", true);
      return;
    }
    requestCalendarAccess(
      () => {
        setCalendarConnected(true);
        showCalMsg("Google Calendar connected ✓", true);
      },
      (err) => { if (err) showCalMsg(err, false); }
    );
  };

  const showCalMsg = (text: string, ok: boolean) => {
    setCalendarMsg({ text, ok });
    setTimeout(() => setCalendarMsg(null), 3000);
  };

  const saveBackendUrl = () => {
    localStorage.setItem("cs_backend_url", backendUrl.trim());
    setBackendSaved(true);
    setTimeout(() => setBackendSaved(false), 2000);
  };

  const disconnectCalendar = () => {
    clearCalendarToken();
    setCalendarConnected(false);
    showCalMsg("Google Calendar disconnected", false);
  };

  const clearAllChats = () => {
    const s = newSession();
    setSessions([s]);
    saveSessions([s]);
    setActiveId(s.id);
    setIsChatActive(false);
    setInput("");
  };

  const handleSignOut = () => {
    clearSession();
    clearCalendarToken();
    router.push("/");
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [sessions, loading, isChatActive, activeId]);

  const activeSession = sessions.find(s => s.id === activeId);
  const messages = activeSession?.messages ?? [WELCOME];

  const updateMessages = (updater: (prev: Message[]) => Message[]) => {
    setSessions(prev => {
      const next = prev.map(s => s.id === activeId ? { ...s, messages: updater(s.messages) } : s);
      saveSessions(next);
      return next;
    });
  };

  const setTitle = (id: string, title: string) => {
    setSessions(prev => {
      const next = prev.map(s => s.id === id ? { ...s, title } : s);
      saveSessions(next);
      return next;
    });
  };

  const createNewChat = () => {
    const s = newSession();
    setSessions(prev => {
      const next = [s, ...prev];
      saveSessions(next);
      return next;
    });
    setActiveId(s.id);
    setIsChatActive(false);
    setInput("");
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      if (next.length === 0) {
        const s = newSession();
        saveSessions([s]);
        setActiveId(s.id);
        setIsChatActive(false);
        return [s];
      }
      saveSessions(next);
      if (activeId === id) {
        setActiveId(next[0].id);
        setIsChatActive(false);
      }
      return next;
    });
  };

  const switchSession = (id: string) => {
    setActiveId(id);
    const s = sessions.find(x => x.id === id);
    const hasUserMsg = s?.messages.some(m => m.role === "user") ?? false;
    setIsChatActive(hasUserMsg);
    setInput("");
  };

  const handleCalendarSync = async (text: string) => {
    if (text.includes("Booking confirmed for") || text.includes("I have scheduled your session")) {
      const session = getSession();
      if (session?.type === "google" && session.token) {
        updateMessages(prev => [...prev, { role: "assistant", content: "Syncing with your Google Calendar..." }]);
        const calendarToken = typeof window !== "undefined" ? localStorage.getItem("calendar_token") : null;
        if (!calendarToken) {
          updateMessages(prev => [...prev, { role: "assistant", content: "Your booking is confirmed, but Calendar permissions haven't been granted yet." }]);
          return;
        }
        const mockEvent: CalendarEventDetails = {
          summary: "Connect Sphere Session",
          description: "Your booked session via Connect Sphere AI.",
          start: new Date(Date.now() + 86400000).toISOString(),
          end: new Date(Date.now() + 90000000).toISOString(),
        };
        const result = await createGoogleCalendarEvent(calendarToken, mockEvent);
        updateMessages(prev => [
          ...prev,
          result.success && result.link
            ? { role: "assistant", content: `Event added to Google Calendar! [View Event](${result.link})` }
            : { role: "assistant", content: "Couldn't sync the event to Google Calendar." }
        ]);
      }
    }
  };

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setIsChatActive(true);

    // Auto-title from first user message
    if (activeSession?.title === "New conversation") {
      setTitle(activeId, text.slice(0, 40) + (text.length > 40 ? "…" : ""));
    }

    updateMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const authSession = getSession();
      const langgraphUrl = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:8123";
      const res = await fetch(`${langgraphUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: authSession?.email || "anonymous",
          calendar_token: typeof window !== "undefined" ? localStorage.getItem("calendar_token") : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      const reply = data.response || data.message || "I received your request. Let me help you with that!";
      updateMessages(prev => [...prev, { role: "assistant", content: reply }]);
      await handleCalendarSync(reply);
    } catch {
      updateMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting to the booking system right now. Please try again shortly.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Shared input JSX — kept as a variable (NOT a sub-component) to preserve textarea focus across renders
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
    <div className="flex h-full w-full bg-transparent text-[#ffffff] font-['Inter',sans-serif] overflow-hidden relative">

      {/* ── Calendar toast ─────────────────────────────────────────── */}
      {calendarMsg && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-medium shadow-xl backdrop-blur-xl border transition-all pointer-events-none ${calendarMsg.ok ? 'bg-[rgba(20,241,217,0.12)] border-[#14f1d9]/30 text-[#14f1d9]' : 'bg-[rgba(239,68,68,0.12)] border-red-500/30 text-red-400'}`}>
          <span className="material-symbols-outlined text-[16px]">{calendarMsg.ok ? 'check_circle' : 'error'}</span>
          {calendarMsg.text}
        </div>
      )}

      {/* ── Chat History Sidebar ───────────────────────────────────── */}
      <div className={`${historyOpen ? "w-[260px]" : "w-0"} shrink-0 h-full bg-black/50 border-r border-white/5 flex flex-col transition-all duration-300 overflow-hidden backdrop-blur-xl z-30`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Chat History</span>
          <button
            onClick={createNewChat}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#0066FF]/30 border border-white/10 hover:border-[#0066FF]/40 flex items-center justify-center transition-all"
            title="New chat"
          >
            <span className="material-symbols-outlined text-[16px] text-white/60 hover:text-white">add</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5" style={{ scrollbarWidth: "none" }}>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => switchSession(s.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-[13px] ${
                s.id === activeId
                  ? "bg-[#0066FF]/20 border border-[#0066FF]/30 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-[15px] shrink-0 opacity-50">chat_bubble</span>
              <span className="flex-1 truncate leading-snug">{s.title}</span>
              <button
                onClick={(e) => deleteSession(s.id, e)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[13px]">delete</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5 shrink-0">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">Powered by ConnectSphere AI</p>
        </div>
      </div>

      {/* ── Narrow Icon Sidebar ────────────────────────────────────── */}
      <div className="hidden lg:flex w-[56px] bg-black/40 border-r border-white/5 flex-col items-center py-5 z-20 backdrop-blur-[10px] shrink-0">
        {/* Logo */}
        <div className="mb-8 shrink-0">
          <svg viewBox="0 0 40 40" width="26" height="26" fill="none" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 30 L15 5 L25 35 L35 10" />
          </svg>
        </div>

        {/* Toggle history sidebar */}
        <button
          onClick={() => setHistoryOpen(o => !o)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer mb-2 ${historyOpen ? "text-[#14f1d9] bg-[rgba(20,241,217,0.1)]" : "text-[#8e959c] hover:text-[#14f1d9] hover:bg-[rgba(20,241,217,0.1)]"}`}
          title="Toggle history"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <div className="flex flex-col gap-5 flex-1 w-full items-center mt-2">
          <button onClick={createNewChat} className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8e959c] hover:text-[#14f1d9] hover:bg-[rgba(20,241,217,0.1)] transition-all cursor-pointer" title="New chat">
            <span className="material-symbols-outlined text-[20px]">add_comment</span>
          </button>
          <button
            onClick={connectCalendar}
            title={calendarConnected ? "Google Calendar connected" : "Connect Google Calendar"}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer group"
            style={{ color: calendarConnected ? '#14f1d9' : '#8e959c' }}
          >
            <span className="material-symbols-outlined text-[20px] group-hover:text-[#14f1d9] group-hover:scale-110 transition-all">calendar_month</span>
            {calendarConnected && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_6px_rgba(20,241,217,0.8)]" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-5 w-full items-center mt-auto">
          <button
            onClick={() => setSettingsOpen(o => !o)}
            title="Settings"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${settingsOpen ? 'text-[#14f1d9] bg-[rgba(20,241,217,0.1)]' : 'text-[#8e959c] hover:text-[#14f1d9] hover:bg-[rgba(20,241,217,0.1)]'}`}
          >
            <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${settingsOpen ? 'rotate-45' : ''}`}>settings</span>
          </button>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col z-10 w-full overflow-hidden">

        {/* Grid background */}
        <div className="absolute top-0 left-0 w-full h-[50%] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] z-0 pointer-events-none" />

        {/* Topbar */}
        <div className="flex justify-between items-center p-4 lg:px-10 relative z-20 w-full border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-white/40 font-medium truncate max-w-[200px]">{activeSession?.title || "New conversation"}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-[14px] text-[13px] text-white/50 hover:text-white hover:bg-white/5 transition-all group"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span>Home</span>
          </Link>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col items-center w-full max-w-[800px] mx-auto relative z-20 px-6 overflow-hidden py-4">

          {!isChatActive ? (
            <div className="flex flex-col items-center justify-center w-full h-full gap-7">
              <div className="text-left w-full">
                <h1 className="text-[28px] font-normal mb-[6px] text-[#e2e8f0]">Welcome, {userName}</h1>
                <h2 className="text-[38px] font-medium bg-[linear-gradient(to_right,#fff,#94a3b8)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Ready to manage your schedule?</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {quickHits.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => send(card.label)}
                    className={`bg-[rgba(26,30,35,0.6)] border border-[rgba(255,255,255,0.03)] rounded-[16px] p-[18px] cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:-translate-y-1 hover:border-[rgba(255,255,255,0.1)] ${card.hoverColor}`}
                  >
                    <div className={`inline-block px-3 py-1.5 rounded-[20px] text-[12px] font-medium mb-[10px] ${card.pillColor}`}>{card.pill}</div>
                    <p className="text-[13px] text-[#8e959c] leading-[1.5]">{card.label}</p>
                  </div>
                ))}
              </div>

              {chatInput}
            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-5 scrollbar-hide py-4 pr-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-[#14f1d9]/10 border border-[#14f1d9]/30 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[#14f1d9] text-[14px]">smart_toy</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 text-[14px] leading-relaxed rounded-2xl ${msg.role === "user" ? "bg-[#1a1e23]/80 border border-white/5 text-white" : "bg-transparent text-white/90"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-[#14f1d9]/10 border border-[#14f1d9]/30 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[#14f1d9] text-[14px]">smart_toy</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 block animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} className="h-2" />
              </div>

              {chatInput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
