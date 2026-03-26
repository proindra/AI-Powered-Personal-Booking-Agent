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
│   ├── app/              # App Router
│   │   ├── (main)/page.tsx  # Main landing page (kinetic scroll sections)
│   │   ├── (auth)/signin    # Sign-in page with 3D Lanyard feature
│   │   ├── profile/page.tsx # User Profile dashboard with Lanyard integration
│   │   ├── api/booking      # AI Agent proxy route
│   │   └── globals.css      # Branding & Animations
│   ├── components/       # Reusable Brutalist UI & 3D canvas components
│   ├── lib/auth/         # Authentication logic (Google Auth & Session Storage)
│   ├── public/           # GLTF models, textures, Favicon & Brand Assets
│   └── next.config.ts    # Deployment & Path configuration
├── .github/              # CI/CD Workflows for GitHub Pages deployment
└── README.md             # Project Documentation
```

## 🚀 Key Features

- **3D Interactive Lanyard (Optimized)**: A physics-based, draggable 3D lanyard featuring a reactive ribbon and the branding.
  - *Performance*: Preloaded GLTF assets, capped DPR (1.5x) for 60fps, and a beautiful shimmer skeleton loading state.
- **Kinetic Single-Page UX**: Seamless transitions between sections via smooth inertia scrolling and reveal animations.
- **AI-Powered Booking**: Real-time natural language scheduling via LangGraph integration.
- **Brutalist Design System**: High-impact typography, custom kinetic animations, and a refined \"clean & neat\" CSS architecture.
- **Responsive Integrity**: Pixel-perfect layout across all viewports with zero clipping.

## 🚀 Implemented Features

- **Interactive 3D Lanyard**: A physics-based, draggable 3D lanyard featuring a reactive ribbon, preloaded GLTF assets, and a beautiful shimmer skeleton loading state. Integrated gracefully into both the sign-in and user profile pages.
- **Authentication & User Profile**: Google Auth implementation utilizing `localStorage` to manage user sessions seamlessly, complete with a dedicated, responsive user profile dashboard.
- **Kinetic Single-Page UX**: Seamless transitions between sections via smooth inertia scrolling and reveal animations powered by Lenis.
- **Frontend Booking UI**: High-impact conversational interfaces and forms tailored for AI booking (awaiting LangGraph backend integration).
- **Brutalist Design System**: High-impact typography, custom kinetic animations, glassmorphism logic, and responsive CSS architecture maintaining perfection across all viewports.

## 🚀 Planned Features

1. **Payment Processing**: Stripe integration for paid sessions, workshops, and dynamic pricing based on demand/speaker.
2. **Speaker Directory**: Searchable database of speakers with bios, availability calendars, ratings, and AI-powered matching.
3. **Group & Multi-Attendee Bookings**: Support for team bookings, waitlists, and shared calendars.
4. **Video Conferencing**: Automatic Zoom/Twilio Video links generation post-booking.
5. **Post-Booking Automation**: Email confirmations (Resend), calendar invites, feedback surveys, and follow-up reminders.
6. **Live Event Dashboard**: Real-time attendee tracking, networking matchmaking (AI similarity scoring), and session status updates.
7. **Personalized Recommendations**: ML-based session suggestions using past bookings, preferences, and event metadata.
8. **Multi-Language Support**: AI translation agent for global accessibility.
9. **Analytics Dashboard**: Organizer tools for booking metrics, conversion rates, revenue tracking.
10. **AR/VR Session Previews**: WebXR integration to preview event venues/sessions in AR.
11. **Multi-Agent Workflow**: LangGraph agents for parallel tasks (availability + payment + confirmation).
12. **Social Sharing**: Share booking links, generate QR codes for check-ins.
13. **Waitlist & Notifications**: SMS/Email alerts when preferred slots open up.
14. **Feedback & Ratings**: Post-session reviews influencing future recommendations.
15. **Admin Panel**: Event organizers manage speakers, slots, and pricing via dashboard.

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

- **Performance Optimization**: Implemented Next.js `dynamic` imports to lazy-load heavy interactive and 3D components (like `EventStackScroll`), significantly improving initial page load speed and TTFB.
- **CSS Deduplication**: Removed ~30% redundant CSS, collapsed repeating @keyframes, and unified active reveal states.
- **Font Optimization**: Switched from double-loading (CSS @import + link) to a single high-priority `<link>` for Material Symbols.
- **Component Scaling**: Refined the 3D Lanyard texture mapping to prevent logo overflow and improved material visibility in dark mode.

---

## 👥 Team

Built with love by **Team Net-Y** @ 2026
