"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/#upcoming-events", label: "Upcoming Events" },
  { href: "/#featured-speakers", label: "Speakers" },
  { href: "/#networking", label: "Networking" },
  { href: "/#booking", label: "AI Booking" },
  { href: "/#contact", label: "Contact Us" },
];

function smoothScrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.querySelectorAll(".reveal").forEach((el) => el.classList.remove("active"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: -128, duration: 1.2 });
  } else {
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 128;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (pathname === "/") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      lenis ? lenis.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 100);
    }
  }

  function handleHashLink(e: React.MouseEvent, href: string) {
    const [path, hash] = href.split("#");
    if (!hash) return;
    e.preventDefault();
    const resolvedPath = path === "" ? "/" : path;
    if (pathname === resolvedPath) {
      smoothScrollToHash(`#${hash}`);
    } else {
      router.push(resolvedPath);
      setTimeout(() => smoothScrollToHash(`#${hash}`), 600);
    }
  }

  return (
    <header className="w-full px-6 lg:px-8 py-5 lg:py-8 flex justify-between items-center z-50 fixed top-0 left-0 backdrop-blur-xl bg-white/5 border-b border-white/10 transition-all duration-500">
      {/* Brand Logo */}
      <div className="brand-logo flex items-center gap-1">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="text-xl font-black leading-none tracking-tighter hover:scale-105 transition-transform cursor-pointer"
        >
          CONNECT<br />
          <span className="text-brand">SPHERE</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-4 lg:gap-10 text-[9px] md:text-xs overflow-x-auto whitespace-nowrap px-4 py-2">
        {links.map((link) => {
          const basePath = link.href.split("#")[0];
          const hasHash = link.href.includes("#");
          const isActive = !hasHash && pathname === basePath;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={hasHash ? (e) => handleHashLink(e, link.href) : undefined}
              className="nav-link"
              style={{ color: isActive ? "#FF5F1F" : undefined }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="cta-nav flex gap-4 items-center">
        <Link href="/signin" className="nav-link text-[10px] sm:text-xs">
          Sign In
        </Link>
        <Link href="/#contact" onClick={(e) => handleHashLink(e, "/#contact")}>
          <button className="glow-btn border border-white/20 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Save My Spot
          </button>
        </Link>
      </div>
    </header>
  );
}


