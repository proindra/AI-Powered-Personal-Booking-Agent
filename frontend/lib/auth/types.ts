export type AuthType = 'google' | 'guest' | 'email';

export interface AuthSession {
  type: AuthType;
  token: string;
  email?: string;
}

export const saveSession = (session: AuthSession) => {
  localStorage.setItem('auth_type', session.type);
  localStorage.setItem('auth_token', session.token);
  if (session.email) localStorage.setItem('auth_email', session.email);
};

export const getSession = (): AuthSession | null => {
  const type = localStorage.getItem('auth_type') as AuthType | null;
  const token = localStorage.getItem('auth_token');
  if (!type || !token) return null;
  return { type, token, email: localStorage.getItem('auth_email') ?? undefined };
};

export const clearSession = () => {
  localStorage.removeItem('auth_type');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_email');
};
