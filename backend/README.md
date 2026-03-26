# Backend - AI-Powered Personal Booking Agent

This directory contains the backend services for the AI-Powered Personal Booking Agent. The backend is built using Python, FastAPI, and LangChain/LangGraph to manage multi-turn conversational scheduling and availability checking.

## 🎯 Key Objectives

- **Understand Scheduling Intents**: Processes natural language input to identify booking intents, times, and preferences.
- **Maintain Conversation State**: Keeps track of user preferences and multi-turn conversational context using LangGraph.
- **Check Availability**: Integrates with the Google Calendar API (or uses mock data) to verify free/busy slots.
- **Handle Conflicts & Suggest Alternatives**: Detects schedule overlaps and proactively suggests alternative time slots.
- **Confirm & Summarize**: Provides clear booking confirmations and summaries to the user.

## 🧩 Architecture & Project Structure

The structure of the backend application is designed to separate API routing, AI agent workflow orchestration, and external service integrations.

```text
backend/
├── app/
│   ├── api/                  # FastAPI router and endpoints
│   │   └── routes/           # API handlers for chat and booking operations
│   ├── agents/               # LangGraph and LangChain agent definitions
│   │   ├── graph.py          # StateGraph workflow orchestration
│   │   ├── nodes.py          # Individual agent processing nodes
│   │   └── state.py          # State definitions for the conversation
│   ├── core/                 # App configurations (settings, security, logging)
│   │   └── config.py         # Environment variable parsing
│   ├── models/               # Pydantic schemas for API requests/responses
│   ├── services/             # External integrations and business logic
│   │   ├── calendar.py       # Google Calendar API (or mock) integration
│   │   └── llm.py            # OpenAI / HuggingFace model integration
│   └── main.py               # FastAPI application entry point
├── tests/                    # Unit and integration tests
├── .env.example              # Example environment variables required
├── requirements.txt          # Python dependencies
└── README.md                 # This documentation
```

## 🛠️ Tech Stack & Resources

- **Framework**: [FastAPI](https://fastapi.tiangolo.com) for high-performance API endpoints that the frontend will query.
- **Agent Orchestration**: [LangChain / LangGraph](https://www.langchain.com/langgraph) to construct stateful, reliable AI workflows.
- **LLMs**: Designed to interface with [OpenAI](https://openai.com/) or open-source models via [HuggingFace](https://huggingface.co/models).
- **Calendar Integration**: [Google Calendar API](https://developers.google.com/calendar) for dynamic availability fetching and event creation.

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Google Calendar API Credentials
- OpenAI API Key (or alternative LLM configuration)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your specific API keys and credentials
   ```

### Running the Server

Start the FastAPI development server using Uvicorn:

```bash
uvicorn app.main:app --reload
```

The API will be accessible at `http://localhost:8000`. You can test the endpoints using the interactive Swagger UI documentation at `http://localhost:8000/docs`.

## 🔄 Integration with Frontend

This backend serves as the core reasoning engine. The `frontend/` (Next.js application) will make HTTP calls (via the endpoints defined in `app/api/`) to submit user dialogue, receive agent responses, and present the booking summary UI.
