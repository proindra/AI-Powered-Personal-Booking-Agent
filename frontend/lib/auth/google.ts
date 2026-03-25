import { GOOGLE_CLIENT_ID } from './config';

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

export const signInWithGoogle = (
  onSuccess: (token: string) => void,
  onError: (msg: string) => void
) => {
  if (!GOOGLE_CLIENT_ID) { onError('Google sign-in is not configured.'); return; }

  loadGoogleScript().then(() => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: (response: any) => {
        if (response.error) { onError('Google sign-in failed.'); return; }
        onSuccess(response.access_token);
      },
    });
    client.requestAccessToken();
  });
};
