"use client";
import { useState, useRef, useEffect } from "react";
import { getPath } from "@/utils/paths";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BookingChatProps {
  initialPrompt?: string;
  onPromptUsed?: () => void;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm your AI booking agent for Connect Sphere. I can help you book sessions, check speaker availability, and find the perfect time slot. What would you like to schedule?",
};

export default function BookingChat({ initialPrompt, onPromptUsed }: BookingChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // When a quick prompt is selected, populate the input
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      onPromptUsed?.();
    }
  }, [initialPrompt, onPromptUsed]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(getPath("/api/booking"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!res.ok) throw new Error("API error");

      // Handle streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // Parse SSE chunks
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
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: aiContent,
                };
                return updated;
              });
            } catch {
              // non-JSON chunk, skip
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the booking agent right now. Make sure your backend is running.",
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

  return (
    <div className="flex flex-col h-[600px] brutalist-card overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/2">
        <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-white/60">
          AI Booking Agent
        </span>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-brand">
          Powered by LangGraph
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="material-symbols-outlined text-brand text-sm">
                  smart_toy
                </span>
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              }`}
            >
              {msg.content || (
                <span className="text-white/30 italic text-xs">thinking...</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="material-symbols-outlined text-brand text-sm">smart_toy</span>
            </div>
            <div className="chat-bubble-ai px-4 py-3 flex gap-1 items-center">
              <span className="typing-dot w-2 h-2 rounded-full bg-white/40 block" />
              <span className="typing-dot w-2 h-2 rounded-full bg-white/40 block" />
              <span className="typing-dot w-2 h-2 rounded-full bg-white/40 block" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/10 flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. Book a session with Elon Musk next Tuesday at 3pm..."
          rows={1}
          className="flex-1 bg-white/5 border border-white/10 focus:border-brand px-4 py-3 text-sm text-white placeholder-white/20 resize-none outline-none transition-colors rounded-none"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="glow-btn bg-brand text-black font-black px-6 py-3 uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
}


