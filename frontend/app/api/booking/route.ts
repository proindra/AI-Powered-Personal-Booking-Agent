import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Proxy to your LangGraph FastAPI backend
    // Forward calendar_token if the frontend sent one (Google Calendar access)
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LANGGRAPH_API_KEY
          ? { Authorization: `Bearer ${process.env.LANGGRAPH_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Return a helpful mock response when backend isn't connected
      return mockResponse(body.messages?.at(-1)?.content || "");
    }

    // Stream the response back
    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    // Backend not running — return mock response for demo
    const body = await req.json().catch(() => ({}));
    return mockResponse(body.messages?.at(-1)?.content || "");
  }
}

function mockResponse(userMessage: string): Response {
  const lower = userMessage.toLowerCase();

  let reply =
    "I can help you book a session! Could you tell me your preferred date, time, and which speaker or event you'd like to attend?";

  if (lower.includes("tuesday") || lower.includes("monday") || lower.includes("friday")) {
    reply =
      "I found available slots for that day. Here are your options:\n\n• 10:00 AM – 11:00 AM (Available)\n• 2:00 PM – 3:00 PM (Available)\n• 4:30 PM – 5:30 PM (Available)\n\nWhich time works best for you?";
  } else if (lower.includes("elon") || lower.includes("musk")) {
    reply =
      "Elon Musk has limited availability. Next open slots:\n\n• Aug 22 at 9:00 AM UTC\n• Aug 25 at 3:00 PM UTC\n\nWould you like me to book one of these?";
  } else if (lower.includes("confirm") || lower.includes("yes") || lower.includes("book it")) {
    reply =
      "Booking confirmed! Here's your summary:\n\n📅 Date: Aug 22, 2026\n⏰ Time: 9:00 AM UTC\n👤 Speaker: Elon Musk\n📍 Format: Virtual (link sent to your email)\n\nYou'll receive a calendar invite shortly. Is there anything else I can help with?";
  } else if (lower.includes("available") || lower.includes("availability")) {
    reply =
      "Let me check the calendar... I see several open slots this week. What type of session are you looking for — a 1:1 with a speaker, a workshop, or a networking session?";
  }

  const data = JSON.stringify({ content: reply });
  const stream = new ReadableStream({
    start(controller) {
      // Simulate streaming by chunking the reply
      const words = reply.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        if (i >= words.length) {
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
          clearInterval(interval);
          return;
        }
        const chunk = words.slice(i, i + 3).join(" ") + " ";
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ content: chunk })}\n\n`
          )
        );
        i += 3;
      }, 80);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}


