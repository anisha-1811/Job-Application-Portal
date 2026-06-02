// src/pages/MockInterviewPage.jsx — Phase 6: AI Mock Interview
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApplication } from "../services/api";
import { getMockInterview } from "../services/ai";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/shared/Navbar";

// ── Config ────────────────────────────────────────────────────────────────────

const LEVELS = [
  { id: "junior",  label: "Junior",  icon: "🌱", desc: "0–2 years exp" },
  { id: "mid",     label: "Mid",     icon: "🚀", desc: "2–5 years exp" },
  { id: "senior",  label: "Senior",  icon: "⭐", desc: "5+ years exp"  },
];

const TYPES = [
  { id: "technical",   label: "Technical",   icon: "💻", desc: "Coding & system design"  },
  { id: "behavioural", label: "Behavioural", icon: "🤝", desc: "STAR method questions"    },
  { id: "mixed",       label: "Mixed",       icon: "🎯", desc: "Both types combined"      },
];

const DIFFICULTY_COLORS = {
  easy:   { bg: "#d1fae5", color: "#059669" },
  medium: { bg: "#fef3c7", color: "#d97706" },
  hard:   { bg: "#fee2e2", color: "#dc2626" },
};

const TYPE_COLORS = {
  technical:   { bg: "#ede9fe", color: "#6366f1" },
  behavioural: { bg: "#dbeafe", color: "#2563eb" },
  situational: { bg: "#fef3c7", color: "#d97706" },
};

// ── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({ q, idx, isOpen, onToggle }) {
  const dc = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.medium;
  const tc = TYPE_COLORS[q.type] || TYPE_COLORS.technical;

  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1.5px solid #f3f4f6",
      overflow: "hidden", transition: "box-shadow 0.2s",
      boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.04)",
      marginBottom: 12,
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          padding: "18px 22px", cursor: "pointer",
          display: "flex", alignItems: "flex-start", gap: 14,
          background: isOpen ? "#fafafa" : "#fff",
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #1a237e, #3949ab)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff",
        }}>{idx + 1}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ background: dc.bg, color: dc.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
              {q.difficulty?.toUpperCase()}
            </span>
            <span style={{ background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
              {q.type}
            </span>
            {q.category && (
              <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
                {q.category}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.5 }}>
            {q.question}
          </div>
        </div>

        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: isOpen ? "#e8eaf6" : "#f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: isOpen ? "#1a237e" : "#9ca3af",
          flexShrink: 0, transition: "all 0.2s",
          transform: isOpen ? "rotate(180deg)" : "none",
        }}>▾</div>
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ padding: "0 22px 22px 68px", animation: "slideDown 0.25s ease" }}>

          {/* Model Answer */}
          <div style={{
            background: "#f0f4ff", borderRadius: 12, padding: "16px 18px", marginBottom: 14,
            border: "1.5px solid #c7d2fe",
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#1a237e", marginBottom: 8, letterSpacing: "0.04em" }}>
              💡 MODEL ANSWER
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{q.modelAnswer}</p>
          </div>

          {/* Tips */}
          {q.tips?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>🎯 Tips to Answer Well</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up */}
          {q.followUp && (
            <div style={{
              background: "#fef3c7", borderRadius: 10, padding: "10px 14px",
              border: "1px solid #fde68a", fontSize: 12,
            }}>
              <span style={{ fontWeight: 700, color: "#92400e" }}>🔄 Likely Follow-up: </span>
              <span style={{ color: "#78350f" }}>{q.followUp}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MockInterviewPage() {
  const navigate = useNavigate();
  const { tokenReady } = useAuth();
  const [profile, setProfile] = useState(null);
  const [config, setConfig] = useState({
    role: "", level: "mid", type: "mixed", numQuestions: 8,
  });
  const [questions, setQuestions] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState({ revealed: new Set(), answered: new Set() });

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    if (!tokenReady) return;
    getApplication()
      .then(r => { if (r.success && r.data) setProfile(r.data); })
      .catch(() => {});
  }, [tokenReady]);

  const set = (k, v) => setConfig(c => ({ ...c, [k]: v }));

  const handleStart = async () => {
    if (!config.role.trim()) {
      setError("Please enter a job role.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await getMockInterview({
        role: config.role,
        level: config.level,
        skills: profile?.skillsList || [],
        interviewType: config.type,
        numQuestions: config.numQuestions,
      });
      if (res.success) {
        setQuestions(Array.isArray(res.data) ? res.data : []);
        setStarted(true);
        setProgress({ revealed: new Set(), answered: new Set() });
        setOpenIdx(null);
      } else {
        setError(res.error || "Generation failed.");
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (i) => {
    setOpenIdx(prev => prev === i ? null : i);
    setProgress(p => ({ ...p, revealed: new Set([...p.revealed, i]) }));
  };

  const revealedCount = progress.revealed.size;
  const totalQ = questions.length;

  const easyCount = questions.filter(q => q.difficulty === "easy").length;
  const medCount = questions.filter(q => q.difficulty === "medium").length;
  const hardCount = questions.filter(q => q.difficulty === "hard").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "32px 24px",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
        transition: "all 0.5s ease",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10, padding: 0 }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>🎤</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>
                Mock Interview Prep
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                Practice with AI-generated questions and model answers tailored to your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Config Card */}
        {!started && (
          <div style={{
            background: "#fff", borderRadius: 20, padding: 32,
            boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f3f4f6",
          }}>
            {/* Role input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                💼 Job Role You're Preparing For <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                value={config.role}
                onChange={e => set("role", e.target.value)}
                placeholder="e.g. Frontend Developer, Data Analyst, Product Manager"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#14b8a6"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                onKeyDown={e => e.key === "Enter" && handleStart()}
              />
            </div>

            {/* Level */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                🎚️ Experience Level
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {LEVELS.map(l => (
                  <div
                    key={l.id}
                    onClick={() => set("level", l.id)}
                    style={{
                      flex: 1, borderRadius: 14, padding: "14px 10px", textAlign: "center",
                      border: `2px solid ${config.level === l.id ? "#14b8a6" : "#e5e7eb"}`,
                      background: config.level === l.id ? "#f0fdfa" : "#fff",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{l.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: config.level === l.id ? "#14b8a6" : "#374151" }}>{l.label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{l.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                🎯 Interview Type
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {TYPES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => set("type", t.id)}
                    style={{
                      flex: 1, borderRadius: 14, padding: "14px 10px", textAlign: "center",
                      border: `2px solid ${config.type === t.id ? "#14b8a6" : "#e5e7eb"}`,
                      background: config.type === t.id ? "#f0fdfa" : "#fff",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: config.type === t.id ? "#14b8a6" : "#374151" }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Number of questions */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                🔢 Number of Questions: <span style={{ color: "#14b8a6" }}>{config.numQuestions}</span>
              </label>
              <input
                type="range" min={4} max={12} step={1}
                value={config.numQuestions}
                onChange={e => set("numQuestions", parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#14b8a6" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                <span>4 (quick)</span><span>8 (standard)</span><span>12 (intensive)</span>
              </div>
            </div>

            {profile?.skillsList?.length > 0 && (
              <div style={{
                background: "#f0fdfa", border: "1.5px solid #99f6e4",
                borderRadius: 10, padding: "10px 14px", fontSize: 12,
                color: "#0d9488", marginBottom: 20,
              }}>
                ✅ Using your {profile.skillsList.length} profile skills to personalise questions.
              </div>
            )}

            {error && (
              <div style={{
                background: "#fee2e2", border: "1.5px solid #fca5a5",
                borderRadius: 10, padding: "10px 14px", fontSize: 13,
                color: "#dc2626", marginBottom: 16,
              }}>⚠️ {error}</div>
            )}

            <button
              onClick={handleStart}
              disabled={loading}
              style={{
                width: "100%", padding: "14px 0",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #14b8a6, #06b6d4)",
                color: "#fff", border: "none", borderRadius: 14,
                fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
              }}>
              {loading ? `🤔 Generating ${config.numQuestions} questions…` : "🎤 Start Mock Interview"}
            </button>
          </div>
        )}

        {/* Interview Session */}
        {started && questions.length > 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>

            {/* Session header */}
            <div style={{
              background: "linear-gradient(135deg, #1a237e, #3949ab)",
              borderRadius: 20, padding: "22px 28px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4 }}>PRACTICING FOR</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{config.role}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 4 }}>
                  {LEVELS.find(l => l.id === config.level)?.label} · {TYPES.find(t => t.id === config.type)?.label} · {totalQ} Questions
                </div>
              </div>

              {/* Progress */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#ffcc02" }}>{revealedCount}/{totalQ}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>Questions Reviewed</div>
              </div>

              {/* Difficulty breakdown */}
              <div style={{ display: "flex", gap: 10 }}>
                {[{ l: "Easy", n: easyCount, c: "#10b981" }, { l: "Med", n: medCount, c: "#f59e0b" }, { l: "Hard", n: hardCount, c: "#ef4444" }].map(d => (
                  <div key={d.l} style={{
                    background: "rgba(255,255,255,.1)", borderRadius: 10,
                    padding: "8px 14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: d.c }}>{d.n}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>{d.l}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStarted(false); setQuestions([]); }}
                style={{
                  padding: "10px 18px", borderRadius: 10,
                  background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)",
                  color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>
                ↻ New Session
              </button>
            </div>

            {/* Progress bar */}
            <div style={{
              background: "#fff", borderRadius: 12, padding: "10px 16px",
              marginBottom: 20, border: "1.5px solid #f3f4f6",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>Progress</span>
              <div style={{ flex: 1, background: "#e5e7eb", borderRadius: 6, height: 8 }}>
                <div style={{
                  width: `${(revealedCount / totalQ) * 100}%`,
                  background: "linear-gradient(90deg, #14b8a6, #06b6d4)",
                  borderRadius: 6, height: "100%", transition: "width 0.4s ease",
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#14b8a6" }}>{Math.round((revealedCount / totalQ) * 100)}%</span>
            </div>

            {/* Question cards */}
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id || i}
                q={q}
                idx={i}
                isOpen={openIdx === i}
                onToggle={() => toggleQuestion(i)}
              />
            ))}

            {/* Completion message */}
            {revealedCount === totalQ && (
              <div style={{
                background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                borderRadius: 16, padding: "24px 28px", textAlign: "center",
                border: "1.5px solid #6ee7b7", marginTop: 16,
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#065f46", marginBottom: 6 }}>
                  Great practice session!
                </div>
                <div style={{ fontSize: 13, color: "#047857", marginBottom: 16 }}>
                  You've reviewed all {totalQ} questions. Keep practicing to build confidence.
                </div>
                <button
                  onClick={handleStart}
                  style={{
                    padding: "11px 28px", borderRadius: 10,
                    background: "#059669", color: "#fff",
                    border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}>
                  🔄 Generate New Set
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}