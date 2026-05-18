// src/utils/aiHelpers.js
// ─────────────────────────────────────────────────────────────────────────────
// Prompt builders matched EXACTLY to the ApplicationPage formData shape.
// These are the frontend-canonical versions; the backend mirrors the same
// logic (copy these into your backend utils/ folder for the Express routes).
//
// formData shape (from ApplicationPage.jsx):
// {
//   // Step 1 – Personal
//   firstName, lastName, dob, gender, phone, address, city, state, pincode, nationality,
//
//   // Step 2 – Education
//   degree, branch, institution, cgpa, passingYear,
//   twelthBoard, twelthMarks, twelthYear,
//   tenthBoard,  tenthMarks,  tenthYear,
//
//   // Step 3 – Skills & Experience
//   skillsList:      string[],
//   experiences:     [{ company, role, startDate, endDate, currentlyWorking, skillsLearned[], description }]
//   internshipsList: [{ company, role, startDate, endDate, currentlyWorking, skillsLearned[], description }]
//   projectsList:    [{ title, url, description, techSkills[], startDate, endDate, ongoing }]
//   certsList:       [{ name, issuer, credentialUrl, date }]
//   profileLinks:    [{ label, icon, url }]
// }
// ─────────────────────────────────────────────────────────────────────────────

// ── Phase 2 — Resume Generator ────────────────────────────────────────────────

/**
 * Build the Gemini prompt for resume generation from ApplicationPage formData.
 *
 * @param {Object} formData — exact ApplicationPage state
 * @param {string} [targetRole] — optionally pass the job role user is targeting
 */
export const buildResumePrompt = (formData, targetRole = "") => {
  const {
    firstName = "", lastName = "",
    phone = "", city = "", state = "",
    degree = "", branch = "", institution = "", cgpa = "", passingYear = "",
    skillsList = [],
    experiences = [], internshipsList = [],
    projectsList = [], certsList = [],
    profileLinks = [],
  } = formData;

  const fullName = `${firstName} ${lastName}`.trim();

  const formatExp = (arr, label) =>
    arr.length === 0
      ? `No ${label} listed.`
      : arr.map((e, i) =>
          `  ${i + 1}. ${e.role} at ${e.company} ` +
          `(${e.startDate} – ${e.currentlyWorking ? "Present" : e.endDate})\n` +
          `     Skills: ${(e.skillsLearned || []).join(", ") || "N/A"}\n` +
          `     ${e.description || ""}`
        ).join("\n");

  const formatProjects = () =>
    projectsList.length === 0
      ? "No projects listed."
      : projectsList.map((p, i) =>
          `  ${i + 1}. ${p.title}${p.url ? " ("+p.url+")" : ""}\n` +
          `     Tech: ${(p.techSkills || []).join(", ") || "N/A"}\n` +
          `     ${p.description || ""}`
        ).join("\n");

  const formatCerts = () =>
    certsList.length === 0
      ? "None"
      : certsList.map(c => `${c.name} — ${c.issuer} (${c.date || "N/A"})`).join(", ");

  const formatLinks = () =>
    profileLinks.filter(l => l.url).map(l => `${l.label}: ${l.url}`).join(" | ") || "None";

  return `
You are an expert resume writer specialising in ATS-optimised Indian tech resumes.
Generate a professional resume based on the following data.

CANDIDATE:
Name: ${fullName}
Phone: ${phone}
Location: ${city}, ${state}
${targetRole ? `Target Role: ${targetRole}` : ""}
Links: ${formatLinks()}

EDUCATION:
${degree} in ${branch} — ${institution} | CGPA: ${cgpa} | Passing Year: ${passingYear}

TECHNICAL SKILLS:
${skillsList.join(", ") || "Not specified"}

WORK EXPERIENCE:
${formatExp(experiences, "work experience")}

INTERNSHIPS:
${formatExp(internshipsList, "internships")}

PROJECTS:
${formatProjects()}

CERTIFICATIONS & ACHIEVEMENTS:
${formatCerts()}

OUTPUT FORMAT — return ONLY this JSON, no markdown fences, no preamble:
{
  "resumeText": "complete plain-text resume (600 words max, ATS-safe)",
  "sections": {
    "header": "name + contact line",
    "education": "formatted education block",
    "skills": "comma-separated skills string",
    "experience": ["bullet 1", "bullet 2", "..."],
    "projects": ["Project name: one-line description", "..."],
    "certifications": "formatted certs string"
  }
}

Rules:
- Use strong past-tense action verbs (Built, Developed, Designed, Reduced…).
- Quantify achievements wherever data allows; estimate if not given.
- No tables, no graphics, no multi-column layout — ATS-safe plain text only.
- Keep to roughly 600 words / one page.
`.trim();
};

