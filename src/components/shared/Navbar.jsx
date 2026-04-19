import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // ✅ Correct: Hook used at top level
  const { currentUser, logout } = useAuth();

  return (
    <nav className="app-navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        🎓 ApplyPortal
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <>
            <div className="user-pill">
              <span className="user-dot"></span>
              {currentUser.displayName || currentUser.email}
            </div>

            <button
              onClick={async () => {
                await logout();   // 🔥 better to await logout
                navigate("/");
              }}
              className="navbar-logout"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}