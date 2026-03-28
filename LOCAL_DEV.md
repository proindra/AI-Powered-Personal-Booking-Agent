# Running ConnectSphere Locally

Two terminals — one for the backend, one for the frontend.

---

## Prerequisites

| Tool | Minimum Version | macOS | Windows |
|---|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node.js | Bundled with Node.js |
| Python | 3.10+ | [python.org](https://www.python.org) or `brew install python` | [python.org](https://www.python.org) — check "Add to PATH" during install |

---

## 1. Backend (FastAPI + LangGraph)

### 1a. Navigate to the backend folder

**macOS**
```bash
cd backend
```

**Windows**
```powershell
cd backend
```

---

### 1b. Create a virtual environment

**macOS**
```bash
python3 -m venv .venv
```

**Windows**
```powershell
python -m venv .venv
```

---

### 1c. Activate the virtual environment

**macOS**
```bash
source .venv/bin/activate
```

**Windows (Command Prompt)**
```cmd
.venv\Scripts\activate.bat
```

**Windows (PowerShell)**
```powershell
.venv\Scripts\Activate.ps1
```

> If PowerShell blocks the script, run this first:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

---

### 1d. Install dependencies

**macOS**
```bash
pip install -r requirements.txt
```

**Windows**
```powershell
pip install -r requirements.txt
```

---

### 1e. Set up environment variables

**macOS**
```bash
cp .env.example .env
```

**Windows (Command Prompt)**
```cmd
copy .env.example .env
```

**Windows (PowerShell)**
```powershell
Copy-Item .env.example .env
```

Open `.env` and fill in your LLM credentials. 

> [!IMPORTANT]
> **Why is my code "broken" on another laptop?**
> The `.env` file contains secret keys and is EXCLUDED from Git for security. On a new machine, you MUST create it manually from `.env.example`.

```env
# Pick one provider (gemini is recommended for this setup)
LLM_PROVIDER=gemini          # or: openai

# Google Gemini
GOOGLE_API_KEY=AIza...
GEMINI_MODEL=gemini-flash-latest

# OpenAI (only if LLM_PROVIDER=openai)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

> No API key yet? The agent still runs with a rule-based mock fallback — no crash.

---

### 1f. Start the backend server

**macOS**
```bash
uvicorn main:app --reload --port 8123
```

Backend is now live at **http://localhost:8123**

Verify it's running:

**macOS**
```bash
curl http://localhost:8123/health
# → {"status":"ok"}
```

**Windows (PowerShell)**
```powershell
Invoke-RestMethod http://localhost:8123/health
# → status : ok
```

---

## 🔒 Google Cloud Console Requirements (CRITICAL)

For Sign-In and Calendar to work on a new machine, you **must** update your [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 Client credentials:

1.  **Authorized JavaScript origins**:
    *   `http://localhost:3000`
2.  **Authorized redirect URIs**:
    *   `http://localhost:3000`
    *   `http://localhost:3000/signin`

> [!CAUTION]
> If you don't add these, Google will throw a `400: redirect_uri_mismatch` error.

---

## 2. Frontend (Next.js)

Open a **second terminal** for this.

### 2a. Navigate to the frontend folder

**macOS**
```bash
cd frontend
```

**Windows**
```powershell
cd frontend
```

---

### 2b. Install dependencies

**macOS**
```bash
npm install
```

**Windows**
```powershell
npm install
```

---

### 2c. Set up environment variables

Create a `.env.local` file inside the `frontend/` directory.

**macOS**
```bash
touch .env.local
```

**Windows (PowerShell)**
```powershell
New-Item .env.local -ItemType File
```

Then open it in any editor and add:

```env
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:8123
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is needed for Google Sign-In and Calendar access.
> Get one from [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.

---

### 2d. Start the dev server

**macOS**
```bash
npm run dev
```

**Windows**
```powershell
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
LangGraph Agent  (Gemini / OpenAI)
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

## 5. Stopping the Servers

Press `Ctrl + C` in each terminal (macOS and Windows).

---

## 6. Common Issues

**`python` not found on macOS**
- Use `python3` instead of `python`
- Or install via Homebrew: `brew install python`

**`python` not found on Windows**
- Reinstall Python from [python.org](https://www.python.org) and check "Add Python to PATH"
- Or use `py` instead: `py -m venv .venv`

**PowerShell script execution blocked**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Backend won't start**
- Make sure the virtual environment is activated (you should see `(.venv)` in your prompt)
- Re-run `pip install -r requirements.txt` and check for errors

**"Could not connect to booking agent" in chat**
- Confirm the backend is running on port 8123
- Check `NEXT_PUBLIC_LANGGRAPH_API_URL` in `frontend/.env.local` is `http://localhost:8123`

**`npm run dev` fails with "next: command not found"**
- Run `npm install` inside the `frontend/` directory first

**Google Sign-In not working**
- Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `frontend/.env.local`
- Add `http://localhost:3000` as an authorised JavaScript origin in your Google Cloud Console OAuth client

**Calendar sync not working after booking**
- Sign in with Google, then connect your calendar from the Profile page
- The agent only syncs to Google Calendar after the user explicitly grants calendar permissions
