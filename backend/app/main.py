from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI-Powered Personal Booking Agent",
    description="Backend scheduling API powered by LangGraph",
    version="1.0.0"
)

# Configure CORS for the frontend Next.js App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Expand to specific origins like http://localhost:3000 in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Include the API router
from app.api.routes import router as api_router
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
