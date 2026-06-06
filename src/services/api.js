import axios from "axios";

// ── Base URL ──────────────────────────────────────────────────────────────────
// When running locally use localhost
// When deployed on Vercel use your Render backend URL (Week 4)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000, // Render free tier cold start can take 60s
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

// Login with API ID + password (no Firebase needed on the frontend for this flow)
export const loginByApiId = async (applicant_id, password) => {
  const res = await api.post("/api/auth/login-by-id", { applicant_id, password });
  return res.data;
};

// ── APPLICATION ───────────────────────────────────────────────────────────────
export const submitApplication = async (formData) => {
  const res = await api.post("/api/application/save", formData);
  return res.data;
};

// Upload resume, photo, idProof as actual files
// filesToUpload = { resume: FileObj, photo: FileObj, idProof: FileObj }
// Only include keys whose value is a real File object
export const uploadDocuments = async (filesToUpload) => {
  const form = new FormData();
  let hasFile = false;
  Object.entries(filesToUpload).forEach(([key, file]) => {
    if (file instanceof File) {
      form.append(key, file);
      hasFile = true;
    }
  });
  if (!hasFile) return { success: true, message: "No new files to upload." };
  const res = await api.post("/api/application/upload-documents", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getApplication = async () => {
  const res = await api.get("/api/application/get");
  return res.data;
};

export default api;