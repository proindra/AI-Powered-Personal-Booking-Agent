# ConnectSphere

A kinetic, single-page event platform built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. ConnectSphere connects founders, engineers, designers, and marketers through live conferences, lectures, workshops, and AI-powered session booking.

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
| AI Booking | LangGraph (FastAPI backend) |
| Calendar | Google Calendar API (OAuth 2.0) |

---

## ⚠️ Critical Technical Notes

> [!IMPORTANT]
> **Auth-Guarded Booking**: The "Try AI Booking" CTA on the landing page now checks for an existing session before navigating. Unauthenticated users are redirected to `/signin` first; authenticated users go directly to `/booking`.

> [!IMPORTANT]
> **Single-Page Architecture**: This project is strictly a Single-Page Application (SPA). All core sections (Networking, Booking, etc.) are implemented as IDs within `app/(main)/page.tsx`. **Do not add standalone page directories** (e.g., `/networking`) as they break the unified kinetic scroll experience. Note: `/booking`, `/signin`, and `/profile` are intentional standalone routes.

> [!NOTE]
> **Conditional BasePath**: To support GitHub Pages deployment, `next.config.ts` uses a conditional `basePath`.
> - **Development**: Accessible at `http://localhost:3000/`
> - **Production**: Deployed at `/[Repository-Name]/`
> *If you change the repository name, update the `basePath` in `next.config.ts`.*

> [!TIP]
> **Environment Variables**: Create a `.env.local` file in the `frontend` directory:
> ```env
> NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:8123
> ```
> The AI Booking chat also reads `cs_backend_url` from `localStorage` (overrideable via the Settings panel) — `localStorage` takes priority over the env var.

---

## Project Structure

```text
/
├── frontend/                    # Next.js Application Root
│   ├── app/
│   │   ├── (main)/page.tsx      # Landing page with auth-guarded CTA
│   │   ├── (auth)/signin/       # Sign-in page (Google OAuth + Guest)
│   │   ├── booking/             # Full-viewport AI Booking chat page
│   │   ├── profile/             # User Profile dashboard + Lanyard
│   │   ├── api/                 # API proxy routes
│   │   └── globals.css          # Branding & Animations
│   ├── components/
│   │   ├── BookingChat.tsx       # AI chat UI (sidebar, history, settings)
│   │   ├── BookingPageClient.tsx # Booking page shell
│   │   ├── Lanyard.tsx           # 3D physics lanyard component
│   │   ├── EventStackScroll.tsx  # Lazy-loaded scroll-stack events
│   │   └── auth/                 # UserAvatar, SignInForm components
│   ├── lib/
│   │   ├── auth/google.ts        # Google OAuth, Calendar token helpers
│   │   ├── auth/types.ts         # Session save/get/clear helpers
│   │   └── calendar/useCalendar.ts # Google Calendar read/write hook
│   ├── public/                   # GLTF models, textures, brand assets
│   └── next.config.ts            # Deployment & path configuration
├── .github/                      # CI/CD for GitHub Pages
└── README.md
```

---

## 🚀 Key Features

### AI Booking Interface (`/booking`)
A full-viewport, dark-themed chat UI — no longer embedded in the landing page:

- **ChatGPT-style History Sidebar**: Collapsible panel listing all past sessions with rename-on-first-message, delete, and new-chat support. Sessions persist in `localStorage`.
- **Narrow Icon Sidebar** (desktop only):
  - 🗂️ **History toggle** — open/close the chat history drawer
  - ➕ **New Chat** — start a fresh session
  - 📅 **Connect Google Calendar** — triggers incremental OAuth consent. Icon turns teal with a glowing status dot when connected. Toast feedback on connect/disconnect.
  - ⚙️ **Settings panel** — slide-in panel with:
    - Backend API URL editor (saved to `localStorage` as `cs_backend_url`)
    - Google Calendar connect / disconnect toggle
    - Clear all chat history
    - Sign out
- **Live Vertical Timeline Widget**: A 48-hour continuous scroll timeline visualizing live calendar availability. Renders blue blocks for booked meetings and pulsating neon teal blocks for AI-suggested time slots dynamically synced with the chat.
- **Native Gemini Integration**: The LangGraph backend is configured to use `gemini-flash-latest` via `.env`, supporting massive context windows and real-time tool calling.
- **Conversational Memory**: The React frontend sends the complete conversation history array during each API call, allowing the agent to continuously build context.
- **Continuous chat input** — Enter to send, Shift+Enter for newlines. Input stays focused across renders.
- **Google Calendar sync** — after a confirmed booking the AI will attempt to add the event to Google Calendar automatically (requires calendar token).

