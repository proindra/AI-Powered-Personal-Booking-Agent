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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reads the Google access token stored in localStorage by the GIS auth flow */
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/** Base path — Next.js handles this via next.config.ts basePath rewrite */
const BASE_PATH = '';

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
 * useCalendar — fetches and manages Google Calendar events
 *
 * Reads the access token from localStorage (set by the GIS sign-in flow)
 * and proxies all Calendar API requests through /api/calendar/events
 * so credentials are never exposed in the browser network calls.
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
      const res = await fetch(`${BASE_PATH}/api/calendar/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to load calendar events.');
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
        const res = await fetch(`${BASE_PATH}/api/calendar/events`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? 'Failed to create event.');
        }

        // Optimistically add the new event to the list
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
