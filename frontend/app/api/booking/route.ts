import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:8123";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ response: "Invalid request body." }, { status: 400 });
  }

  const userMessage = body.messages?.at(-1)?.content || "";

  try {
    // Proxy to the FastAPI backend — it returns JSON, not SSE
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
      return NextResponse.json(buildMockPayload(userMessage));
    }

    // Backend returns JSON — forward it as-is
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Backend not running — return rich mock JSON with slots so UI demo works
    return NextResponse.json(buildMockPayload(userMessage));
  }
}

function buildMockPayload(userMessage: string) {
  const lower = userMessage.toLowerCase();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = tomorrow.toISOString().split("T")[0];

  let reply =
    "I can help you book a session! Could you tell me your preferred date, time, and which speaker or event you'd like to attend?";
  let suggested_slots: { start: string; end: string }[] = [];
  let booked_slots: { start: string; end: string }[] = [];

  if (
    lower.includes("confirm") ||
    lower.includes("yes") ||
    lower.includes("book it") ||
    lower.includes("book a meeting")
  ) {
    reply =
      "✅ Booking confirmed!\n\n📅 Date: " +
      day +
      "\n⏰ Time: 3:00 PM UTC\n📍 Format: Virtual\n\nYou'll receive a calendar invite shortly. Is there anything else I can help with?";
    const s = new Date(`${day}T15:00:00Z`);
    booked_slots = [{ start: s.toISOString(), end: new Date(s.getTime() + 3600000).toISOString() }];
  } else if (
    lower.includes("available") ||
    lower.includes("slot") ||
    lower.includes("schedule") ||
    lower.includes("availability") ||
    lower.includes("tomorrow") ||
    lower.includes("monday") ||
    lower.includes("tuesday") ||
    lower.includes("friday")
  ) {
    reply =
      "I found available slots for that day. Here are your options:\n\n• 10:00 AM – 11:00 AM (Available)\n• 2:00 PM – 3:00 PM (Available)\n• 4:00 PM – 5:00 PM (Available)\n\nWhich time works best for you?";
    suggested_slots = [10, 14, 16].map((h) => {
      const s = new Date(`${day}T${h.toString().padStart(2, "0")}:00:00Z`);
      return { start: s.toISOString(), end: new Date(s.getTime() + 3600000).toISOString() };
    });
  }

  return {
    response: reply,
    state: {
      suggested_slots,
      booked_slots,
    },
  };
}
