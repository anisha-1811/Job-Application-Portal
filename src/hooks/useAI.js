import { useState, useCallback } from "react";
import {
  generateResume,
  checkATSScore,
  generateCoverLetter,
  analyzeSkillGap,
  getMockInterview,
} from "../services/ai";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        throw new Error(result.error || "AI request failed");
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Something went wrong";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, data, execute, reset };
}

export function useResumeGenerator() {
  const { loading, error, data, execute, reset } = useAI();
  const generate = useCallback(
    (formData) => execute(generateResume, formData),
    [execute]
  );
  return { loading, error, resumeData: data, generate, reset };
}

export function useATSScore() {
  const { loading, error, data, execute, reset } = useAI();
  const analyze = useCallback(
    (resumeFile, jobDescription, jobTitle) =>
      execute(checkATSScore, resumeFile, jobDescription, jobTitle),
    [execute]
  );
  return { loading, error, atsData: data, analyze, reset };
}

export function useCoverLetter() {
  const { loading, error, data, execute, reset } = useAI();
  const generate = useCallback(
    (payload) => execute(generateCoverLetter, payload),
    [execute]
  );
  return { loading, error, letterData: data, generate, reset };
}

export function useSkillGap() {
  const { loading, error, data, execute, reset } = useAI();
  const analyze = useCallback(
    (payload) => execute(analyzeSkillGap, payload),
    [execute]
  );
  return { loading, error, gapData: data, analyze, reset };
}

export function useMockInterview() {
  const { loading, error, data, execute, reset } = useAI();
  const start = useCallback(
    (payload) => execute(getMockInterview, payload),
    [execute]
  );
  return { loading, error, interviewData: data, start, reset };
}