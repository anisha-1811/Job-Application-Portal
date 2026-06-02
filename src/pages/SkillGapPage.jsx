// src/pages/SkillGapPage.jsx — Phase 6: AI Skill Gap Analyzer
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApplication } from "../services/api";
import { analyzeSkillGap } from "../services/ai";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/shared/Navbar";

// ── Progress Ring ─────────────────────────────────────────────────────────────

function ReadinessGauge({ pct, label }) {
  const color =
    pct >= 80 ? "#10b981" :
    pct >= 60 ? "#6366f1" :
    pct >= 40 ? "#f59e0b" : "#ef4444";

  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={130} height={130} viewBox="0 0 130 130">
        <circle cx={65} cy={65} r={r} fill="none" stroke="#e5e7eb" strokeWidth={10} />
        <circle
          cx={65} cy={65} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle"
          fontSize={22} fontWeight="900" fill="#111827">{pct}%</text>
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle"
          fontSize={10} fontWeight="600" fill={color}>{label}</text>
      </svg>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Overall Readiness</div>
    </div>
  );
}

// ── Skill Pill ────────────────────────────────────────────────────────────────

function SkillPill({ skill, color, bg }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, background: bg, color,
      margin: "3px 4px 3px 0",
    }}>{skill}</span>
  );
}

// ── Learning Card ─────────────────────────────────────────────────────────────

