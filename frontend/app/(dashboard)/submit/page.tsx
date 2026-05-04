"use client";
import { useState } from "react";

export default function SubmitEventPage() {
  const [title, setTitle]       = useState("");
  const [date, setDate]         = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink]         = useState("");

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">

      {/* ── Page Header ── */}
      <section className="flex flex-col gap-2">
        <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs">
          Event Management
        </span>
        <h2 className="font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none text-white">
          DEPLOY<br /><span className="text-brand">EVENT</span>
        </h2>
        <p className="text-white/60 text-base max-w-2xl leading-relaxed">
          Initialize a new instance in the global timeline. Provide the necessary parameters below to index your hackathon, workshop, or tech meetup.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Form ── */}
        <div className="lg:col-span-7">
          <form className="relative group/form">
            <div className="relative z-10 brutalist-card p-8 flex flex-col gap-6">

              {/* Title */}
              <div className="relative">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-white focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none"
                  id="ev-title"
                  placeholder=" "
                  type="text"
                />
                <label
                  htmlFor="ev-title"
                  className="absolute left-0 top-4 text-white/40 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85"
                >
                  Event Title *
                </label>
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Start Date</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 text-[18px] pointer-events-none">calendar_month</span>
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] text-white text-sm py-3 pl-10 pr-4 outline-none focus:border-brand/50 transition-all appearance-none [color-scheme:dark]"
                      type="date"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Category</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 text-[18px] pointer-events-none">category</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] text-white text-sm py-3 pl-10 pr-4 outline-none focus:border-brand/50 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-dark" value="">Select Type...</option>
                      <option className="bg-dark" value="Hackathon">Hackathon</option>
                      <option className="bg-dark" value="Workshop">Workshop</option>
                      <option className="bg-dark" value="Meetup">Meetup</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 text-[16px] pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Link */}
              <div className="relative">
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="peer w-full bg-transparent border-0 border-b-2 border-white/20 py-4 px-0 text-brand/80 focus:ring-0 focus:border-brand transition-colors text-xl placeholder-transparent outline-none"
                  id="ev-link"
                  placeholder=" "
                  type="url"
                />
                <label
                  htmlFor="ev-link"
                  className="absolute left-0 top-4 text-white/40 uppercase font-bold tracking-widest text-xs transition-all pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-brand peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-85"
                >
                  Event Website Link
                </label>
              </div>

              {/* Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Upload Video / Promo</label>
                <div className="border-2 border-dashed border-white/[0.08] hover:border-brand/30 p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:bg-brand/[0.02]">
                  <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-brand/10 hover:border-brand/20 transition-all">
                    <span className="material-symbols-outlined text-white/30 hover:text-brand transition-colors text-[28px]">cloud_upload</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-medium text-white/70">Drag and drop MP4 or WebM here</p>
                    <p className="text-[11px] text-white/40 mt-1 uppercase tracking-widest font-bold">Max size: 50MB</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-6">
                <button
                  type="button"
                  onClick={() => { setTitle(""); setDate(""); setCategory(""); setLink(""); }}
                  className="px-6 py-2.5 text-white/30 hover:text-white/60 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Clear Form
                </button>
                <button
                  type="button"
                  className="glow-btn bg-brand text-white px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2.5 shadow-[0_0_25px_rgba(0,102,255,0.4)]"
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  Deploy Event
                </button>
              </div>
            </div>

            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-brand/10 blur-[80px] rounded-full pointer-events-none group-hover/form:bg-brand/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
          </form>
        </div>

        {/* ── Live Preview ── */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              Live Preview
            </h3>
            <div className="h-px flex-1 mx-4 bg-white/[0.06]" />
            <span className="text-[10px] font-bold bg-brand/10 text-brand/80 px-2 py-0.5 border border-brand/20 uppercase tracking-widest">
              Global Timeline
            </span>
          </div>

          <div className="brutalist-card overflow-hidden group/preview">
            {/* Media placeholder */}
            <div className="h-[220px] bg-white/[0.02] relative flex items-center justify-center border-b border-white/[0.06]"
              style={{ backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,0.04) 1px,transparent 0)", backgroundSize: "24px 24px" }}
            >
              <div className="flex flex-col items-center gap-3 z-10">
                <div className="w-14 h-14 border border-white/[0.08] flex items-center justify-center text-white/10 group-hover/preview:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[36px]">play_circle</span>
                </div>
                <span className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Media Preview</span>
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{category || "Category"}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-3">
              <h4 className={`text-[22px] font-black uppercase tracking-tighter transition-all ${title ? "text-white" : "text-white/20"}`}>
                {title || "Your Event Title"}
              </h4>
              <div className="flex items-center gap-4 text-white/40 text-[13px]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-brand/60">calendar_today</span>
                  {date || "Select Date"}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-brand/60">location_on</span>
                  Virtual
                </div>
              </div>
              <p className={`text-[13px] leading-relaxed line-clamp-2 ${title ? "text-white/40" : "text-white/10 italic"}`}>
                {title
                  ? `Experience ${title} — a futuristic event pushing the boundaries of technology and innovation.`
                  : "Event description will appear here based on your title and category..."}
              </p>
              <div className="mt-2 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 border-2 border-dark bg-white/5 rounded-full" />
                  ))}
                  <div className="w-6 h-6 border-2 border-dark bg-brand/10 rounded-full flex items-center justify-center text-[7px] font-bold text-brand">+12</div>
                </div>
                <div className="px-3 py-1.5 border border-white/[0.06] text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover/preview:border-brand/30 group-hover/preview:text-brand transition-all">
                  View Details
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border border-white/[0.06] bg-white/[0.02] flex gap-3 items-start">
            <span className="material-symbols-outlined text-brand/50 text-[18px]">info</span>
            <p className="text-[12px] text-white/60 leading-relaxed font-medium">
              Your event will be instantly visible to over{" "}
              <span className="text-white/80">2,500+ active participants</span> in the 4th Dimension global timeline once deployed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