// ── Phase 3 — ATS Score Checker ───────────────────────────────────────────────

/**
 * @param {string} resumeText       — extracted text from uploaded resume
 * @param {string} [jobDescription] — pasted JD (improves scoring accuracy)
 */
export const buildATSPrompt = (resumeText, jobDescription = "") => `
You are a senior ATS (Applicant Tracking System) analyst.
Analyse the resume below${jobDescription ? " against the provided job description" : ""}.

RESUME:
${truncateForGemini(resumeText)}

${jobDescription ? `JOB DESCRIPTION:\n${truncateForGemini(jobDescription, 2000)}` : ""}

Return ONLY this JSON (no markdown, no preamble):
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "errors": ["formatting or structural problem 1", "..."],
  "suggestions": ["most impactful fix first", "..."],
  "keywordMatches": ["keyword from JD found in resume", "..."],
  "missingKeywords": ["important JD keyword NOT in resume", "..."],
  "sectionScores": {
    "contact":    <0-20>,
    "summary":    <0-20>,
    "experience": <0-20>,
    "skills":     <0-20>,
    "education":  <0-20>
  }
}
`.trim();

// ── Phase 4 — Job Matcher ─────────────────────────────────────────────────────

/**
 * @param {Object}   formData    — ApplicationPage formData
 * @param {Object[]} jobListings — [{ id, title, company, description, skills[] }]
 */
export const buildJobMatchPrompt = (formData, jobListings) => {
  const profile = {
    skills: formData.skillsList || [],
    degree: `${formData.degree} in ${formData.branch}`,
    experience: (formData.experiences || []).map(e => `${e.role} at ${e.company}`),
    projects: (formData.projectsList || []).map(p => p.title),
  };

  return `
You are a career advisor. Rank the job listings by fit for this candidate.

CANDIDATE:
${JSON.stringify(profile, null, 2)}

JOB LISTINGS:
${JSON.stringify(jobListings, null, 2)}

Return ONLY a JSON array sorted by matchScore descending:
[
  {
    "jobId": "<id from listing>",
    "matchScore": <0-100>,
    "matchReasons": ["reason 1", "reason 2"],
    "missingSkills": ["skill candidate lacks"],
    "applyRecommendation": "<strong|moderate|stretch>"
  }
]
No markdown. No preamble.
`.trim();
};

// ── Phase 6 — Cover Letter ────────────────────────────────────────────────────

/**
 * @param {Object} formData   — ApplicationPage formData
 * @param {Object} jobDetails — { title, company, description, hiringManager? }
 * @param {string} tone       — 'professional' | 'friendly' | 'enthusiastic'
 */
export const buildCoverLetterPrompt = (formData, jobDetails, tone) => {
  const name = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
  const skills = (formData.skillsList || []).slice(0, 10).join(", ");
  const topProject = (formData.projectsList || [])[0];

  return `
You are an expert career coach. Write a compelling cover letter.

CANDIDATE:
Name: ${name}
Degree: ${formData.degree} in ${formData.branch} from ${formData.institution}
Key Skills: ${skills}
Strongest Project: ${topProject ? topProject.title + " — " + topProject.description : "N/A"}

JOB:
Title: ${jobDetails.title}
Company: ${jobDetails.company}
Hiring Manager: ${jobDetails.hiringManager || "Hiring Manager"}
Description: ${truncateForGemini(jobDetails.description, 1500)}

Tone: ${tone}

Rules:
- 3 paragraphs: strong hook → evidence of value → call to action.
- Under 350 words.
- Do NOT open with "I am writing to apply for…"
- Mirror key phrases from the JD naturally.
- Sign off with the candidate's name.

Return ONLY JSON:
{
  "coverLetter": "full letter text, use \\n for newlines",
  "wordCount": <integer>
}
`.trim();
};

