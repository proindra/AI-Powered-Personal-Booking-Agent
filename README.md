# 4th Dimension Workspace

An AI-powered event booking platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and a **FastAPI + LangGraph** backend. Connect founders, engineers, designers, and marketers through live conferences, workshops, and AI-assisted session booking — all synced with Google Calendar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D Engine | Three.js / React Three Fiber |
| Physics | React Three Rapier |
| Fonts | Epilogue (Google Fonts) |
| Icons | Material Symbols Outlined |
| Smooth Scroll | Lenis |
| AI Agent | LangGraph + Gemini / OpenAI |
| Backend | FastAPI (Python) |
| Calendar | Google Calendar API (OAuth 2.0) |

---

## Project Structure

```
/
├── frontend/                              # Next.js Application
│   ├── app/
│   │   ├── layout.tsx                     # Root layout — metadata, AmbientCanvas, global CSS
│   │   ├── globals.css                    # Design tokens, animations, utility classes
│   │   ├── icon.svg                       # Favicon / brand icon
│   │   │
│   │   ├── (main)/                        # Public landing page group
│   │   │   ├── layout.tsx                 # Wraps with Navbar, Footer, ScrollEffects, Lenis
│   │   │   └── page.tsx                   # Hero, Useful For, Add Event, Upcoming Events, Contact
│   │   │
│   │   ├── (auth)/                        # Auth route group
│   │   │   ├── layout.tsx                 # Wraps with SignInNavbar + Lenis
│   │   │   └── signin/page.tsx            # 3-panel sign-in: brand panel, SignInForm, 3D Lanyard
│   │   │
│   │   ├── (dashboard)/                   # Workspace dashboard group (auth-guarded)
│   │   │   ├── layout.tsx                 # Sidebar nav, header, mobile bottom nav
│   │   │   ├── events/page.tsx            # Event timeline — active, urgent, archived nodes
│   │   │   ├── calendar/page.tsx          # Google Calendar full view (FullCalendarDashboard)
│   │   │   ├── watchlist/page.tsx         # Saved events timeline with reminders
│   │   │   ├── submit/page.tsx            # Deploy Event form with live preview panel
│   │   │   └── event/[id]/page.tsx        # Event detail — hero, video briefing, milestones
│   │   │
│   │   ├── profile/page.tsx               # User profile + CalendarPanel + 3D Lanyard
│   │   └── api/booking/route.ts           # API proxy → FastAPI /chat (with mock SSE fallback)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                 # Landing page nav with smooth hash scroll
│   │   │   ├── Footer.tsx                 # Social links, site map, newsletter
│   │   │   ├── SignInNavbar.tsx           # Minimal navbar for auth pages
│   │   │   └── ScrollEffects.tsx          # Lenis + reveal animation observer
│   │   ├── events/
│   │   │   ├── EventStack.tsx             # Scroll-stacked event cards with Google Calendar booking
│   │   │   └── AddEvent.tsx               # Add event form — syncs to stack + Google Calendar
│   │   ├── calendar/
│   │   │   ├── CalendarDashboard.tsx      # Slide-in calendar panel (modal style)
│   │   │   ├── FullCalendarDashboard.tsx  # Full-page Google Calendar view
│   │   │   └── VerticalTimeline.tsx       # 48-hour availability timeline widget
│   │   ├── 3d/
│   │   │   ├── Lanyard.tsx                # Physics-based draggable 3D lanyard (R3F + Rapier)
│   │   │   ├── LanyardLoader.tsx          # Dynamic loader with error boundary for Lanyard
│   │   │   ├── AmbientCanvas.tsx          # Subtle background WebGL canvas
│   │   │   └── AmbientCanvasLoader.tsx    # Dynamic loader for AmbientCanvas
│   │   └── auth/
│   │       ├── SignInForm.tsx             # Google OAuth + Guest sign-in form
│   │       └── UserAvatar.tsx             # Session-aware avatar in Navbar
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── config.ts                  # GOOGLE_CLIENT_ID, BASE_PATH, goto() helper
│   │   │   ├── google.ts                  # OAuth flow, Calendar API (create/fetch events)
│   │   │   └── types.ts                   # AuthSession type, saveSession / getSession / clearSession
│   │   └── calendar/
│   │       └── useCalendar.ts             # React hook — reads Google Calendar events
│   │
│   ├── utils/paths.ts                     # Base-path-aware URL builder
│   ├── public/
│   │   ├── card.glb                       # GLTF model for 3D Lanyard card
│   │   └── lanyard.png                    # Lanyard texture
│   ├── next.config.ts                     # Conditional basePath for GitHub Pages
│   └── package.json
│
├── backend/
│   ├── main.py                            # FastAPI app — POST /chat, GET /health
│   ├── agent.py                           # LangGraph agent graph definition
│   ├── state.py                           # AgentState Pydantic schema
│   ├── tools.py                           # Calendar check + booking tools
│   ├── .env.example                       # Backend env template
│   └── requirements.txt
│
├── LOCAL_DEV.md                           # Full step-by-step local setup guide
└── README.md
```

