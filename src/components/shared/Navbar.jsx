import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  let currentUser = null;
  let logout = () => {};

  try {
    const auth = useAuth();
    currentUser = auth?.currentUser;
    logout = auth?.logout || logout;
  } catch (e) {
    console.log("Auth not ready yet");
  }

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
              onClick={() => {
                logout();
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