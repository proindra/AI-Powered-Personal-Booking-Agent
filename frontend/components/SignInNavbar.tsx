"use client";
import { useRouter } from "next/navigation";

export default function SignInNavbar() {
  const router = useRouter();

  function goHome() {
    router.push("/");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 100);
  }

  return (
    <header className="w-full px-6 lg:px-8 py-4 flex justify-between items-center z-50 fixed top-0 left-0 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <button
        onClick={goHome}
        className="text-xl font-black leading-none tracking-tighter hover:scale-105 transition-transform text-left"
      >
        CONNECT<br />
        <span className="text-brand">SPHERE</span>
      </button>

      <button
        onClick={goHome}
        className="nav-link text-[10px] sm:text-xs flex items-center gap-2 hover:text-brand transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Home
      </button>
    </header>
  );
}