### Auth-Guarded CTA
The **"Try AI Booking"** button on the landing page:
- If the user **is signed in** → navigates directly to `/booking`
- If **not signed in** → redirects to `/signin` first

### Google Calendar Integration
- Separate incremental OAuth consent (does not affect sign-in scope)
- Token stored as `calendar_token` in `localStorage`
- `hasCalendarAccess()` / `clearCalendarToken()` helpers in `lib/auth/google.ts`
- `useCalendar()` hook in `lib/calendar/useCalendar.ts` for reading & creating events

### Authentication
- Google OAuth (email + profile scope, minimal permissions)
- Guest mode
- Session persisted in `localStorage` via `saveSession` / `getSession` / `clearSession`

### 3D Interactive Lanyard
Physics-based draggable lanyard on the sign-in and profile pages. Pre-loads GLTF assets, capped DPR at 1.5× for 60 fps, with a shimmer skeleton state.

### Kinetic Landing Page
Smooth inertia scroll (Lenis), reveal animations, TypeAnimation hero heading, scroll-stacked event cards, and brutalist card design system.

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- Google Cloud project with OAuth 2.0 credentials (Web application type)
- LangGraph backend running locally or deployed

### 1. Clone & Install
```bash
git clone https://github.com/proindra/AI-Powered-Personal-Booking-Agent.git
cd AI-Powered-Personal-Booking-Agent/frontend
npm install
```

### 2. Configure Environment
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:8123
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Run Development Server
```bash
npm run dev
# → http://localhost:3000
```

### 4. Run LangGraph Backend (optional, for AI chat)
```bash
cd ../backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8123
# → http://localhost:8123
```

Requires a `backend/.env` file:
```env
LLM_PROVIDER=gemini
GEMINI_MODEL=gemini-flash-latest
GOOGLE_API_KEY=your_google_api_key_here
```

> [!TIP]
> You can override the backend URL at runtime via the **Settings panel** in the AI Booking chat without restarting the dev server.

---

## 🌐 Deployment

| Environment | URL |
|---|---|
| Production | [proindra.github.io/AI-Powered-Personal-Booking-Agent/](https://proindra.github.io/AI-Powered-Personal-Booking-Agent/) |
| Local Dev | `http://localhost:3000/` |

Pushes to `main` trigger automated GitHub Pages deployment via GitHub Actions.

---

## 🎨 Animations & UX

| Animation | Description |
|---|---|
| `reveal` | Fade + slide up on scroll |
| `reveal-left` | Fade + slide from left |
| `reveal-right` | Fade + slide from right |
| `reveal-scale` | Fade + scale up |
| `stagger-children` | Auto-staggers child elements |
| `animate-float-subtle` | Gentle float for hero SVG |
| `animate-glow-pulse` | Blue glow pulse for CTA buttons |
| `breathe-pod` | Organic breathing for logo pods |
| Scroll stack | Cards slide up over each other on scroll |
| Lenis | Smooth inertia scrolling site-wide |
| Settings gear | Rotates 45° when settings panel is open |

---

## 🛠️ Recent Changes

| Change | Details |
|---|---|
| Live Timeline Widget | Integrated a responsive `<VerticalTimeline />` React component displaying a scrolling 48-hour window of your `check_calendar` availability directly in the sidebar. |
| Gemini API Config | Configured the LangGraph FastAPi backend to natively parse `gemini-flash-latest` tools and mapped the `.env` dependencies. |
| LangGraph State Memory | The frontend now sends the full conversational context matrix to the backend so the agent remembers previous instructions naturally. |
| Removed Profile nav button | Replaced with **Back to Home** (`← Home`) in the booking chat topbar |
| Auth-guarded booking CTA | "Try AI Booking" checks session → routes to `/signin` or `/booking` |
| Google Calendar button | Calendar icon in sidebar triggers OAuth consent; glowing teal dot when connected; toast feedback |
| Settings panel | Slide-in panel with backend URL editor, calendar disconnect, clear history, sign-out |
| Backend URL override | Stored in `localStorage` as `cs_backend_url`, takes priority over env var |

---

## 👥 Team

Built with love by **Team Net-Y** @ 2026
