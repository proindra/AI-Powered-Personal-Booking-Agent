'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarEventDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: CalendarEventDateTime;
  end: CalendarEventDateTime;
  htmlLink?: string;
  status?: string;
  creator?: { email: string };
}

export interface NewCalendarEvent {
  summary: string;
  description?: string;
  location?: string;
  start: CalendarEventDateTime;
  end: CalendarEventDateTime;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CALENDAR_API =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reads the Google access token stored in localStorage by the GIS auth flow */
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCalendarReturn {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createEvent: (event: NewCalendarEvent) => Promise<CalendarEvent | null>;
  creating: boolean;
}

/**
 * useCalendar — fetches and manages Google Calendar events.
 *
 * Calls the Google Calendar API directly from the browser using the GIS
 * access token stored in localStorage. This is required for static exports
 * (GitHub Pages) where no server-side API routes are available.
 *
 * Google Calendar API fully supports CORS for browser requests.
 */
export function useCalendar(): UseCalendarReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchEvents = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setError('Not authenticated. Please sign in first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(CALENDAR_API);
      url.searchParams.set('orderBy', 'startTime');
      url.searchParams.set('singleEvents', 'true');
      url.searchParams.set('maxResults', '20');
      url.searchParams.set('timeMin', new Date().toISOString());

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message ?? 'Failed to load calendar events.');
      }

      setEvents((data.items ?? []) as CalendarEvent[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (event: NewCalendarEvent): Promise<CalendarEvent | null> => {
      const token = getStoredToken();
      if (!token) {
        setError('Not authenticated.');
        return null;
      }

      setCreating(true);
      try {
        const res = await fetch(CALENDAR_API, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message ?? 'Failed to create event.');
        }

        setEvents((prev: CalendarEvent[]) => [...prev, data as CalendarEvent]);
        return data as CalendarEvent;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.');
        return null;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  return { events, loading, error, refetch: fetchEvents, createEvent, creating };
}
