// src/components/ats/ATSScoreResult.jsx
import React, { useEffect, useRef } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const gradeColor = {
  A: { bg: "#d1fae5", text: "#065f46", ring: "#10b981" },
  B: { bg: "#dbeafe", text: "#1e40af", ring: "#3b82f6" },
  C: { bg: "#fef9c3", text: "#854d0e", ring: "#eab308" },
  D: { bg: "#ffedd5", text: "#9a3412", ring: "#f97316" },
  F: { bg: "#fee2e2", text: "#991b1b", ring: "#ef4444" },
};

const priorityConfig = {
  high: { label: "High Priority", bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  medium: { label: "Medium", bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
  low: { label: "Low", bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
};

const shortlistColors = {
  Low: "#ef4444",
  Medium: "#f97316",
  High: "#3b82f6",
  "Very High": "#10b981",
};

// Animated circular score gauge
function ScoreGauge({ score, grade }) {
  const circleRef = useRef(null);
  const colors = gradeColor[grade] || gradeColor["C"];
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)";
      circleRef.current.style.strokeDashoffset = offset;
    }
  }, [offset]);

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth="10"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // starts at 0, animates
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: colors.ring, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>/ 100</span>
        <span style={{
          fontSize: 18, fontWeight: 800,
          background: colors.bg, color: colors.text,
          borderRadius: 6, padding: "1px 8px", marginTop: 2,
        }}>{grade}</span>
      </div>
    </div>
  );
}

// Horizontal bar for section scores
function SectionBar({ label, score }) {
  const color =
    score >= 80 ? "#10b981" :
    score >= 60 ? "#3b82f6" :
    score >= 40 ? "#eab308" : "#ef4444";

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: 7, background: "#f3f4f6", borderRadius: 99 }}>
        <div style={{
          height: "100%", width: `${score}%`, background: color,
          borderRadius: 99, transition: "width 0.9s ease",
        }} />
      </div>
    </div>
  );
}

// Keyword pill
function Pill({ text, matched }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
      background: matched ? "#d1fae5" : "#fee2e2",
      color: matched ? "#065f46" : "#991b1b",
      border: `1px solid ${matched ? "#6ee7b7" : "#fca5a5"}`,
      margin: "3px",
    }}>
      <span>{matched ? "✓" : "✗"}</span> {text}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ATSScoreResult({ data }) {
  if (!data) return null;

  const {
    overall_score, grade, verdict,
    section_scores = {},
    matched_keywords = [], missing_keywords = [],
    strengths = [], gaps = [], suggestions = [],
    estimated_shortlist_chance, resume_filename,
    resume_word_count, analyzed_at,
  } = data;

  const sectionLabels = {
    keywords: "Keyword Match",
    experience: "Experience Relevance",
    skills: "Skills Alignment",
    education: "Education Fit",
    formatting: "ATS Formatting",
  };

  const shortlistColor = shortlistColors[estimated_shortlist_chance] || "#6b7280";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header card ── */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,.08)",
        display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center",
      }}>
        <ScoreGauge score={overall_score} grade={grade} />

        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ margin: "0 0 6px", fontSize: 15, color: "#374151", fontStyle: "italic" }}>
            "{verdict}"
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#f0fdf4", borderRadius: 8, padding: "6px 12px",
            }}>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Shortlist Chance</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: shortlistColor }}>
                {estimated_shortlist_chance}
              </span>
            </div>
            <div style={{
              background: "#f9fafb", borderRadius: 8, padding: "6px 12px",
            }}>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Words: </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{resume_word_count}</span>
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "#9ca3af" }}>
            📄 {resume_filename} · Analyzed {new Date(analyzed_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Section scores */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
            📊 Section Breakdown
          </h3>
          {Object.entries(section_scores).map(([key, val]) => (
            <SectionBar key={key} label={sectionLabels[key] || key} score={val} />
          ))}
        </div>

        {/* Strengths & Gaps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#f0fdf4", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#065f46" }}>✅ Strengths</h3>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {strengths.map((s, i) => (
                <li key={i} style={{ fontSize: 13, color: "#065f46", marginBottom: 4 }}>{s}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: "#fff7ed", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#9a3412" }}>⚠️ Gaps</h3>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {gaps.map((g, i) => (
                <li key={i} style={{ fontSize: 13, color: "#9a3412", marginBottom: 4 }}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Keywords ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
          🔍 Keyword Analysis
        </h3>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
            MATCHED ({matched_keywords.length})
          </span>
          <div>
            {matched_keywords.map((k, i) => <Pill key={i} text={k} matched />)}
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
            MISSING ({missing_keywords.length}) — add these to improve your score
          </span>
          <div>
            {missing_keywords.map((k, i) => <Pill key={i} text={k} matched={false} />)}
          </div>
        </div>
      </div>

      {/* ── Action Plan ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
          🎯 Action Plan
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {suggestions.map((s, i) => {
            const cfg = priorityConfig[s.priority] || priorityConfig.low;
            return (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 14px", borderRadius: 10, background: cfg.bg,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: cfg.dot, flexShrink: 0, marginTop: 5,
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: cfg.text,
                    textTransform: "uppercase", letterSpacing: 1,
                  }}>{cfg.label}</span>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#374151" }}>{s.action}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}