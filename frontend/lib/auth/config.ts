export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '218443770951-d7jp3365valg1bcjagl1hdka1kpqk5qa.apps.googleusercontent.com';

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const goto = (path: string) => {
  window.location.href = BASE_PATH + path;
};
