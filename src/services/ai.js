// src/services/ai.js
// ─────────────────────────────────────────────────────────────────────────────
// AI service layer — all Gemini-powered features.
// Mirrors the pattern in api.js (same BASE_URL, same jp_token key).
// Every call hits your Express backend → backend calls Gemini with GEMINI_API_KEY.
// The Gemini key NEVER lives in the frontend.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Dedicated axios instance for AI routes — keeps it separate from api.js
const aiClient = axios.create({
  baseURL: `${BASE_URL}/api/ai`,
  headers: { "Content-Type": "application/json" },
  timeout: 60000, // Gemini free tier can be slow — give it 60 s
});

// Attach jp_token automatically (same key used by the rest of the app)
aiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise all errors to a single Error shape so components only need to
// check  err.message  instead of drilling into axios internals
aiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "AI service unavailable. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// ── Phase 2 — AI Resume Generator ────────────────────────────────────────────
// formData is the exact ApplicationPage state object:
// { firstName, lastName, phone, city, state,
//   degree, branch, institution, cgpa, passingYear,
//   skillsList[], experiences[], internshipsList[],
//   projectsList[], certsList[], profileLinks[] }

/**
 * @param {Object} formData  — ApplicationPage formData state (Steps 1-4)
 * @returns {Promise<{ resumeText: string, sections: Object }>}
 */
export const generateResume = async (formData) => {
  const { data } = await aiClient.post("/generate-resume", { formData });
  return data;
};

// ── Phase 3 — ATS Score Checker ───────────────────────────────────────────────

/**
 * Upload a resume file + optional job description, get ATS analysis back.
 *
 * @param {File}   resumeFile       — PDF or DOCX from <input type="file">
 * @param {string} [jobDescription] — pasted JD text (optional but improves score)
 * @returns {Promise<{
 *   score: number,
 *   grade: string,
 *   errors: string[],
 *   suggestions: string[],
 *   keywordMatches: string[],
 *   missingKeywords: string[],
 *   sectionScores: { contact, summary, experience, skills, education }
 * }>}
 */
export const checkATSScore = async (resumeFile, jobDescription = "") => {
  const form = new FormData();
  form.append("resume", resumeFile);
  if (jobDescription) form.append("jobDescription", jobDescription);

  const { data } = await aiClient.post("/ats-score", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ── Phase 4 — AI Job Matching ─────────────────────────────────────────────────

/**
 * Score job listings against the user's profile.  Returns sorted array.
 *
 * @param {Object}   formData    — ApplicationPage formData (skills, experience, etc.)
 * @param {Object[]} jobListings — [{ id, title, company, description, skills[] }]
 * @returns {Promise<Array<{
 *   jobId: string,
 *   matchScore: number,
 *   matchReasons: string[],
 *   missingSkills: string[],
 *   applyRecommendation: 'strong' | 'moderate' | 'stretch'
 * }>>}
 */
export const getJobMatches = async (formData, jobListings) => {
  const { data } = await aiClient.post("/job-match", { formData, jobListings });
  return data; // sorted best → worst
};

// ── Phase 6 — AI Cover Letter Generator ──────────────────────────────────────

/**
 * @param {Object} formData    — user's ApplicationPage formData
 * @param {Object} jobDetails  — { title, company, description, hiringManager? }
 * @param {string} [tone]      — 'professional' | 'friendly' | 'enthusiastic'
 * @returns {Promise<{ coverLetter: string, wordCount: number }>}
 */
export const generateCoverLetter = async (
  formData,
  jobDetails,
  tone = "professional"
) => {
  const { data } = await aiClient.post("/cover-letter", {
    formData,
    jobDetails,
    tone,
  });
  return data;
};

// ── Phase 6 — Mock Interview Prep ────────────────────────────────────────────

/**
 * @param {string}   role           — e.g. "Frontend Developer"
 * @param {string}   level          — 'junior' | 'mid' | 'senior'
 * @param {string[]} skills         — pulled from formData.skillsList
 * @param {string}   [interviewType]— 'technical' | 'behavioural' | 'mixed'
 * @returns {Promise<Array<{ question: string, modelAnswer: string, tips: string[] }>>}
 */
export const getMockInterview = async ({
  role,
  level,
  skills,
  interviewType = "mixed",
}) => {
  const { data } = await aiClient.post("/mock-interview", {
    role,
    level,
    skills,
    interviewType,
  });
  return data;
};

// ── Phase 6 — Skill Gap Analysis ─────────────────────────────────────────────

/**
 * @param {string[]} currentSkills  — formData.skillsList
 * @param {string}   targetRole
 * @param {string}   [jobDescription]
 * @returns {Promise<{
 *   missingSkills: string[],
 *   partialSkills: string[],
 *   strongSkills: string[],
 *   learningResources: Array<{ skill: string, resource: string, url?: string }>,
 *   estimatedTimeToReady: string
 * }>}
 */
export const analyzeSkillGap = async ({
  currentSkills,
  targetRole,
  jobDescription = "",
}) => {
  const { data } = await aiClient.post("/skill-gap", {
    currentSkills,
    targetRole,
    jobDescription,
  });
  return data;
};

// ── Streaming helper (Phase 2 onwards — optional) ────────────────────────────
// Use this when you want to show the resume/cover letter being "typed out"
// in real time instead of waiting for the full response.
//
// Example:
//   streamAI("/generate-resume", { formData }, chunk => setText(t => t + chunk))

export const streamAI = async (endpoint, payload, onChunk, onDone) => {
  const token = localStorage.getItem("jp_token");

  const response = await fetch(`${BASE_URL}/api/ai${endpoint}?stream=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Stream request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const raw = decoder.decode(value, { stream: true });
    // SSE lines look like: "data: some text\n\n"
    raw
      .split("\n")
      .filter((line) => line.startsWith("data: "))
      .forEach((line) => onChunk(line.slice(6)));
  }

  onDone?.();
};