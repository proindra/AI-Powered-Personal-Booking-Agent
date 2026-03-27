import { GOOGLE_CLIENT_ID } from './config';
import { UserProfile } from './types';

declare global {
  interface Window { google: any; }
}

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.google) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

export const fetchGoogleProfile = async (accessToken: string): Promise<UserProfile> => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return {
    name: data.name,
    email: data.email,
    picture: data.picture?.replace('=s96-c', '=s400-c') || data.picture,
  };
};

/** Sign in with Google — uses only non-sensitive scopes (email + profile).
 *  No "unverified app" warning. Calendar access is requested separately.
 */
export const signInWithGoogle = (
  onSuccess: (token: string, profile: UserProfile) => void,
  onError: (msg: string) => void
) => {
  if (!GOOGLE_CLIENT_ID) { onError('Google sign-in is not configured.'); return; }

  loadGoogleScript().then(() => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (response: any) => {
        if (response.error) { onError('Google sign-in failed.'); return; }
        try {
          const profile = await fetchGoogleProfile(response.access_token);
          onSuccess(response.access_token, profile);
        } catch {
          onError('Failed to fetch profile.');
        }
      },
      error_callback: (err: any) => {
        if (err.type === 'popup_closed' || err.type === 'popup_failed_to_open') {
          onError('');
        } else {
          onError('Google sign-in failed.');
        }
      },
    });
    client.requestAccessToken();
  });
};

/** Request Google Calendar access separately (incremental authorization).
 *  This triggers its own consent popup — only email+profile users who
 *  want calendar features need to go through this extra step.
 *  Stores the calendar-scoped token in localStorage as 'calendar_token'.
 */
export const requestCalendarAccess = (
  onSuccess: () => void,
  onError: (msg: string) => void
) => {
  if (!GOOGLE_CLIENT_ID) { onError('Google sign-in is not configured.'); return; }

  loadGoogleScript().then(() => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (response: any) => {
        if (response.error) { onError('Calendar access denied.'); return; }
        localStorage.setItem('calendar_token', response.access_token);
        onSuccess();
      },
      error_callback: (err: any) => {
        if (err.type === 'popup_closed' || err.type === 'popup_failed_to_open') {
          onError('');
        } else {
          onError('Failed to get calendar access.');
        }
      },
    });
    client.requestAccessToken();
  });
};

/** Returns true if the user has granted Calendar access */
export const hasCalendarAccess = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('calendar_token');
};

/** Removes the stored calendar token (e.g. on sign-out) */
export const clearCalendarToken = () => {
  localStorage.removeItem('calendar_token');
};

export interface CalendarEventDetails {
  summary: string;
  description: string;
  start: string; // ISO string
  end: string;   // ISO string
}

/** Helper function to create a calendar event directly from the browser */
export const createGoogleCalendarEvent = async (
  accessToken: string,
  event: CalendarEventDetails
): Promise<{ success: boolean; link?: string; error?: string }> => {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start,
        },
        end: {
          dateTime: event.end,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error?.message || 'Failed to create event' };
    }
    return { success: true, link: data.htmlLink };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
