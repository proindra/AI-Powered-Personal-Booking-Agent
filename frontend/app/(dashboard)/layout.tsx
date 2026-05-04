"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  PlusSquare,
  Star,
  Settings as SettingsIcon,
  Bell,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { getSession } from "@/lib/auth/types";

const NAV_ITEMS = [
  { href: "/events",   icon: LayoutDashboard, label: "All Events"   },
  { href: "/calendar", icon: CalendarDays,    label: "Calendar"     },
  { href: "/watchlist",icon: Star,            label: "Watchlist"    },
  { href: "/submit",   icon: PlusSquare,      label: "Submit Pitch" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setUser(
      session?.profile
        ? { name: session.profile.name, picture: session.profile.picture }
        : {
            name: "Guest User",
            picture: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
          }
    );
  }, []);

  return (
    <div className="bg-dark text-white h-screen relative flex flex-col overflow-hidden">

      {/* ── Ambient background — matches landing page ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Same grid as globals.css body, but explicit for the dashboard shell */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Brand-blue glow orbs — same palette as landing */}
        <div
          className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(0,102,255,0.08) 0%,transparent 70%)" }}
        />
        <div
          className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(0,102,255,0.06) 0%,transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(0,102,255,0.04) 0%,transparent 70%)" }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="hidden md:flex h-[60px] shrink-0 items-center justify-between px-6 sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(2,8,19,0.85)", backdropFilter: "blur(24px)" }}
      >
        <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform">
          <span className="text-[17px] font-black tracking-tighter uppercase leading-none">
            4TH<br />
            <span className="text-brand">DIMENSION</span>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-white/40 normal-case mt-0.5">Workspace</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 border border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:border-white/20 transition-all group/home"
          >
            <Home className="w-3.5 h-3.5 group-hover/home:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="w-px h-4 bg-white/[0.1] mx-1" />
          <button className="relative w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/[0.08]">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(0,102,255,0.9)]" />
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar ── */}
        <aside
          className="hidden lg:flex flex-col w-[240px] shrink-0 h-[calc(100vh-60px)] sticky top-[60px] z-40 border-r border-white/[0.06]"
          style={{ background: "rgba(2,8,19,0.7)", backdropFilter: "blur(20px)" }}
        >
          {/* Glowing right edge */}
          <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent" />

          {/* Profile card */}
          <div className="px-4 pt-5 pb-4">
            <Link href="/profile" className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-brand/30 transition-colors cursor-pointer bg-white/[0.02]">
              <div className="relative shrink-0">
                <img
                  alt="User Avatar"
                  className="w-9 h-9 object-cover bg-white/5"
                  style={{ boxShadow: "0 0 0 2px rgba(0,102,255,0.5)" }}
                  src={user?.picture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-dark" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-white truncate leading-tight">
                  {user?.name ?? "Loading..."}
                </p>
                <p className="text-[10px] text-brand/70 font-bold mt-0.5 uppercase tracking-widest">✦ Platinum</p>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <div className="px-3 flex-1 flex flex-col gap-0.5 overflow-y-auto">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 px-2 pb-1.5 pt-1">
              Workspace
            </p>
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2.5 px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 group ${
                    active
                      ? "text-white bg-brand/10 border-l-2 border-brand"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06] border-l-2 border-transparent"
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center shrink-0 transition-all ${
                      active ? "text-brand" : "text-white/50 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(0,102,255,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Settings */}
          <div className="px-3 py-3 border-t border-white/[0.06]">
            <Link
              href="/settings"
              className="flex items-center gap-2.5 px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/[0.06] transition-all group border-l-2 border-transparent"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0 text-white/40 group-hover:text-white">
                <SettingsIcon className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-500" />
              </div>
              Settings
            </Link>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-[60px] border-t border-white/[0.06]"
        style={{ background: "rgba(2,8,19,0.95)", backdropFilter: "blur(24px)" }}
      >
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
                active ? "text-brand scale-110" : "text-white/60"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
