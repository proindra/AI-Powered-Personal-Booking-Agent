"use client";
import { useEffect, useRef } from "react";

export default function ExploreTechSection() {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const words = ["TECH", "BUSINESS"];
    let wi = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (!el) return;
      const word = words[wi];
      if (!deleting) {
        el.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1800);
          return;
        }
      } else {
        el.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      timer = setTimeout(tick, deleting ? 80 : 120);
    }
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-32 relative flex flex-col items-center justify-center text-center overflow-hidden z-10" id="explore-tech">
      <p className="text-[0.65rem] font-bold tracking-[0.4em] text-white/40 uppercase mb-6">TAKE ACTION</p>
      <h2 className="text-5xl md:text-[100px] font-black uppercase tracking-tighter leading-none mb-12">
        EXPLORE <span className="text-brand" ref={elRef}></span> TODAY
      </h2>
      <div className="w-full md:w-[55%] max-w-[600px] mt-8 px-4">
        <svg className="w-full h-auto" viewBox="0 0 1000 400">
          <path
            className="neon-path"
            d="M100,300 L300,50 L500,350 L700,100 L900,300"
            fill="none"
            stroke="#0066FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="60"
          />
        </svg>
      </div>
    </section>
  );
}


