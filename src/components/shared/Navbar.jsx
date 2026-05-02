import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
            <div className="user-pill">
              <span className="user-dot"></span>
              👤 {currentUser.displayName || currentUser.email}
            </div>

            <button
              onClick={() => navigate("/my-application")}
              className="navbar-primary"
            >
              📊 My Application
            </button>

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