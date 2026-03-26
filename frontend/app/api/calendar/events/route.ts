/**
 * API Proxy: /api/calendar/events
 *
 * Acts as a secure server-side proxy between the frontend and Google Calendar API.
 * The client sends the Google access token in the Authorization header.
 * This route forwards the request to Google and returns the result.
 *
 * GET  → Fetches upcoming calendar events
 * POST → Creates a new calendar event
 */

const GOOGLE_CALENDAR_API =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export async function GET(req: Request) {
  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return Response.json(
      { error: 'Missing Authorization header' },
      { status: 401 }
    );
  }

  const url = new URL(GOOGLE_CALENDAR_API);
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('maxResults', '20');
  // Fetch events from now onward
  url.searchParams.set('timeMin', new Date().toISOString());

  const res = await fetch(url.toString(), {
    headers: { Authorization: authorization },
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(
      { error: data.error?.message ?? 'Failed to fetch calendar events' },
      { status: res.status }
    );
  }

  return Response.json(data);
}

export async function POST(req: Request) {
  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return Response.json(
      { error: 'Missing Authorization header' },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const res = await fetch(GOOGLE_CALENDAR_API, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(
      { error: data.error?.message ?? 'Failed to create calendar event' },
      { status: res.status }
    );
  }

  return Response.json(data);
}