function LearningCard({ item, idx }) {
  const typeColors = {
    course: { bg: "#ede9fe", color: "#6366f1", icon: "🎓" },
    book: { bg: "#fef3c7", color: "#d97706", icon: "📚" },
    project: { bg: "#d1fae5", color: "#059669", icon: "🛠️" },
    certification: { bg: "#fee2e2", color: "#dc2626", icon: "🏆" },
  };
  const tc = typeColors[item.type] || typeColors.course;
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 14,
      padding: "16px 18px", marginBottom: 10,
      display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>{tc.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.skill}</span>
          <span style={{
            background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700,
            padding: "2px 8px", borderRadius: 20,
          }}>{item.type}</span>
        </div>
        <div style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>{item.resource}</div>
        {item.estimatedHours && (
          <div style={{ fontSize: 11, color: "#9ca3af" }}>~{item.estimatedHours}h to complete</div>
        )}
      </div>
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{
            padding: "6px 12px", borderRadius: 8,
            background: "linear-gradient(135deg, #1a237e, #3949ab)",
            color: "#fff", fontSize: 11, fontWeight: 700, textDecoration: "none",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
          Start →
        </a>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SkillGapPage() {
  const navigate = useNavigate();
  const { tokenReady } = useAuth();
  const [profile, setProfile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    if (!tokenReady) return;
    getApplication()
      .then(r => r.success && setProfile(r.data))
      .catch(() => {});
  }, [tokenReady]);

  const currentSkills = profile?.skillsList || [];

  const handleAnalyze = async () => {
    if (!targetRole.trim()) {
      setError("Please enter a target role.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await analyzeSkillGap({ currentSkills, targetRole, jobDescription: jobDesc });
      if (res.success) setResult(res.data);
      else setError(res.error || "Analysis failed.");
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "32px 24px",
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
              background: "linear-gradient(135deg, #f97316, #fb923c)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>📈</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>
                Skill Gap Analyzer
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                Discover what skills you need to land your target role and get a personalised learning path.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: 28,
          boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f3f4f6",
          marginBottom: 24,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                🎯 Target Role <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />

              {/* Current skills preview */}
              {currentSkills.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                    📌 Your Current Skills ({currentSkills.length})
                  </div>
                  <div>
                    {currentSkills.slice(0, 12).map(s => (
                      <SkillPill key={s} skill={s} color="#1a237e" bg="#e8eaf6" />
                    ))}
                    {currentSkills.length > 12 && (
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>+{currentSkills.length - 12} more</span>
                    )}
                  </div>
                </div>
              )}

              {currentSkills.length === 0 && (
                <div style={{
                  marginTop: 12, background: "#fef3c7", border: "1px solid #fbbf24",
                  borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400e",
                }}>
                  ⚠️ No skills found. <button onClick={() => navigate("/apply")}
                    style={{ background: "none", border: "none", color: "#1a237e", fontWeight: 700, cursor: "pointer", padding: 0 }}>
                    Add skills to your profile
                  </button> for a personalised analysis.
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                📄 Job Description <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>(optional but recommended)</span>
              </label>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste a job description for a more precise analysis…"
                rows={6}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none",
                  resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginTop: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              marginTop: 20, padding: "13px 32px",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #f97316, #fb923c)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "🔍 Analyzing your skills…" : "📈 Analyze Skill Gap"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>

            {/* Overview Row */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 20, marginBottom: 24 }}>

              {/* Readiness Gauge */}
              <div style={{
                background: "#fff", borderRadius: 20, padding: "24px 28px",
                boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f3f4f6",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <ReadinessGauge pct={result.overallReadiness || 0} label={result.readinessLabel || ""} />
                <div style={{ marginTop: 12, textAlign: "center", maxWidth: 180 }}>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{result.keyInsight}</div>
                </div>
              </div>

              {/* Weeks to Ready + Quick Wins */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  background: "linear-gradient(135deg, #1a237e, #3949ab)",
                  borderRadius: 16, padding: "20px 22px",
                }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#ffcc02", lineHeight: 1 }}>
                    {result.estimatedWeeksToReady || "?"}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginTop: 4 }}>weeks to job-ready</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>estimated with consistent practice</div>
                </div>
                <div style={{
                  background: "#fff", borderRadius: 16, padding: "16px 18px",
                  border: "1.5px solid #f3f4f6", flex: 1,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>⚡ This Week's Quick Wins</div>
                  {(result.quickWins || []).map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                      <span style={{ color: "#f97316", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills summary */}
              <div style={{
                background: "#fff", borderRadius: 16, padding: "20px 22px",
                border: "1.5px solid #f3f4f6",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>📊 Skills Breakdown</div>
                {[
                  { label: "Strong ✅", count: (result.strongSkills || []).length, color: "#10b981", bg: "#d1fae5" },
                  { label: "Partial ⚠️", count: (result.partialSkills || []).length, color: "#f59e0b", bg: "#fef3c7" },
                  { label: "Missing ❌", count: (result.missingSkills || []).length, color: "#ef4444", bg: "#fee2e2" },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.count}</span>
                    </div>
                    <div style={{ background: "#f3f4f6", borderRadius: 4, height: 6 }}>
                      <div style={{
                        width: `${Math.min(100, item.count * 20)}%`,
                        background: item.color, borderRadius: 4, height: "100%",
                        transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>

              {/* Strong */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1.5px solid #f3f4f6" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginBottom: 12 }}>
                  ✅ Strong Skills ({(result.strongSkills || []).length})
                </div>
                {(result.strongSkills || []).length > 0
                  ? result.strongSkills.map(s => <SkillPill key={s} skill={s} color="#059669" bg="#d1fae5" />)
                  : <div style={{ fontSize: 12, color: "#9ca3af" }}>None identified yet. Add skills to your profile.</div>
                }
              </div>

              {/* Partial */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1.5px solid #f3f4f6" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#d97706", marginBottom: 12 }}>
                  ⚠️ Partial Skills ({(result.partialSkills || []).length})
                </div>
                {(result.partialSkills || []).length > 0
                  ? result.partialSkills.map(p => (
                    <div key={p.skill || p} style={{ marginBottom: 8 }}>
                      <SkillPill skill={p.skill || p} color="#d97706" bg="#fef3c7" />
                      {p.gap && <div style={{ fontSize: 11, color: "#6b7280", marginLeft: 2, marginTop: 2 }}>{p.gap}</div>}
                    </div>
                  ))
                  : <div style={{ fontSize: 12, color: "#9ca3af" }}>No partial skill gaps found.</div>
                }
              </div>

              {/* Missing */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1.5px solid #f3f4f6" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#dc2626", marginBottom: 12 }}>
                  ❌ Missing Skills ({(result.missingSkills || []).length})
                </div>
                {(result.missingSkills || []).length > 0
                  ? result.missingSkills.map(m => {
                    const skill = m.skill || m;
                    const priority = m.priority || "medium";
                    const pColor = priority === "high" ? "#dc2626" : priority === "medium" ? "#d97706" : "#6b7280";
                    return (
                      <div key={skill} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <SkillPill skill={skill} color="#dc2626" bg="#fee2e2" />
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: pColor,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                          }}>{priority}</span>
                        </div>
                        {m.reason && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{m.reason}</div>}
                      </div>
                    );
                  })
                  : <div style={{ fontSize: 12, color: "#9ca3af" }}>No missing skills — you might be ready!</div>
                }
              </div>
            </div>

            {/* Learning Path */}
            {(result.learningPath || []).length > 0 && (
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1.5px solid #f3f4f6" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 20 }}>
                  🗺️ Your Personalised Learning Path
                </div>
                {result.learningPath.map((item, i) => (
                  <LearningCard key={i} item={item} idx={i} />
                ))}
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
      `}</style>
    </div>
  );
}