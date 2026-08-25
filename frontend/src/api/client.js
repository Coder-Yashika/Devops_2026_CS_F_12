import axios from 'axios';

// baseURL is '/api/v1' (not the full localhost:5000 URL) so that in dev,
// Vite's proxy (see vite.config.js) forwards it to the backend, and in
// production, both are served from the same domain behind a reverse proxy -
// no CORS config to maintain in two places.
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
});

// Attach the access token (kept in memory/localStorage, NOT the cookie) to
// every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
