# Running ConnectSphere Locally

Two terminals — one for the backend, one for the frontend.

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Python | 3.10+ |

---

## 1. Backend (FastAPI + LangGraph)

### 1a. Create and activate a virtual environment

```bash
cd backend
python -m venv .venv
```

```bash
# macOS / Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

### 1b. Install dependencies

```bash
pip install -r requirements.txt
```

### 1c. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your LLM credentials:

```env
# Pick one provider
LLM_PROVIDER=openai          # or: gemini

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Google Gemini (only if LLM_PROVIDER=gemini)
GOOGLE_API_KEY=AIza...
GEMINI_MODEL=gemini-1.5-flash
```

> No API key yet? The agent still runs — it just won't produce intelligent responses.
> The frontend mock fallback in `/api/booking/route.ts` handles this gracefully.

### 1d. Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

Backend is now live at **http://localhost:8000**

Verify it's running:
```bash
curl http://localhost:8000/health
# → {"status":"ok"}
```

---

## 2. Frontend (Next.js)

### 2a. Install dependencies

```bash
cd frontend
npm install
```

### 2b. Set up environment variables

Create a `.env.local` file inside the `frontend/` directory:

```bash
# frontend/.env.local
LANGGRAPH_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is needed for Google Sign-In and Calendar access.
> You can get one from [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.

### 2c. Start the dev server

```bash
npm run dev
```

Frontend is now live at **http://localhost:3000**

---

## 3. How They Connect

```
Browser (localhost:3000)
        ↓  POST /api/booking
Next.js API Route (proxy)
        ↓  POST /chat
FastAPI Backend (localhost:8000)
        ↓
LangGraph Agent
        ↓
Google Calendar API  (if user granted calendar access)
```

The Next.js proxy at `frontend/app/api/booking/route.ts` forwards all chat requests to the FastAPI backend. If the backend is unreachable, it automatically falls back to a built-in mock response so the UI stays functional.

---

## 4. Testing the Booking Agent

Once both servers are running, open **http://localhost:3000**, navigate to the Booking section, and try:

| Message | Expected behaviour |
|---|---|
| `Book a meeting tomorrow at 3pm` | Agent extracts intent, checks calendar, confirms booking |
| `Book a meeting tomorrow at 9am` | Agent detects conflict (mock busy hour), suggests alternatives |
| `What's my schedule?` | Agent responds with a query-type reply |
| `Reschedule my 3pm to 5pm` | Agent handles reschedule intent |

---

## 5. Common Issues

**Backend won't start**
- Make sure your virtual environment is activated (`source .venv/bin/activate`)
- Check that all packages installed without errors (`pip install -r requirements.txt`)

**"Could not connect to booking agent" in chat**
- Confirm the backend is running on port 8000
- Check `LANGGRAPH_API_URL` in `frontend/.env.local` matches the backend URL

**Google Sign-In not working**
- Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `frontend/.env.local`
- Add `http://localhost:3000` as an authorised JavaScript origin in your Google Cloud Console OAuth client

**Calendar sync not working after booking**
- Sign in with Google, then connect your calendar from the Profile page
- The agent only syncs to Google Calendar after the user explicitly grants calendar permissions
