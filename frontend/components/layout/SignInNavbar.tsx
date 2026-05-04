"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInNavbar() {
  const router = useRouter();

  return (
    <header className="w-full px-6 lg:px-8 py-4 flex justify-between items-center z-50 fixed top-0 left-0 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <Link
        href="/"
        className="text-xl font-black leading-none tracking-tighter hover:scale-105 transition-transform"
      >
        4TH<br />
        <span className="text-brand">DIMENSION</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link href="/#upcoming-events" className="nav-link text-[10px]">Events</Link>
        <Link href="/#contact" className="nav-link text-[10px]">Contact</Link>
      </nav>

      <button
        onClick={() => router.push("/")}
        className="nav-link text-[10px] sm:text-xs flex items-center gap-2 hover:text-brand transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Home
      </button>
    </header>
  );
}
