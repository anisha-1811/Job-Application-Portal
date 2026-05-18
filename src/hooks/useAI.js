// src/hooks/useAI.js
// ─────────────────────────────────────────────────────────────────────────────
// Reusable hook that wraps any AI service call with loading / error / data
// state so your components stay clean.
//
// Base usage:
//   const { data, loading, error, execute } = useAI(generateResume);
//   <button onClick={() => execute(formData)}>Generate Resume</button>
//
// Or use the pre-bound convenience hooks at the bottom of this file:
//   const { data, loading, error, execute } = useResumeGenerator();
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";
import {
  generateResume,
  checkATSScore,
  getJobMatches,
  generateCoverLetter,
  getMockInterview,
  analyzeSkillGap,
} from "../services/ai";

// ── Core hook ─────────────────────────────────────────────────────────────────

/**
 * @param {Function} aiServiceFn   — any exported function from services/ai.js
 * @param {Object}   [options]
 * @param {Function} [options.onSuccess]  — called with (data) on success
 * @param {Function} [options.onError]    — called with (Error) on failure
 */
const useAI = (aiServiceFn, options = {}) => {
  const { onSuccess, onError } = options;

  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    called: false, // tracks whether execute() has ever been called
  });

  // Prevents stale setState calls if the component unmounts mid-request
  const cancelledRef = useRef(false);

  /**
   * execute(...args)
   * Call signature mirrors the wrapped AI service function exactly.
   * Returns the result on success, undefined on failure (error is in state).
   */
  const execute = useCallback(
    async (...args) => {
      cancelledRef.current = false;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        called: true,
      }));

      try {
        const result = await aiServiceFn(...args);
        if (cancelledRef.current) return;

        setState({ data: result, loading: false, error: null, called: true });
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (cancelledRef.current) return;

        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, error, called: true });
        onError?.(error);
        // Not re-thrown — callers read the error from state
      }
    },
    [aiServiceFn, onSuccess, onError]
  );

  /** Reset back to the initial empty state */
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, called: false });
  }, []);

  /**
   * Cancel an in-flight request (best-effort — stops setState only).
   * Useful for unmount cleanup in useEffect.
   */
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState((prev) => ({ ...prev, loading: false }));
  }, []);

  return { ...state, execute, reset, cancel };
};

export default useAI;

// ── Convenience hooks — one per AI feature ────────────────────────────────────
// Import these directly in your pages/components instead of useAI + import.
//
// Pattern:
//   const { data: resume, loading, error, execute: generate } = useResumeGenerator({
//     onSuccess: (data) => console.log('Resume ready!', data),
//   });
//   <button onClick={() => generate(formData)}>Generate Resume</button>

/** Phase 2 — AI Resume Generator
 *  execute(formData)  → { resumeText, sections }
 */
export const useResumeGenerator = (options) => useAI(generateResume, options);

/** Phase 3 — ATS Score Checker
 *  execute(resumeFile, jobDescriptionString)  → { score, grade, errors, suggestions, … }
 */
export const useATSChecker = (options) => useAI(checkATSScore, options);

/** Phase 4 — Job Matcher
 *  execute(formData, jobListings[])  → sorted array of { jobId, matchScore, … }
 */
export const useJobMatcher = (options) => useAI(getJobMatches, options);

/** Phase 6 — Cover Letter Generator
 *  execute(formData, jobDetails, tone)  → { coverLetter, wordCount }
 */
export const useCoverLetter = (options) => useAI(generateCoverLetter, options);

/** Phase 6 — Mock Interview
 *  execute({ role, level, skills, interviewType })
 *  → [{ question, modelAnswer, tips }]
 */
export const useMockInterview = (options) => useAI(getMockInterview, options);

/** Phase 6 — Skill Gap Analysis
 *  execute({ currentSkills, targetRole, jobDescription })
 *  → { missingSkills, partialSkills, strongSkills, learningResources, estimatedTimeToReady }
 */
export const useSkillGap = (options) => useAI(analyzeSkillGap, options);