// ── Phase 6 — Mock Interview ──────────────────────────────────────────────────

/**
 * @param {string}   role
 * @param {string}   level          — 'junior' | 'mid' | 'senior'
 * @param {string[]} skills         — from formData.skillsList
 * @param {string}   interviewType  — 'technical' | 'behavioural' | 'mixed'
 */
export const buildInterviewPrompt = (role, level, skills, interviewType) => `
Generate 10 realistic ${interviewType} interview questions for a ${level}-level ${role}.
Focus on these skills: ${skills.slice(0, 8).join(", ")}.

Return ONLY a JSON array:
[
  {
    "question": "...",
    "modelAnswer": "A strong 2-3 sentence answer a ${level} candidate would give.",
    "tips": ["preparation tip 1", "tip 2"]
  }
]
No markdown. No preamble.
`.trim();

// ── Phase 6 — Skill Gap Analysis ─────────────────────────────────────────────

/**
 * @param {string[]} currentSkills   — formData.skillsList
 * @param {string}   targetRole
 * @param {string}   [jobDescription]
 */
export const buildSkillGapPrompt = (currentSkills, targetRole, jobDescription = "") => `
Analyse the skill gap for this candidate and target role.

Current skills: ${currentSkills.join(", ")}
Target role: ${targetRole}
${jobDescription ? `Job description:\n${truncateForGemini(jobDescription, 1500)}` : ""}

Return ONLY JSON:
{
  "missingSkills": ["skill they need to learn"],
  "partialSkills": ["skill they have but need to strengthen"],
  "strongSkills": ["skills they already excel at for this role"],
  "learningResources": [
    { "skill": "...", "resource": "course or book name", "url": "https://..." }
  ],
  "estimatedTimeToReady": "e.g. 2-3 months of focused study"
}
No markdown. No preamble.
`.trim();

// ── Shared utilities ──────────────────────────────────────────────────────────

/**
 * Parse a Gemini response that should be JSON.
 * Strips markdown code fences if the model accidentally adds them.
 *
 * @param {string} raw — raw text from Gemini response
 * @returns {Object|Array}
 * @throws {Error} if JSON cannot be recovered
 */
export const parseGeminiJSON = (raw) => {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: grab the first {...} or [...] block
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try { return JSON.parse(match[1]); } catch { /* fall through */ }
    }
    throw new Error("Gemini returned malformed JSON — please try again.");
  }
};

/**
 * Map an ATS score (0-100) to a letter grade.
 * @param {number} score
 * @returns {'A'|'B'|'C'|'D'|'F'}
 */
export const scoreToGrade = (score) => {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
};

/**
 * Grade → colour mapping for the ATS score UI.
 * @param {string} grade — 'A' | 'B' | 'C' | 'D' | 'F'
 */
export const gradeColor = (grade) => ({
  A: { bg: "#dcfce7", color: "#166534", label: "Excellent" },
  B: { bg: "#dbeafe", color: "#1d4ed8", label: "Good" },
  C: { bg: "#fef9c3", color: "#854d0e", label: "Average" },
  D: { bg: "#fed7aa", color: "#9a3412", label: "Needs Work" },
  F: { bg: "#fee2e2", color: "#991b1b", label: "Poor" },
}[grade] || { bg: "#f3f4f6", color: "#374151", label: "Unknown" });

/**
 * Truncate text before sending to Gemini to stay within sensible token limits.
 * Gemini 1.5 Flash has a ~1M token context but the free tier is rate-limited,
 * so we cap at 4000 chars (~1000 tokens) for resume text.
 *
 * @param {string} text
 * @param {number} [maxChars=4000]
 */
export const truncateForGemini = (text, maxChars = 4000) => {
  if (!text || text.length <= maxChars) return text;
  return (
    text.slice(0, maxChars) +
    "\n\n[Content truncated for analysis — full document still evaluated]"
  );
};

/**
 * Extract a clean display name from ApplicationPage formData.
 * @param {Object} formData
 * @returns {string}
 */
export const getDisplayName = (formData) =>
  `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Candidate";