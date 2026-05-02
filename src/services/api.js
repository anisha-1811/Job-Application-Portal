import axios from "axios";

// ── Base URL ──────────────────────────────────────────────────────────────────
// When running locally use localhost
// When deployed on Vercel use your Render backend URL (Week 4)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Attach JWT token to every request automatically ───────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const loginToBackend = async (firebase_uid, email, display_name) => {
  const res = await api.post("/api/auth/login", {
    firebase_uid,
    email,
    display_name,
  });
  return res.data;
};

// ── APPLICATION ───────────────────────────────────────────────────────────────
export const submitApplication = async (formData) => {
  const res = await api.post("/api/application/save", formData);
  return res.data;
};

export const getApplication = async () => {
  const res = await api.get("/api/application/get");
  return res.data;
};

export default api;