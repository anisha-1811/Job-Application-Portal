// src/services/jobs.js
// ─────────────────────────────────────────────────────────────────────────────
// Phase 4 — Job listings API client
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const jobsClient = axios.create({
  baseURL: `${BASE_URL}/api/jobs`,
  timeout: 15000,
});

// Attach JWT automatically
jobsClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

jobsClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      "Failed to load jobs. Please try again.";
    return Promise.reject(new Error(message));
  }
);

/**
 * Fetch jobs with optional filters
 * @param {{ search?: string, category?: string, mode?: string, type?: string }} params
 */
export const fetchJobs = async (params = {}) => {
  const { data } = await jobsClient.get("/", { params });
  return data; // { success, total, data: Job[] }
};

/**
 * Fetch filter options (categories, modes, types)
 */
export const fetchFilters = async () => {
  const { data } = await jobsClient.get("/filters");
  return data; // { success, data: { categories, modes, types } }
};

/**
 * Fetch a single job by ID
 */
export const fetchJobById = async (id) => {
  const { data } = await jobsClient.get(`/${id}`);
  return data;
};