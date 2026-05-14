const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
const fallbackBase =
  import.meta.env.PROD
    ? (globalThis.location?.origin || '')
    : 'http://localhost:5050';
const API_BASE_URL = (configuredBase || fallbackBase).replace(/\/+$/, '');

export function apiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), {
    credentials: 'include',
    ...init,
  });
}

