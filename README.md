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
frontend/
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

## Connect Sphere - Personal Booking Agent

Connect Sphere is a premium, AI-powered personal booking and networking platform. It features a stunning brutalist design aesthetic built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Key Features

- **Single-Page Experience**: All core sections (Events, Networking, AI Booking, Contact) are accessible on the main page via smooth kinetic scrolling.
- **AI-Powered Booking**: Integrates a LangGraph-powered intelligent agent for natural language session booking.
- **Brutalist Design**: High-impact typography, dark mode, kinetic animations, and glassmorphism.
- **Responsive Layout**: Pixel-perfect alignment across mobile, tablet, and desktop devices.
- **Interactive UI**: Stack-scrolling event transitions, hover-responsive networking cards, and floating ambient background effects.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (with bespoke brutalist utilities)
- **Animations**: Framer Motion & CSS custom keyframes
- **Icons**: Google Material Symbols
- **Typography**: Epilogue (Google Fonts)

## 📁 Project Structure

```text
/
├── frontend/             # Next.js Application Root
│   ├── app/              # App Router Pages & Styles
│   ├── components/       # Reusable React Components
│   ├── public/           # Static Brand Assets
│   └── package.json      # Dependencies & Scripts
├── .github/              # GitHub Actions (Deployment)
└── README.md             # Project Documentation
```

## 💻 Getting Started

1. **Clone the repository**
2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Build for Production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

The project is configured for automated deployment to **GitHub Pages** via GitHub Actions. Any push to the `main` branch triggers a build and deploy cycle.

---
*Made with love by TEAM NET-Y*

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
