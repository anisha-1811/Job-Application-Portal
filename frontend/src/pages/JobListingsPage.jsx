// src/pages/JobListingsPage.jsx  — Phase 4: Job Listings + AI Job Matching
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobs, fetchFilters } from "../services/jobs";
import { getJobMatches } from "../services/ai";
import { getApplication } from "../services/api"; // to load user profile for AI matching
import Navbar from "../components/shared/Navbar";

// ── Constants ─────────────────────────────────────────────────────────────────
const MATCH_COLORS = {
  strong:   { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7", label: "Strong Match" },
  moderate: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd", label: "Good Match"   },
  stretch:  { bg: "#fef9c3", text: "#854d0e", border: "#fde047", label: "Stretch"      },
};

const SCORE_COLOR = (score) =>
  score >= 80 ? "#10b981"
  : score >= 60 ? "#3b82f6"
  : score >= 40 ? "#eab308"
  : "#ef4444";

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterBar({ filters, values, onChange, onClear }) {
  const inputStyle = {
    padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb",
    fontSize: 13, background: "#fff", cursor: "pointer", outline: "none",
    minWidth: 140,
  };

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
      background: "#fff", borderRadius: 14, padding: "14px 18px",
      boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 20,
    }}>
      {/* Search */}
      <input
        type="text"
        value={values.search}
        onChange={(e) => onChange("search", e.target.value)}
        placeholder="🔍  Search jobs, skills, companies…"
        style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      />

      {/* Category */}
      <select value={values.category} onChange={(e) => onChange("category", e.target.value)} style={inputStyle}>
        <option value="">All Categories</option>
        {filters.categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Mode */}
      <select value={values.mode} onChange={(e) => onChange("mode", e.target.value)} style={inputStyle}>
        <option value="">Any Mode</option>
        {filters.modes.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      {/* Type */}
      <select value={values.type} onChange={(e) => onChange("type", e.target.value)} style={inputStyle}>
        <option value="">Any Type</option>
        {filters.types.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Clear */}
      {(values.search || values.category || values.mode || values.type) && (
        <button
          onClick={onClear}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb",
            background: "#f9fafb", fontSize: 13, cursor: "pointer", color: "#6b7280",
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

function MatchBadge({ recommendation, score }) {
  if (!recommendation) return null;
  const cfg = MATCH_COLORS[recommendation] || MATCH_COLORS.stretch;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
        background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
      }}>
        {cfg.label}
      </span>
      <span style={{
        fontSize: 13, fontWeight: 800,
        color: SCORE_COLOR(score),
      }}>
        {score}% match
      </span>
    </div>
  );
}

