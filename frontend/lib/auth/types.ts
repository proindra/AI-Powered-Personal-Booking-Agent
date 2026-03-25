export type AuthType = 'google' | 'guest' | 'email';

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface AuthSession {
  type: AuthType;
  token: string;
  email?: string;
  profile?: UserProfile;
}

export const saveSession = (session: AuthSession) => {
  localStorage.setItem('auth_type', session.type);
  localStorage.setItem('auth_token', session.token);
  if (session.email) localStorage.setItem('auth_email', session.email);
  if (session.profile) localStorage.setItem('auth_profile', JSON.stringify(session.profile));
};

export const getSession = (): AuthSession | null => {
  const type = localStorage.getItem('auth_type') as AuthType | null;
  const token = localStorage.getItem('auth_token');
  if (!type || !token) return null;
  const profileRaw = localStorage.getItem('auth_profile');
  return {
    type,
    token,
    email: localStorage.getItem('auth_email') ?? undefined,
    profile: profileRaw ? JSON.parse(profileRaw) : undefined,
  };
};

export const clearSession = () => {
  localStorage.removeItem('auth_type');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_email');
  localStorage.removeItem('auth_profile');
};
