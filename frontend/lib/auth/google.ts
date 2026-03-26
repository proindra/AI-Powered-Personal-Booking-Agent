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

export const signInWithGoogle = (
  onSuccess: (token: string, profile: UserProfile) => void,
  onError: (msg: string) => void
) => {
  if (!GOOGLE_CLIENT_ID) { onError('Google sign-in is not configured.'); return; }

  loadGoogleScript().then(() => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile https://www.googleapis.com/auth/calendar.events',
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
        // Fired when popup is closed or blocked
        if (err.type === 'popup_closed' || err.type === 'popup_failed_to_open') {
          onError('');  // empty string = no error message, just stop spinner
        } else {
          onError('Google sign-in failed.');
        }
      },
    });
    client.requestAccessToken();
  });
};

export interface CalendarEventDetails {
  summary: string;
  description: string;
  start: string; // ISO string
  end: string;   // ISO string
}

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
