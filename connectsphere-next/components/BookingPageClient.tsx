"use client";
import { useState } from "react";
import BookingChat from "./BookingChat";
import Link from "next/link";

const quickPrompts = [
  "Book a session with Elon Musk next Tuesday",
  "Find available slots for a design workshop",
  "Schedule a networking call this Friday at 3pm",
  "Check availability for August 20th event",
];

export default function BookingPageClient() {
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8">
        <BookingChat initialPrompt={selectedPrompt} onPromptUsed={() => setSelectedPrompt("")} />
      </div>

      <div className="lg:col-span-4 flex flex-col gap-8">
        <div className="brutalist-card p-8">
          <h3 className="font-black text-lg uppercase tracking-widest mb-6 text-white">Quick Prompts</h3>
          <div className="flex flex-col gap-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSelectedPrompt(prompt)}
                className="text-left text-xs text-white/60 border border-white/10 px-4 py-3 hover:border-brand hover:text-white hover:bg-brand/5 transition-all font-medium"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>

        <div className="brutalist-card p-8 border-t-4 border-t-brand">
          <h3 className="font-black text-lg uppercase tracking-widest mb-6 text-white">Agent Capabilities</h3>
          <div className="space-y-4">
            {[
              { icon: "psychology", label: "Natural Language Understanding", desc: "Understands scheduling intents from plain text" },
              { icon: "calendar_month", label: "Availability Check", desc: "Checks calendar data in real-time" },
              { icon: "swap_horiz", label: "Conflict Resolution", desc: "Suggests alternative time slots" },
              { icon: "check_circle", label: "Booking Confirmation", desc: "Summarizes and confirms your booking" },
            ].map((cap) => (
              <div key={cap.label} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-brand text-xl mt-0.5">{cap.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white">{cap.label}</p>
                  <p className="text-[11px] text-white/40 mt-1">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="brutalist-card p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Backend Status</span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Connect your LangGraph FastAPI backend at{" "}
            <code className="text-brand text-[11px]">LANGGRAPH_API_URL</code> in{" "}
            <code className="text-brand text-[11px]">.env.local</code> to activate the agent.
          </p>
          <Link
            href="https://www.langchain.com/langgraph"
            target="_blank"
            className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-brand border-b border-brand hover:text-white hover:border-white transition-all"
          >
            LangGraph Docs →
          </Link>
        </div>
      </div>
    </div>
  );
}


