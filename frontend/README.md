# ConnectSphere

A kinetic, single-page event platform built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. ConnectSphere connects founders, engineers, designers, and marketers through live conferences, lectures, workshops, and AI-powered session booking.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Fonts | Epilogue (Google Fonts) |
| Icons | Material Symbols Outlined |
| Smooth Scroll | Lenis |
| AI Booking | LangGraph (FastAPI backend) |

---

## Project Structure

```
connectsphere-next/
├── app/
│   ├── events/page.tsx        # Main single-page site (all sections)
│   ├── signin/page.tsx        # Sign in page
│   ├── networking/page.tsx    # Standalone networking page
│   ├── contact/page.tsx       # Standalone contact page
│   ├── booking/page.tsx       # Standalone AI booking page
│   ├── api/booking/route.ts   # LangGraph booking API proxy
│   ├── layout.tsx             # Root layout (Navbar, Footer, Canvas)
│   └── globals.css            # Global styles & animations
├── components/
│   ├── Navbar.tsx             # Fixed navbar with smooth scroll
│   ├── Footer.tsx             # Footer with hash link scroll
│   ├── EventStackScroll.tsx   # Scroll-stack upcoming events
│   ├── TrustedByLeaders.tsx   # Animated logo pod section
│   ├── ExploreTechSection.tsx # Typewriter + SVG section
│   ├── BookingChat.tsx        # AI chat UI (streaming SSE)
│   ├── BookingPageClient.tsx  # Booking page client wrapper
│   ├── AmbientCanvas.tsx      # Animated background canvas
│   ├── AmbientCanvasLoader.tsx# Dynamic import wrapper
│   └── ScrollEffects.tsx      # Lenis init, reveal, nav highlight
```

---

## Pages & Sections

The site is designed as a **single-page experience**. All sections live on `/events` and are accessible via smooth scroll from the navbar:

1. **Hero** — Speaker strip, marquee, Save My Spot CTA
2. **Would Be Useful For** — Staggered card grid
3. **Upcoming Events** — Scroll-stack animation (4 events)
4. **Featured Speakers** — Speaker cards with booking links
5. **Events Reel** — Auto-scrolling carousel
6. **Networking** — Hero, bento grid features, CTA
7. **AI Booking** — LangGraph-powered chat agent
8. **Contact** — Floating label form + global presence map
9. **Trusted By Leaders** — Animated breathing pod network
10. **Explore Tech Today** — Typewriter + animated SVG

---

## Getting Started

### 1. Install dependencies

```bash
cd connectsphere-next
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
LANGGRAPH_API_URL=http://localhost:8000
LANGGRAPH_API_KEY=your_api_key_here   # optional
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## AI Booking Agent

The booking feature proxies requests to a **LangGraph FastAPI** backend.

- Without a backend connected, it falls back to a **mock streaming response** for demo purposes
- To connect your backend, set `LANGGRAPH_API_URL` in `.env.local`
- The API route is at `app/api/booking/route.ts`

---

## Animations

| Animation | Description |
|---|---|
| `reveal` | Fade + slide up on scroll |
| `reveal-left` | Fade + slide from left |
| `reveal-right` | Fade + slide from right |
| `reveal-scale` | Fade + scale up |
| `stagger-children` | Auto-staggers child elements |
| `animate-float-subtle` | Gentle float for speaker images |
| `animate-glow-pulse` | Orange glow pulse for CTA buttons |
| `breathe-pod` | Organic breathing for logo pods |
| Scroll stack | Cards slide up over each other on scroll |
| Lenis | Smooth inertia scrolling site-wide |

---

## Deployment

Deploy instantly on **Vercel**:

```bash
npm run build
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

---

## Team

Built with love by **Team Net-Y** @ 2026
