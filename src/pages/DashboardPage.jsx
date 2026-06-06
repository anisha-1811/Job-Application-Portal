// src/pages/DashboardPage.jsx — Phase 5: User Dashboard + Application Tracker
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplication } from "../services/api";
import Navbar from "../components/shared/Navbar";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name, email) {
  if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return "U";
}

function getProfileCompleteness(data) {
  const checks = [
    { label: "Personal Info",  done: !!(data?.first_name && data?.phone) },
    { label: "Education",      done: !!(data?.tenth_board || (data?.degrees && data.degrees.length > 0)) },
    { label: "Skills",         done: !!(data?.skillsList && data.skillsList.length > 0) },
    { label: "Experience",     done: !!(
        (data?.experiences && data.experiences.length > 0) ||
        (data?.internshipsList && data.internshipsList.length > 0)
      )
    },
    { label: "Projects",       done: !!(data?.projectsList && data.projectsList.length > 0) },
    { label: "Documents",      done: !!(data?.resume_filename) },
  ];
  const done = checks.filter(c => c.done).length;
  return { pct: Math.round((done / checks.length) * 100), checks };
}

const STATUS_CONFIG = {
  submitted: { color: "#10b981", bg: "#d1fae5", label: "Submitted ✓",   icon: "✅" },
  pending:   { color: "#f59e0b", bg: "#fef3c7", label: "Pending Review", icon: "⏳" },
  reviewed:  { color: "#6366f1", bg: "#ede9fe", label: "Under Review",   icon: "🔍" },
  accepted:  { color: "#10b981", bg: "#d1fae5", label: "Accepted! 🎉",  icon: "🎉" },
  rejected:  { color: "#ef4444", bg: "#fee2e2", label: "Not Selected",   icon: "❌" },
};

const TOOLS = [
  {
    id: "apply",
    icon: "📝",
    title: "Application Form",
    desc: "Fill in your complete profile and submit your application.",
    route: "/apply",
    color: "#6366f1",
    phase: 1,
  },
  {
    id: "my-application",
    icon: "📊",
    title: "My Application",
    desc: "Review and manage your submitted application details.",
    route: "/my-application",
    color: "#8b5cf6",
    phase: 1,
  },
  {
    id: "resume-generator",
    icon: "📄",
    title: "Resume AI",
    desc: "Generate an ATS-friendly resume with Gemini AI.",
    route: "/resume-generator",
    color: "#0ea5e9",
    phase: 2,
    badge: "AI",
  },
  {
    id: "ats-checker",
    icon: "🎯",
    title: "ATS Checker",
    desc: "Score your resume against any job description.",
    route: "/ats-checker",
    color: "#f59e0b",
    phase: 3,
    badge: "AI",
  },
  {
    id: "jobs",
    icon: "💼",
    title: "Job Listings",
    desc: "Browse jobs and get AI-powered match scores.",
    route: "/jobs",
    color: "#10b981",
    phase: 4,
    badge: "AI",
  },
  {
    id: "cover-letter",
    icon: "✉️",
    title: "Cover Letter",
    desc: "Generate a tailored cover letter for any job in seconds.",
    route: "/cover-letter",
    color: "#ec4899",
    phase: 6,
    badge: "AI",
  },
  {
    id: "skill-gap",
    icon: "📈",
    title: "Skill Gap Analyzer",
    desc: "Find what skills you're missing for your target role.",
    route: "/skill-gap",
    color: "#f97316",
    phase: 6,
    badge: "AI",
  },
  {
    id: "mock-interview",
    icon: "🎤",
    title: "Mock Interview",
    desc: "Practice with AI-generated questions and model answers.",
    route: "/mock-interview",
    color: "#14b8a6",
    phase: 6,
    badge: "AI",
  },
];

const TIMELINE_STEPS = [
  { label: "Account Created",     icon: "👤", key: "created"   },
  { label: "Profile Filled",      icon: "📝", key: "profile"   },
  { label: "Application Submitted",icon: "🚀",key: "submitted" },
  { label: "Under Review",        icon: "🔍", key: "reviewed"  },
  { label: "Decision",            icon: "🏁", key: "decision"  },
];

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, color, sublabel }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: "0 1px 6px rgba(0,0,0,.06)",
      border: "1.5px solid #f3f4f6",
      flex: 1,
      minWidth: 170,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginTop: 4 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

// ── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({ tool, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? tool.color + "08" : "#fff",
        border: `1.5px solid ${hovered ? tool.color + "50" : "#e5e7eb"}`,
        borderRadius: 16,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${tool.color}20` : "0 1px 4px rgba(0,0,0,.04)",
        position: "relative",
      }}
    >
      {tool.badge && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: tool.color + "20", color: tool.color,
          fontSize: 10, fontWeight: 700, padding: "2px 7px",
          borderRadius: 20, letterSpacing: "0.04em",
        }}>{tool.badge}</span>
      )}
      <div style={{ fontSize: 28, marginBottom: 10 }}>{tool.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 5 }}>
        {tool.title}
      </div>
      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{tool.desc}</div>
    </div>
  );
}

// ── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 80, stroke = 7, color = "#6366f1" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fontSize={size < 70 ? 13 : 16} fontWeight="800" fill="#111827"
      >{pct}%</text>
    </svg>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { currentUser, tokenReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // eslint-disable-line no-unused-vars
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    if (!tokenReady) return; // wait until JWT is stored before calling protected route
    getApplication()
      .then(res => {
        if (res.success) setAppData(res.data);
        else setError("Could not load your profile.");
      })
      .catch(() => setError("Could not load your profile."))
      .finally(() => setLoading(false));
  }, [tokenReady]);

  // Show toast passed via navigation state (e.g. from ApplicationPage redirect)
  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      window.history.replaceState({}, document.title); // clear state so it won't re-show on refresh
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const userName =
    appData?.first_name
      ? `${appData.first_name} ${appData.last_name || ""}`.trim()
      : currentUser?.displayName || currentUser?.email?.split("@")[0] || "there";

  const { pct: completePct, checks } = getProfileCompleteness(appData);
  const status = appData?.final_status || "pending";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  // Timeline active step
  const timelineActive =
    status === "accepted" || status === "rejected" ? 4
    : status === "reviewed" ? 3
    : appData?.final_status === "submitted" ? 2
    : completePct > 20 ? 1 : 0;

  const skillCount = appData?.skillsList?.length || 0;
  const expCount = (appData?.experiences?.length || 0) + (appData?.internshipsList?.length || 0);
  const certCount = appData?.certsList?.length || 0;
  const projectCount = appData?.projectsList?.length || 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{
        maxWidth: 1180, margin: "0 auto", padding: "32px 24px",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
        transition: "all 0.5s ease",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #1a237e 0%, #3949ab 60%, #5c6bc0 100%)",
          borderRadius: 24, padding: "32px 36px",
          display: "flex", alignItems: "center", gap: 24,
          marginBottom: 28, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute",right:-40,top:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.05)" }} />
          <div style={{ position:"absolute",right:60,bottom:-60,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.04)" }} />

          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(255,255,255,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 800, color: "#fff", flexShrink: 0,
            border: "2px solid rgba(255,255,255,.3)",
          }}>
            {getInitials(currentUser?.displayName, currentUser?.email)}
          </div>

          <div style={{ flex: 1, zIndex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 500, marginBottom: 4 }}>
              Welcome back
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              {userName} 👋
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>
              {currentUser?.email}
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)",
            borderRadius: 16, padding: "16px 24px", textAlign: "center",
            border: "1px solid rgba(255,255,255,.2)", zIndex: 1,
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginBottom: 8 }}>
              Profile Complete
            </div>
            <ProgressRing pct={completePct} size={72} stroke={6} color="#ffcc02" />
          </div>

          <div style={{
            background: statusCfg.bg, borderRadius: 12,
            padding: "12px 20px", textAlign: "center",
            border: `1.5px solid ${statusCfg.color}40`, zIndex: 1,
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{statusCfg.icon}</div>
            <div style={{ fontSize: 11, color: statusCfg.color, fontWeight: 700 }}>
              {statusCfg.label}
            </div>
          </div>
        </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: "#fef3c7", color: "#92400e",
          border: "1px solid #fbbf24", borderRadius: 12,
          padding: "12px 28px", fontSize: 14, fontWeight: 600,
          zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,.12)",
          fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap",
        }}>
          ⚠️ {toast}
        </div>
      )}

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Loading your dashboard…
          </div>
        )}

        {!loading && (
          <>
            {/* ── API ID Card ── */}
            {appData?.applicant_id && (
              <div style={{
                background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
                borderRadius: 16, padding: "16px 24px", marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 12,
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Your API ID — use this to log in
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "monospace", letterSpacing: "0.06em", marginTop: 4 }}>
                    {appData.applicant_id}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(appData.applicant_id);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)",
                    color: "#fff", borderRadius: 8, padding: "8px 18px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  📋 Copy ID
                </button>
              </div>
            )}

            {/* ── Edit Application Banner ── */}
            {appData?.application_code && (
              <div style={{
                background: "#fff",
                border: "1.5px solid #6366f1",
                borderRadius: 16,
                padding: "18px 24px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#ede9fe",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>✅</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                      Application submitted
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                      ID: <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#6366f1" }}>
                        {appData.application_code}
                      </span>
                      {appData.submitted_at && (
                        <span style={{ marginLeft: 10 }}>
                          · {new Date(appData.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/apply?edit=1")}
                  style={{
                    background: "linear-gradient(135deg, #1a237e, #3949ab)",
                    color: "#fff", border: "none", borderRadius: 10,
                    padding: "10px 22px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  ✏️ Edit Application
                </button>
              </div>
            )}

            {/* ── Stats Row ── */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              <StatCard icon="💡" value={skillCount} label="Skills Listed"
                color="#6366f1" sublabel={skillCount < 5 ? "Add more skills" : "Great!"} />
              <StatCard icon="💼" value={expCount} label="Experience Entries"
                color="#10b981" sublabel={expCount === 0 ? "Add internships" : undefined} />
              <StatCard icon="🛠️" value={projectCount} label="Projects"
                color="#f59e0b" sublabel={projectCount === 0 ? "Showcase your work" : undefined} />
              <StatCard icon="🏆" value={certCount} label="Certifications"
                color="#ec4899" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

              {/* ── Left: Tools Hub ── */}
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
                  🧰 Career Tools Hub
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 14,
                }}>
                  {TOOLS.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onClick={() => navigate(tool.route)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Right: Sidebar ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Application Timeline */}
                <div style={{
                  background: "#fff", borderRadius: 20, padding: 24,
                  boxShadow: "0 1px 6px rgba(0,0,0,.06)",
                  border: "1.5px solid #f3f4f6",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 20 }}>
                    📋 Application Journey
                  </div>
                  {TIMELINE_STEPS.map((step, i) => {
                    const isDone = i < timelineActive;
                    const isActive = i === timelineActive;
                    return (
                      <div key={step.key} style={{ display: "flex", gap: 14, marginBottom: i < TIMELINE_STEPS.length - 1 ? 0 : 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: isDone ? "#1a237e" : isActive ? "#6366f1" : "#f3f4f6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14, flexShrink: 0,
                            border: isActive ? "2px solid #6366f1" : "none",
                            boxShadow: isActive ? "0 0 0 4px #6366f120" : "none",
                          }}>
                            {isDone ? "✓" : step.icon}
                          </div>
                          {i < TIMELINE_STEPS.length - 1 && (
                            <div style={{
                              width: 2, height: 28, flexShrink: 0, margin: "4px 0",
                              background: isDone ? "#1a237e" : "#e5e7eb",
                            }} />
                          )}
                        </div>
                        <div style={{ paddingTop: 8, paddingBottom: i < TIMELINE_STEPS.length - 1 ? 0 : 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: isActive ? 700 : 500,
                            color: isDone ? "#1a237e" : isActive ? "#111827" : "#9ca3af",
                            marginBottom: 2,
                          }}>
                            {step.label}
                          </div>
                          {isActive && (
                            <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>
                              Current Stage
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Profile Checklist */}
                <div style={{
                  background: "#fff", borderRadius: 20, padding: 24,
                  boxShadow: "0 1px 6px rgba(0,0,0,.06)",
                  border: "1.5px solid #f3f4f6",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
                    ✅ Profile Checklist
                  </div>
                  {checks.map(c => (
                    <div key={c.label} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 0",
                      borderBottom: "1px solid #f9fafb",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: c.done ? "#d1fae5" : "#f3f4f6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, flexShrink: 0,
                      }}>
                        {c.done ? "✓" : "○"}
                      </div>
                      <span style={{ fontSize: 13, color: c.done ? "#374151" : "#9ca3af", fontWeight: 500 }}>
                        {c.label}
                      </span>
                      {!c.done && (
                        <button
                          onClick={() => navigate("/apply")}
                          style={{
                            marginLeft: "auto", fontSize: 10, color: "#6366f1",
                            background: "none", border: "none", cursor: "pointer",
                            fontWeight: 700, padding: 0,
                          }}
                        >
                          Add →
                        </button>
                      )}
                    </div>
                  ))}

                  {completePct < 100 && (
                    <button
                      onClick={() => navigate("/apply")}
                      style={{
                        width: "100%", marginTop: 14,
                        background: "linear-gradient(135deg, #1a237e, #3949ab)",
                        color: "#fff", border: "none", borderRadius: 10,
                        padding: "10px 0", fontSize: 13, fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Complete Profile →
                    </button>
                  )}
                </div>

                {/* Quick Actions */}
                <div style={{
                  background: "linear-gradient(135deg, #1a237e, #3949ab)",
                  borderRadius: 20, padding: 24,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
                    ⚡ Quick Actions
                  </div>
                  {[
                    { label: "Check ATS Score",       icon: "🎯", route: "/ats-checker" },
                    { label: "Browse Job Matches",    icon: "💼", route: "/jobs" },
                    { label: "Generate Cover Letter", icon: "✉️", route: "/cover-letter" },
                    { label: "Practice Interview",    icon: "🎤", route: "/mock-interview" },
                  ].map(a => (
                    <button
                      key={a.route}
                      onClick={() => navigate(a.route)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        width: "100%", marginBottom: 8,
                        background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
                        borderRadius: 10, padding: "10px 14px",
                        color: "#fff", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}
                    >
                      <span>{a.icon}</span> {a.label}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}