---

## Key Features

### Landing Page (`/`)
- Brutalist dark design with `#0066FF` brand blue
- TypeAnimation hero heading cycling through BUSINESS / SCHEDULE / MEETINGS / WORKFLOW
- Smooth inertia scroll via Lenis with scroll-triggered reveal animations
- Scroll-stacked event cards — cards slide up over each other as you scroll, each bookable to Google Calendar
- Add Event form — creates events live in the stack and optionally syncs to Google Calendar
- "Useful For" grid with hover image reveals (Founders, Design Leads, Marketers, Engineers)
- Contact section with floating-label form inputs

### Sign In (`/signin`)
- 3-panel layout: brand panel (left) + sign-in form (center) + 3D Lanyard (right)
- Google OAuth (email + profile scope) and Guest mode
- Session persisted in `localStorage` via `saveSession` / `getSession` / `clearSession`
- Auth-guarded — guest users redirected to sign in when accessing the dashboard

### 4th Dimension Workspace (Dashboard)
Shared layout with sidebar nav, header, and mobile bottom nav. All pages use the same dark design language as the landing page.

| Route | Page | Description |
|---|---|---|
| `/events` | Event Timeline | Chronological timeline with active, urgent (red pulsing), and archived event nodes |
| `/calendar` | Calendar | Full Google Calendar view — connect, browse, and manage events |
| `/watchlist` | Watchlist | Saved events with countdown timers, reminder toggles, and bookmark support |
| `/submit` | Deploy Event | Form to submit a new event with live preview panel; deploys to the global timeline |
| `/event/[id]` | Event Detail | Hero image, video briefing with chapters, milestone roadmap |

### Profile (`/profile`)
- Left panel: avatar, email, auth type, Google Calendar events list
- Right panel: interactive 3D physics lanyard with user's profile picture on the card
- Connect Google Calendar directly from the profile page

### AI Booking Agent
- FastAPI backend with a LangGraph agent powered by Gemini (`gemini-1.5-flash`) or OpenAI
- `POST /chat` accepts `{ messages, calendar_token }` and streams SSE back
- Agent has calendar tools for checking availability and creating events
- Frontend sends full conversation history for persistent context across turns
- API proxy at `/api/booking/route.ts` with built-in mock SSE fallback when backend is unreachable
- Backend URL configurable at runtime via `localStorage` (`cs_backend_url`)

### Google Calendar Integration
- Incremental OAuth consent — calendar scope is separate from sign-in scope
- Token stored as `calendar_token` in `localStorage`
- `createGoogleCalendarEvent` / `fetchGoogleCalendarEvents` in `lib/auth/google.ts`
- `useCalendar()` hook for reading events (used in Profile page)
- Live VerticalTimeline widget showing 48-hour availability window

### 3D Interactive Lanyard
- Physics-based draggable lanyard on sign-in and profile pages
- Built with React Three Fiber + React Three Rapier
- Loads `card.glb` GLTF model with `lanyard.png` texture
- DPR capped at 1.5× for smooth 60 fps, shimmer skeleton while loading

---

## Getting Started

> **Moving to a new machine?** Your `.env` files are git-ignored. You must create `backend/.env` and `frontend/.env.local` manually. See [LOCAL_DEV.md](./LOCAL_DEV.md) for the full step-by-step guide.

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Cloud project with OAuth 2.0 credentials (Web application type)

### 1. Clone & Install Frontend

