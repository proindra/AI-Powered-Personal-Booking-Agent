"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children";

const SECTIONS = [
  { id: "upcoming-events",   navHref: "/#upcoming-events" },
  { id: "featured-speakers", navHref: "/#featured-speakers" },
  { id: "networking",        navHref: "/#networking" },
  { id: "contact",           navHref: "/#contact" },
];

export default function ScrollEffects() {
  const pathname = usePathname();

  // Initialize Lenis once — wait for script to load if needed
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    let cancelled = false;

    const init = () => {
      if (win.lenis) return;
      if (!win.Lenis) return;
      win.lenis = new win.Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });
      const raf = (time: number) => {
        // Stop the loop if Lenis was destroyed or the component unmounted
        if (cancelled || !win.lenis) return;
        win.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    };

    init();
    const interval = setInterval(() => {
      if (win.Lenis) { init(); clearInterval(interval); }
    }, 100);

    // Destroy Lenis when this layout unmounts (e.g. navigating to dashboard)
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (win.lenis) {
        win.lenis.destroy();
        win.lenis = null;
      }
    };
  }, []);

  // Reveal animations + navbar shrink + active section tracking
  useEffect(() => {
    const header = document.querySelector("header");

    // --- Navbar shrink on scroll ---
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 60) {
        header.classList.add("navbar-shrunk");
      } else {
        header.classList.remove("navbar-shrunk");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Reveal observer ---
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("active");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const timer = setTimeout(() => {
      const els = document.querySelectorAll(REVEAL_SELECTORS);
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.05) {
          el.classList.add("active");
        } else {
          revealObserver.observe(el);
        }
      });
    }, 100);

    // --- Active section nav highlight (scroll-position based) ---
    const updateActiveNav = () => {
      // At the very top — clear all active states
      if (window.scrollY < 50) {
        document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active-section"));
        return;
      }
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      document.querySelectorAll(".nav-link").forEach((link) => {
        const href = link.getAttribute("href") ?? "";
        const match = SECTIONS.find((s) => s.id === current && s.navHref === href);
        link.classList.toggle("active-section", !!match);
      });
    };
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    // Delay initial call to let DOM settle with correct offsetTops
    setTimeout(updateActiveNav, 200);

    // --- Page enter animation ---
    const main = document.querySelector("main");
    if (main) {
      main.classList.add("page-enter");
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", updateActiveNav);
      revealObserver.disconnect();
    };
  }, [pathname]);

  return null;
}


