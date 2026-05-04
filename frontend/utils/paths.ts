const isProd = process.env.NODE_ENV === 'production';
export const basePath = isProd
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? '/AI-Powered-Personal-Booking-Agent')
  : '';

export const getPath = (path: string) => {
  if (path.startsWith('http')) return path;
  if (path.startsWith(basePath)) return path;
  return `${basePath}${path.startsWith('/') ? '' : '/'}${path}`;
};
