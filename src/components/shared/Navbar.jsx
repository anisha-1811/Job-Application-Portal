import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    background: isActive(path) ? "rgba(99,102,241,0.12)" : "transparent",
    color: isActive(path) ? "#6366f1" : "#374151",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: isActive(path) ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  });

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
            {/* ── AI Feature Links ── */}
            <button
              style={navLinkStyle("/resume-generator")}
              onClick={() => navigate("/resume-generator")}
            >
              📄 Resume AI
            </button>

            <button
              style={navLinkStyle("/ats-checker")}
              onClick={() => navigate("/ats-checker")}
            >
              🎯 ATS Checker
            </button>

            <button
              onClick={() => navigate("/my-application")}
              className="navbar-primary"
            >
              📊 My Application
            </button>

            <div className="user-pill">
              <span className="user-dot"></span>
              👤 {currentUser.displayName || currentUser.email}
            </div>

            <button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="navbar-logout"
            >
              🚪 Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="navbar-outline"
            >
              🔐 Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="navbar-primary"
            >
              🚀 Apply Now
            </button>
          </>
        )}
      </div>
    </nav>
  );
}