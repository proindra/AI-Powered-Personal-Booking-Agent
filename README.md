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

- **3D Interactive Lanyard**: A physics-based, draggable 3D lanyard featuring a real-time reactive ribbon and the website's favicon.
- **Kinetic Single-Page UX**: Seamless transitions between sections via smooth inertia scrolling.
- **AI-Powered Booking**: Real-time natural language scheduling via LangGraph.
- **Brutalist Aesthetic**: High-impact typography and custom-built kinetic animations.
- **Responsive Integrity**: Optimized viewport fitting for all components (no clipping).

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
