// src/components/shared/Navbar.jsx — Phase 5+6: Dashboard + AI Tools dropdown
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const AI_TOOLS = [
  { label: "📄 Resume AI",       route: "/resume-generator" },
  { label: "🎯 ATS Checker",     route: "/ats-checker"      },
  { label: "💼 Job Listings",    route: "/jobs"             },
  { label: "✉️ Cover Letter",    route: "/cover-letter"     },
  { label: "📈 Skill Gap",       route: "/skill-gap"        },
  { label: "🎤 Mock Interview",  route: "/mock-interview"   },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [toolsOpen, setToolsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isToolActive = AI_TOOLS.some(t => t.route === location.pathname);

  const navBtn = (path, label) => (
    <button
      key={path}
      style={{
        background: isActive(path) ? "rgba(99,102,241,0.12)" : "transparent",
        color: isActive(path) ? "#6366f1" : "#374151",
        border: "none", padding: "6px 12px", borderRadius: 8,
        fontSize: 13, fontWeight: isActive(path) ? 700 : 500,
        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
      }}
      onClick={() => navigate(path)}
    >
      {label}
    </button>
  );

  return (
    <nav className="app-navbar">
      {/* Brand */}
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <span className="brand-icon">🎓✨</span>
        <span className="brand-text">Career Portal</span>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {currentUser ? (
          <>
            {/* Dashboard */}
            {navBtn("/dashboard", "🏠 Dashboard")}

            {/* AI Tools Dropdown */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button style={{
                background: isToolActive ? "rgba(99,102,241,0.12)" : "transparent",
                color: isToolActive ? "#6366f1" : "#374151",
                border: "none", padding: "6px 12px", borderRadius: 8,
                fontSize: 13, fontWeight: isToolActive ? 700 : 500,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
              }}>
                🤖 AI Tools ▾
              </button>

              {toolsOpen && (
                <div style={{
                  position: "absolute", top: "100%", right: 0,
                  background: "#fff", borderRadius: 14, padding: "8px",
                  boxShadow: "0 8px 32px rgba(0,0,0,.12)",
                  border: "1.5px solid #e5e7eb", minWidth: 200, zIndex: 100,
                  marginTop: 4,
                }}>
                  {AI_TOOLS.map(t => (
                    <button
                      key={t.route}
                      onClick={() => { navigate(t.route); setToolsOpen(false); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "9px 14px", borderRadius: 9, border: "none",
                        background: isActive(t.route) ? "#e8eaf6" : "transparent",
                        color: isActive(t.route) ? "#1a237e" : "#374151",
                        fontSize: 13, fontWeight: isActive(t.route) ? 700 : 500,
                        cursor: "pointer", transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { if (!isActive(t.route)) e.target.style.background = "#f3f4f6"; }}
                      onMouseLeave={e => { if (!isActive(t.route)) e.target.style.background = "transparent"; }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {navBtn("/my-application", "📊 My Application")}

            <div className="user-pill">
              <span className="user-dot"></span>
              👤 {currentUser.displayName || currentUser.email?.split("@")[0]}
            </div>

            <button
              onClick={async () => { await logout(); navigate("/"); }}
              className="navbar-logout"
            >
              🚪 Sign Out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="navbar-outline">
              🔐 Login
            </button>
            <button onClick={() => navigate("/register")} className="navbar-primary">
              🚀 Apply Now
            </button>
          </>
        )}
      </div>
    </nav>
  );
}