```bash
git clone https://github.com/proindra/AI-Powered-Personal-Booking-Agent.git
cd AI-Powered-Personal-Booking-Agent/frontend
npm install
```

### 2. Configure Frontend Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:8000
```

### 3. Run Frontend Dev Server

```bash
npm run dev
# → http://localhost:3000
```

### 4. Set Up & Run Backend (optional — for AI chat)

```bash
cd backend
python -m venv .venv
# macOS: source .venv/bin/activate
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
LLM_PROVIDER=gemini
GEMINI_MODEL=gemini-1.5-flash
GOOGLE_API_KEY=your_google_api_key_here
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `frontend/.env.local` | Google OAuth client ID |
| `NEXT_PUBLIC_LANGGRAPH_API_URL` | `frontend/.env.local` | Backend API base URL |
| `LLM_PROVIDER` | `backend/.env` | `gemini` or `openai` |
| `GEMINI_MODEL` | `backend/.env` | e.g. `gemini-1.5-flash` |
| `GOOGLE_API_KEY` | `backend/.env` | Google AI Studio API key |
| `OPENAI_API_KEY` | `backend/.env` | OpenAI key (if using OpenAI) |

> The frontend also reads `cs_backend_url` from `localStorage` at runtime — this overrides `NEXT_PUBLIC_LANGGRAPH_API_URL` without a server restart.

## How It All Connects

```
Browser (localhost:3000)
        │
        ▼  POST /api/booking
Next.js API Route  ──── mock SSE fallback if backend unreachable
        │
        ▼  POST /chat
FastAPI Backend (localhost:8000)
        │
        ▼
LangGraph Agent  (Gemini / OpenAI)
        │
        ▼
Google Calendar API  (if user granted calendar access)
```

The proxy at `app/api/booking/route.ts` forwards requests to the FastAPI backend. If the backend is down, it returns a mock SSE stream so the UI stays functional for demos.

---

## Deployment

| Environment | URL |
|---|---|
| Production | [proindra.github.io/AI-Powered-Personal-Booking-Agent/](https://proindra.github.io/AI-Powered-Personal-Booking-Agent/) |
| Local Dev | `http://localhost:3000` |

Pushes to `main` trigger automated GitHub Pages deployment via GitHub Actions.

> **Conditional BasePath**: `next.config.ts` applies a `basePath` for GitHub Pages in production. If you change the repository name, update `basePath` in `next.config.ts`.

---

## Animations & Design System

| Token / Class | Description |
|---|---|
| `bg-dark` | Site background (`#020813`) |
| `text-brand` / `bg-brand` | Brand blue (`#0066FF`) |
| `brutalist-card` | Dark bordered card with subtle glow |
| `glow-btn` | Button with brand blue box-shadow |
| `reveal` | Fade + slide up on scroll |
| `reveal-left` / `reveal-right` | Directional reveal animations |
| `stagger-children` | Auto-staggers child element animations |
| `animate-float-subtle` | Gentle float for hero SVG |
| Scroll stack | Event cards slide up over each other on scroll |
| Lenis | Smooth inertia scrolling site-wide |

---

## Component Map

| Folder | Components |
|---|---|
| `components/layout/` | `Navbar`, `Footer`, `SignInNavbar`, `ScrollEffects` |
| `components/events/` | `EventStack`, `AddEvent` |
| `components/calendar/` | `CalendarDashboard`, `FullCalendarDashboard`, `VerticalTimeline` |
| `components/3d/` | `Lanyard`, `LanyardLoader`, `AmbientCanvas`, `AmbientCanvasLoader` |
| `components/auth/` | `SignInForm`, `UserAvatar` |

---

## Common Issues

**Google Sign-In not working**
- Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local`
- Add `http://localhost:3000` as an Authorized JavaScript Origin in Google Cloud Console

**"Could not connect to booking agent"**
- Confirm the backend is running on port 8000
- Check `NEXT_PUBLIC_LANGGRAPH_API_URL` in `frontend/.env.local`

**Calendar sync not working**
- Sign in with Google, then connect your calendar from the Profile page
- The agent only syncs after the user explicitly grants calendar permissions

**`npm run dev` fails**
- Run `npm install` inside `frontend/` first

See [LOCAL_DEV.md](./LOCAL_DEV.md) for the full troubleshooting guide.

---

Built with love by **Team Net-Y** @ 2026
