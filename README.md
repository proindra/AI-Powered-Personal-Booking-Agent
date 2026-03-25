# ConnectSphere

A kinetic, single-page event platform built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. ConnectSphere connects founders, engineers, designers, and marketers through live conferences, lectures, workshops, and AI-powered session booking.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D Engine | Three.js / React Three Fiber |
| Physics | React Three Rapier |
| Fonts | Epilogue (Google Fonts) |
| Icons | Material Symbols Outlined |
| Smooth Scroll | Lenis |
| AI Booking | LangGraph (FastAPI backend) |

---

## ⚠️ Critical Technical Notes

> [!IMPORTANT]
> **Single-Page Architecture**: This project is strictly a Single-Page Application (SPA). All core sections (Networking, Booking, etc.) are implemented as IDs within `app/(main)/page.tsx`. **Do not add standalone page directories** (e.g., `/networking`) as they break the unified kinetic scroll experience.

> [!NOTE]
> **Conditional BasePath**: To support GitHub Pages deployment, `next.config.ts` uses a conditional `basePath`.
> - **Development**: Accessible at `http://localhost:3000/`
> - **Production**: Deployed at `/[Repository-Name]/`
> *If you change the repository name, update the `basePath` in `next.config.ts`.*

> [!TIP]
> **Environment Variables**: Create a `.env.local` file in the `frontend` directory:
> ```env
> LANGGRAPH_API_URL=your_backend_url_here
> ```
> This is required for the AI Booking Agent to communicate with the LangGraph backend.

---

## Project Structure

```text
/
├── frontend/             # Next.js Application Root
│   ├── app/              # App Router (Single-page layout)
│   │   ├── (main)/page.tsx # THE main page (all sections)
│   │   ├── (auth)/signin  # Sign-in page
│   │   ├── api/booking    # AI Agent proxy route
│   │   └── globals.css    # Branding & Animations
│   ├── components/       # Reusable Brutalist UI components
│   ├── public/           # Favicon & Brand Assets
│   └── next.config.ts    # Deployment & Path configuration
├── .github/              # CI/CD Workflows
└── README.md             # Project Documentation
```

## 🚀 Key Features

- **3D Interactive Lanyard (Optimized)**: A physics-based, draggable 3D lanyard featuring a reactive ribbon and the branding.
  - *Performance*: Preloaded GLTF assets, capped DPR (1.5x) for 60fps, and a beautiful shimmer skeleton loading state.
- **Kinetic Single-Page UX**: Seamless transitions between sections via smooth inertia scrolling and reveal animations.
- **AI-Powered Booking**: Real-time natural language scheduling via LangGraph integration.
- **Brutalist Design System**: High-impact typography, custom kinetic animations, and a refined \"clean & neat\" CSS architecture.
- **Responsive Integrity**: Pixel-perfect layout across all viewports with zero clipping.

## 🚀 Implemented Features (By Pavan)

- **Interactive 3D Lanyard (Three.js / GLTF optimization)**
- **Smooth Kinetic Scrolling UX**
- **Responsive Design System**
- **Frontend Booking UI (without backend integration)**
- **Animation & Micro-interactions**

## 🚀 Planned Features

1. **Real Backend Server**: Local FastAPI/LangGraph implementation for actual booking logic, calendar integration (Google/Outlook API), and data persistence (SQLite/Postgres).
2. **User Authentication**: Full NextAuth.js/Clerk integration for user profiles, booking history, and personalized recommendations.
3. **Calendar Synchronization**: Real-time availability checks and booking sync with Google Calendar, Apple Calendar, or iCal.
4. **Payment Processing**: Stripe integration for paid sessions, workshops, and dynamic pricing based on demand/speaker.
5. **Speaker Directory**: Searchable database of speakers with bios, availability calendars, ratings, and AI-powered matching.
6. **Group & Multi-Attendee Bookings**: Support for team bookings, waitlists, and shared calendars.
7. **Video Conferencing**: Automatic Zoom/Twilio Video links generation post-booking.
8. **Voice-Enabled Chat**: Web Speech API for hands-free natural language booking.
9. **Post-Booking Automation**: Email confirmations (Resend), calendar invites, feedback surveys, and follow-up reminders.
10. **Live Event Dashboard**: Real-time attendee tracking, networking matchmaking (AI similarity scoring), and session status updates.
11. **Personalized Recommendations**: ML-based session suggestions using past bookings, preferences, and event metadata.
12. **Multi-Language Support**: AI translation agent for global accessibility.
13. **Analytics Dashboard**: Organizer tools for booking metrics, conversion rates, revenue tracking.
14. **PWA & Offline Mode**: Service Worker for offline chat queuing and push notifications.
15. **AR/VR Session Previews**: WebXR integration to preview event venues/sessions in AR.
16. **Multi-Agent Workflow**: LangGraph agents for parallel tasks (availability + payment + confirmation).
17. **Social Sharing**: Share booking links, generate QR codes for check-ins.
18. **Waitlist & Notifications**: SMS/Email alerts when preferred slots open up.
19. **Feedback & Ratings**: Post-session reviews influencing future recommendations.
20. **Admin Panel**: Event organizers manage speakers, slots, and pricing via dashboard.

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

| Environment | URL |
|---|---|
| Production | [proindra.github.io/AI-Powered-Personal-Booking-Agent/](https://proindra.github.io/AI-Powered-Personal-Booking-Agent/) |
| Local Dev | `http://localhost:3000/` |

---

## 🎨 Animations & UX

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

## 🛠️ Project Evolution & Cleanup

- **CSS Deduplication**: Removed ~30% redundant CSS, collapsed repeating @keyframes, and unified active reveal states.
- **Font Optimization**: Switched from double-loading (CSS @import + link) to a single high-priority `<link>` for Material Symbols.
- **Component Scaling**: Refined the 3D Lanyard texture mapping to prevent logo overflow and improved material visibility in dark mode.

---

## 👥 Team

Built with love by **Team Net-Y** @ 2026
