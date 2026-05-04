"use client";

export default function EventsPage() {
  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Page Header ── */}
      <div className="mb-12">
        <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs mb-3 block">
          Live Operations
        </span>
        <h2 className="font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none text-white mb-3">
          EVENT<br /><span className="text-brand">TIMELINE</span>
        </h2>
        <p className="text-white/60 text-base">Chronological tracking for active ops and deadlines.</p>
      </div>

      {/* ── Timeline thread ── */}
      <div className="relative pl-8 md:pl-16 ml-4 md:ml-8 space-y-16">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-[1px] md:left-[3px] w-[2px] bg-gradient-to-b from-brand via-white/20 to-transparent rounded-full shadow-[0_0_12px_rgba(0,102,255,0.5)]" />

        {/* ── Node 1: Active event ── */}
        <div className="relative z-10 group">
          <div className="absolute -left-[37px] md:-left-[69px] top-8 w-5 h-5 rounded-full bg-dark border-[3px] border-brand shadow-[0_0_14px_rgba(0,102,255,0.8)] group-hover:scale-125 transition-all duration-300" />

          <div className="brutalist-card p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6 relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-[11px] font-bold uppercase tracking-widest mb-4 border border-brand/30">
                  Hackathon
                </span>
                <h3 className="text-[28px] font-black uppercase tracking-tighter leading-tight text-white">
                  Global AI Challenge Kickoff
                </h3>
              </div>
              <div className="text-left md:text-right flex-shrink-0 bg-white/[0.03] p-4 border border-white/[0.08]">
                <div className="text-[28px] font-black text-brand">Oct 15</div>
                <div className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">09:00 AM EST</div>
              </div>
            </div>

            <p className="text-white/60 text-base mb-8 relative z-10 leading-relaxed max-w-2xl">
              Initial briefing and team formation phase begins. Ensure all local environments are configured per specs.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 border-t border-white/[0.06] pt-6">
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none glow-btn bg-brand text-white px-6 py-2.5 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,102,255,0.3)]">
                  Join Briefing
                </button>
                <button className="flex-1 sm:flex-none px-6 py-2.5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:border-white/30 hover:bg-white/5 transition-all">
                  Details
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 border border-white/[0.06] bg-white/[0.02]">
                <div className="flex -space-x-2">
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuB54yPYSgbJHhWzgOd7_Y7sl8-UWIV4B3p7esbPUqA-NF6kDLhOpB-pxOzwlo8THRTsGGczjPCvIpi0ixvmeXWPGuTiQYLsSIJ4CBDbCJFLPyVlqnCXmE7HBcywmz0PnwC1msUB-jLsG8phaiGseh40DkcWMjrrbDQ13-kusXWcYTv2IQQTWTAdraxvKfiOoghGztfbMadsfroOKWzcMQOBT7A7ugOGBMN9L8kO9rExycpXdq8YZC08HCliH3mYmUgxNkXsaS535WFn",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBhe7iwlAuiOkiM2SdCX3-YreJMVw5NES7-l9KqgM_kfdmGTIHPiIB4-wc2k854foxZS8rZC0uPbAzy4gqY9EIkJBGEDjdrt68a6PE5yBcJuwSmlnZ6gSnnC8Mz4k1gZiN-JhALwaskCpgFzBDYoxlxeVSVlQm72aHYqfay2pG0CO4A0nOvDSSiumxwMdiTegbR-OdIt_3Zu86fINT4Xxs3a1GgrsVwORtrSZ66S4t5MKxZ1skFedc-5omlq148ne5EFloycHVwur7U",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDAK5rYzXCg6LnGxA7aB-wULMVHfgHzn7vURIjHg-Fyj8uS8CaobS-cHquMWsNXR4P5wfZKq_eGcwE6pU87_ovZ7IdmV9VSOjy3dIIGMFKAjKoyq_kHRnNgAyOjbVUgKvt09zeK9B5a3-tigGlbl6ez1LJhEhLufFqWvVDXmsFyoagaQKjJY-6eOW2cJy5yyVu8KzBA1C12cFiiapSLZGYgSlQt9TksWk_9OPuFZjnXratjaC_dttqJR_OdR0IpYzangYoCAMOcGVPb",
                  ].map((src, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-dark overflow-hidden bg-white/10">
                      <img className="w-full h-full object-cover" src={src} alt="" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-brand">+142 Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Node 2: Urgent deadline ── */}
        <div className="relative z-10 group">
          <div className="absolute -left-[37px] md:-left-[69px] top-8 w-5 h-5 rounded-full bg-dark border-[3px] border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)] group-hover:scale-125 transition-all duration-300 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-400" />
          </div>

          <div className="brutalist-card p-8 border-red-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 10px,#ef4444 10px,#ef4444 20px)" }} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 text-[11px] font-bold uppercase tracking-widest mb-4 border border-red-500/30 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Urgent Deadline
                </span>
                <h3 className="text-[28px] font-black uppercase tracking-tighter leading-tight text-white">
                  TechCorp Internship Application
                </h3>
              </div>
              <div className="text-left md:text-right flex-shrink-0 bg-white/[0.03] p-4 border border-red-500/20">
                <div className="text-[28px] font-black text-red-400">Oct 18</div>
                <div className="text-red-300/70 text-xs font-bold uppercase tracking-widest mt-1">11:59 PM PST</div>
              </div>
            </div>

            <p className="text-white/60 text-base mb-8 relative z-10 leading-relaxed max-w-2xl">
              Final portfolio submission required for the summer recruitment cycle. Late submissions will automatically be rejected by the ATS.
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-6 relative z-10 p-5 bg-white/[0.02] border border-white/[0.06] mb-8">
              <div className="flex-1 bg-white/10 h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ width: "85%" }} />
              </div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest whitespace-nowrap">85% Complete</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 border-t border-red-500/10 pt-6">
              <button className="px-8 py-2.5 bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                Complete Submission
              </button>
              <div className="flex items-center gap-2 text-red-300/60 text-xs font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">visibility</span> 42 Viewing
              </div>
            </div>
          </div>
        </div>

        {/* ── Node 3: Past / archived ── */}
        <div className="relative z-10 group opacity-40 hover:opacity-70 transition-all duration-500">
          <div className="absolute -left-[33px] md:-left-[65px] top-8 w-4 h-4 rounded-full bg-dark border-2 border-white/20" />

          <div className="brutalist-card p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/5 text-white/40 text-[11px] font-bold uppercase tracking-widest mb-4 border border-white/10">
                  Workshop
                </span>
                <h3 className="text-[24px] font-black uppercase tracking-tighter text-white/40 line-through decoration-white/20 decoration-2">
                  Advanced Rust Patterns
                </h3>
              </div>
              <div className="text-[24px] font-black text-white/30">Oct 10</div>
            </div>
            <p className="text-white/30 text-base mb-6">Session concluded. VOD and materials available in the archive.</p>
            <div className="border-t border-white/[0.06] pt-6">
              <button className="px-6 py-2.5 border border-white/20 text-white/40 text-xs font-bold uppercase tracking-widest hover:border-white/40 hover:text-white/60 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span> Resources
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