function JobCard({ job, matchData, onExpand, expanded }) {
  const badge = matchData?.applyRecommendation;
  const score = matchData?.matchScore;

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px 22px",
      boxShadow: expanded ? "0 4px 20px rgba(99,102,241,.15)" : "0 1px 4px rgba(0,0,0,.07)",
      border: expanded ? "2px solid #6366f1" : "2px solid transparent",
      transition: "all 0.2s", cursor: "pointer",
      marginBottom: 14,
    }}
      onClick={onExpand}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", gap: 14, flex: 1 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: "#f0f4ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, flexShrink: 0,
          }}>
            {job.logo}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
              {job.title}
            </h3>
            <p style={{ margin: "3px 0 6px", fontSize: 13, color: "#6b7280" }}>
              {job.company} · {job.location}
            </p>

            {/* Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[job.type, job.mode, job.experience, job.salary].map((tag) => tag && (
                <span key={tag} style={{
                  background: "#f3f4f6", color: "#374151", borderRadius: 6,
                  padding: "2px 8px", fontSize: 11, fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
              <span style={{
                background: "#ede9fe", color: "#5b21b6", borderRadius: 6,
                padding: "2px 8px", fontSize: 11, fontWeight: 600,
              }}>
                {job.category}
              </span>
            </div>
          </div>
        </div>

        {/* Match badge (shown after AI analysis) */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {matchData && <MatchBadge recommendation={badge} score={score} />}
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9ca3af" }}>
            Deadline: {job.deadline}
          </p>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ marginTop: 18, borderTop: "1px solid #f3f4f6", paddingTop: 18 }}>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            {job.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Requirements */}
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                Requirements
              </p>
              <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{r}</li>
                ))}
              </ul>
            </div>

            {/* AI Insights */}
            {matchData && (
              <div style={{ background: "#f8faff", borderRadius: 10, padding: 14 }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1 }}>
                  🤖 AI Insights
                </p>
                {matchData.matchReasons?.length > 0 && (
                  <>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Why you fit:</p>
                    <ul style={{ margin: "0 0 8px", padding: "0 0 0 14px" }}>
                      {matchData.matchReasons.map((r, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#065f46", marginBottom: 3 }}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}
                {matchData.missingSkills?.length > 0 && (
                  <>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Gaps to address:</p>
                    <ul style={{ margin: "0 0 8px", padding: "0 0 0 14px" }}>
                      {matchData.missingSkills.map((s, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#991b1b", marginBottom: 3 }}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
                {matchData.tip && (
                  <div style={{ background: "#fffbeb", borderRadius: 8, padding: "8px 10px" }}>
                    <span style={{ fontSize: 12, color: "#92400e" }}>💡 {matchData.tip}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div style={{ marginTop: 14 }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
              Skills Required
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {job.skills.map((s) => (
                <span key={s} style={{
                  background: "#ede9fe", color: "#5b21b6",
                  padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function JobListingsPage() {
  const navigate = useNavigate();

  // Jobs & filters state
  const [jobs, setJobs]             = useState([]);
  const [filters, setFilters]       = useState({ categories: [], modes: [], types: [] });
  const [filterValues, setFilterValues] = useState({ search: "", category: "", mode: "", type: "" });
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError]     = useState(null);
  const [totalJobs, setTotalJobs]   = useState(0);
  const [expandedJob, setExpandedJob] = useState(null);

  // AI matching state
  const [matchResults, setMatchResults] = useState({}); // { jobId: matchData }
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiError, setAiError]           = useState(null);
  const [aiRan, setAiRan]               = useState(false);

  // Load filters once on mount
  useEffect(() => {
    fetchFilters()
      .then((res) => res.success && setFilters(res.data))
      .catch(console.error);
  }, []);

  // Load jobs when filter values change (debounced via useEffect)
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    setJobError(null);
    try {
      const res = await fetchJobs({
        search: filterValues.search,
        category: filterValues.category,
        mode: filterValues.mode,
        type: filterValues.type,
      });
      if (res.success) {
        setJobs(res.data);
        setTotalJobs(res.total);
        // Clear AI results when filters change (data changed)
        setMatchResults({});
        setAiRan(false);
      }
    } catch (err) {
      setJobError(err.message);
    } finally {
      setLoadingJobs(false);
    }
  }, [filterValues]);

  useEffect(() => {
    const timer = setTimeout(loadJobs, 300); // debounce search input
    return () => clearTimeout(timer);
  }, [loadJobs]);

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({ search: "", category: "", mode: "", type: "" });
  };

  // ── AI Job Matching ────────────────────────────────────────────────────────
  const handleAIMatch = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      // 1. Fetch the user's saved application profile
      const profileRes = await getApplication();
      if (!profileRes?.success || !profileRes.data) {
        setAiError("Please complete your application profile first before running AI matching.");
        return;
      }

      // 2. Call AI with profile + current job list
      const aiRes = await getJobMatches(profileRes.data, jobs);
      if (!aiRes?.success || !Array.isArray(aiRes.data)) {
        throw new Error(aiRes?.error || "AI matching failed");
      }

      // 3. Map results by jobId for O(1) lookup
      const resultMap = {};
      aiRes.data.forEach((match) => {
        resultMap[match.jobId] = match;
      });

      setMatchResults(resultMap);
      setAiRan(true);

      // Auto-sort jobs by match score
      setJobs((prev) =>
        [...prev].sort((a, b) => {
          const scoreA = resultMap[a.id]?.matchScore ?? -1;
          const scoreB = resultMap[b.id]?.matchScore ?? -1;
          return scoreB - scoreA;
        })
      );
    } catch (err) {
      setAiError(err.message || "AI matching failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <Navbar />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>

        {/* ── Page Header ── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#eef2ff", color: "#4f46e5", borderRadius: 99,
            padding: "6px 16px", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", marginBottom: 14,
          }}>
            🎯 Phase 4 — Job Listings + AI Matching
          </div>
          <h1 style={{
            margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800, color: "#111827",
          }}>
            Find Your Next Role
          </h1>
          <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: 15, maxWidth: 480, marginInline: "auto" }}>
            Browse openings and let our AI rank them by how well they match your profile.
          </p>

          {/* AI Match CTA */}
          <button
            onClick={handleAIMatch}
            disabled={aiLoading || jobs.length === 0}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: aiRan
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              opacity: aiLoading || jobs.length === 0 ? 0.7 : 1,
              transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(99,102,241,.35)",
            }}
          >
            {aiLoading
              ? "🤖 Analyzing matches…"
              : aiRan
              ? "✅ Re-run AI Match"
              : "✨ AI Match My Profile"}
          </button>

          {aiRan && !aiLoading && (
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "#10b981", fontWeight: 600 }}>
              Jobs sorted by your match score · Click any card to see AI insights
            </p>
          )}

          {aiError && (
            <div style={{
              margin: "12px auto 0", maxWidth: 460,
              background: "#fee2e2", color: "#991b1b", borderRadius: 10,
              padding: "10px 16px", fontSize: 13, border: "1px solid #fca5a5",
            }}>
              ❌ {aiError}
              {aiError.includes("profile") && (
                <button
                  onClick={() => navigate("/apply")}
                  style={{
                    marginLeft: 10, padding: "2px 10px", borderRadius: 6,
                    border: "1px solid #991b1b", background: "transparent",
                    color: "#991b1b", fontSize: 12, cursor: "pointer",
                  }}
                >
                  Fill Profile →
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Filter Bar ── */}
        <FilterBar
          filters={filters}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* ── Results count ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            {loadingJobs
              ? "Loading…"
              : `${totalJobs} job${totalJobs !== 1 ? "s" : ""} found`}
          </p>
          {aiRan && (
            <p style={{ margin: 0, fontSize: 13, color: "#6366f1", fontWeight: 600 }}>
              Sorted by AI match score ↓
            </p>
          )}
        </div>

        {/* ── Job Cards ── */}
        {loadingJobs ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "4px solid #e5e7eb", borderTopColor: "#6366f1",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            <p style={{ color: "#6b7280", margin: 0 }}>Loading job listings…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : jobError ? (
          <div style={{
            background: "#fee2e2", color: "#991b1b", borderRadius: 12,
            padding: "20px 24px", textAlign: "center",
          }}>
            ❌ {jobError}
            <button
              onClick={loadJobs}
              style={{
                marginLeft: 12, padding: "6px 14px", borderRadius: 8,
                border: "1px solid #991b1b", background: "transparent",
                color: "#991b1b", cursor: "pointer", fontSize: 13,
              }}
            >
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "60px 24px",
            textAlign: "center", color: "#9ca3af",
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>No jobs match your filters</p>
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>Try clearing the filters to see all listings</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              matchData={matchResults[job.id] || null}
              expanded={expandedJob === job.id}
              onExpand={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}