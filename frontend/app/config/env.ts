// .env.ts
// In production (Docker), API is proxied through nginx at /api
// In development, use full localhost URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'hp://localhost:8000/api');

if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL not set, using relative URLs");
}
