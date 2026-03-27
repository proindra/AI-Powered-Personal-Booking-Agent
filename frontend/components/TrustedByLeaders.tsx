"use client";

const pods = [
  { style: { top: "5%", left: "8%" }, size: 96, icon: "schema", color: "brand", delay: "0s", iconSize: 40 },
  { style: { top: "15%", right: "20%" }, size: 128, icon: "account_tree", color: "brand", delay: "-2s", iconSize: 48 },
  { style: { bottom: "20%", left: "22%" }, size: 112, icon: "lan", color: "accent", delay: "-4s", iconSize: 48 },
  { style: { bottom: "25%", right: "10%" }, size: 96, icon: "memory", color: "brand", delay: "-6s", iconSize: 40 },
  { style: { top: "50%", left: "2%" }, size: 80, icon: "api", color: "accent", delay: "-8s", iconSize: 32 },
  { style: { top: "45%", right: "3%" }, size: 112, icon: "hub", color: "brand", delay: "-5s", iconSize: 56 },
  { style: { top: "25%", left: "15%" }, size: 64, icon: "language", color: "accent", delay: "-3s", iconSize: 20, faint: true },
  { style: { bottom: "10%", right: "35%" }, size: 64, icon: "dns", color: "accent", delay: "-7s", iconSize: 24, faint: true },
  { style: { bottom: "5%", left: "5%" }, size: 80, icon: "router", color: "brand", delay: "-1s", iconSize: 48 },
  { style: { top: "2%", left: "45%" }, size: 56, icon: "stream", color: "accent", delay: "-9s", iconSize: 18, faint: true },
  { style: { bottom: "2%", left: "45%" }, size: 64, icon: "webhook", color: "brand", delay: "-4s", iconSize: 20, faint: true },
  { style: { top: "5%", right: "5%" }, size: 80, icon: "integration_instructions", color: "brand", delay: "-8s", iconSize: 32 },
];

export default function TrustedByLeaders() {
  return (
    <section className="py-32 relative bg-dark overflow-hidden scroll-mt-32" id="trusted-leaders">
      <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl lg:text-[120px] font-black uppercase tracking-tighter leading-none mb-16 lg:mb-32 reveal delay-1">
          TRUSTED BY LEADERS
        </h2>
        <div className="relative h-[600px] w-full max-w-5xl mx-auto reveal delay-2">

          {pods.map((pod, i) => (
            <div
              key={i}
              className={`absolute bg-dark border border-white/10 rounded-full flex items-center justify-center group breathe-pod cursor-pointer shadow-lg transition-all hover:scale-110 ${pod.faint ? "z-0" : "z-10"} ${pod.color === "brand" ? "hover:border-[#0066FF]" : "hover:border-[#0066FF]"}`}
              style={{
                ...pod.style,
                width: pod.size,
                height: pod.size,
                animationDelay: pod.delay,
              }}
            >
              <span
                className="material-symbols-outlined transition-colors"
                style={{
                  fontSize: pod.iconSize,
                  fontVariationSettings: "'FILL' 1",
                  color: pod.faint ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = pod.color === "brand" ? "#0066FF" : "#0066FF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = pod.faint ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)";
                }}
              >
                {pod.icon}
              </span>
            </div>
          ))}

          {/* Center CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] max-w-[380px]">
            <div className="bg-[#0066FF] w-full aspect-square rounded-full flex flex-col items-center justify-center shadow-[0_0_80px_rgba(0,102,255,0.4)] group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-[0_0_120px_rgba(0,102,255,0.7)] p-6">
              <h3 className="text-white text-2xl lg:text-3xl font-black uppercase leading-tight mb-6 text-center group-hover:scale-105 transition-transform">
                PUT YOUR BRAND<br />ON THE GLOBAL STAGE
              </h3>
              <button className="glow-btn bg-white text-[#0066FF] font-black py-3 lg:py-4 px-8 lg:px-10 rounded-lg uppercase tracking-widest text-xs lg:text-sm hover:bg-black hover:text-white transition-colors shadow-2xl">
                Collaborate
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


