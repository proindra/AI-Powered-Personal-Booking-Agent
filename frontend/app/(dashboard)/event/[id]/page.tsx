"use client";

import { use } from "react";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      {/* ── Hero ── */}
      <div className="relative w-full h-[380px] overflow-hidden border border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQubenp87UQq8vr--c5V60YGpuk-ELG_VVz9Zyn5o_yUhbkVqFJSZrt0-EqB8HsQKhT5jBe3_DkBKrpJPw3ozIC_nHKv9qcJmpvoQXr8ClRWrHeI0OtuN8YAJPNd4zru2xK84MKK6M_apf1u0G54Sp4HYwOELf_SlAa-QdtGM8QDJUZM6hEwiBezGn-UfVdRoIvegMwcw4Ryks8Uuxnr7cCokh1jdKUoW5Y9caezei8L4A377QuPLsrLSPT-tJh53zObndaQ5PoWLq')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brand/20 text-brand text-xs font-bold uppercase tracking-widest border border-brand/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                Live
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/60 text-xs font-bold uppercase tracking-widest border border-white/10">
                Hackathon {id}
              </span>
            </div>
            <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-white">
              Flipkart GRID 5.0
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              The ultimate software development challenge for top engineering minds. Build the future of e-commerce.
            </p>
          </div>
          <button className="glow-btn bg-brand text-white font-black uppercase tracking-widest text-sm px-8 py-4 hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(0,102,255,0.4)] shrink-0">
            Register Now
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Video & chapters */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="brutalist-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-brand">smart_display</span>
              <h2 className="font-black text-xl uppercase tracking-tighter text-white">Event Briefing</h2>
            </div>

            {/* Video */}
            <div className="aspect-video bg-white/[0.03] border border-white/[0.06] relative overflow-hidden mb-4 flex items-center justify-center group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7ClAWWy68KGglKJYw0Z3wj46Dmv__IU9T8qWenTub_9JgM2LsuSMVB5LnzH4uQEHlxLNkkViDx2-lDA-arggKI7-Qz58RSm_mNEy2kgnOvoiL5VJiwY-K1l0hhVsxvwnjUe8FGBx0J7xAOgdqL0Gt5N_EBGxNh2BcxkYBprTWyyJu6Huhri14e3caxGNoEvaBlU57lVP-4AvolBSbAzv79KAzNTjjZ2qxsKC13VknNQK6n7cCVlxP5tBAR0aOKEru4hFjXMWe6a71')",
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <button className="w-16 h-16 bg-brand/20 border border-brand/50 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-brand text-4xl ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>

            {/* Chapters */}
            <div className="space-y-1 mt-4">
              <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Key Chapters</h3>
              {[
                { time: "00:00", label: "Introduction & Overview", active: false },
                { time: "02:15", label: "Problem Statements Reveal", active: true },
                { time: "10:45", label: "Judging Criteria", active: false },
              ].map(({ time, label, active }) => (
                <div
                  key={time}
                  className={`flex items-center gap-4 p-3 cursor-pointer border transition-colors group ${
                    active
                      ? "bg-brand/10 border-brand/20"
                      : "border-transparent hover:bg-white/[0.03] hover:border-white/[0.08]"
                  }`}
                >
                  <span className={`font-black text-sm w-12 ${active ? "text-brand" : "text-white/40"}`}>{time}</span>
                  <p className={`text-sm transition-colors ${active ? "text-white font-semibold" : "text-white/60 group-hover:text-white"}`}>
                    {label}
                  </p>
                  {active && <span className="ml-auto w-2 h-2 rounded-full bg-brand" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Milestones */}
        <div className="lg:col-span-1">
          <div className="brutalist-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-brand">route</span>
              <h2 className="font-black text-xl uppercase tracking-tighter text-white">Milestones</h2>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-white/[0.08]">
              {[
                { date: "Aug 15 – Aug 30", title: "Registration Opens", desc: "Team formation and initial signup phase.", status: "past" },
                { date: "Sep 1 – Sep 15",  title: "Level 1: E-Commerce Trivia", desc: "Online quiz testing fundamental concepts.", status: "active", badge: "Active Phase" },
                { date: "Oct 5",           title: "Level 2: Architecture Submission", desc: "Detailed system design presentation.", status: "future" },
                { date: "Nov 15",          title: "Grand Finale", desc: "Live presentation to Flipkart leadership.", status: "future" },
              ].map(({ date, title, desc, status, badge }) => (
                <div key={date} className="relative">
                  <div
                    className={`absolute -left-[30px] w-4 h-4 border-2 z-10 mt-1 ${
                      status === "active"
                        ? "bg-dark border-brand shadow-[0_0_10px_rgba(0,102,255,0.8)]"
                        : "bg-dark border-white/20"
                    }`}
                  >
                    {status === "active" && (
                      <div className="absolute inset-[2px] bg-brand" />
                    )}
                  </div>
                  <div className={`space-y-1 ${status === "past" ? "opacity-50" : ""}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${status === "active" ? "text-brand" : "text-white/30"}`}>
                      {date}
                    </p>
                    <h4 className={`font-black uppercase tracking-tighter text-sm ${status === "active" ? "text-white" : "text-white/60"}`}>
                      {title}
                    </h4>
                    <p className="text-xs text-white/40">{desc}</p>
                    {badge && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-brand/10 border border-brand/30 text-[10px] text-brand font-bold uppercase tracking-widest">
                        {badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
