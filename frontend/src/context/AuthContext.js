import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { loginToBackend, loginByApiId } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [applicantId, setApplicantId] = useState(
    localStorage.getItem("jp_applicant_id") || null
  );
  const [loading, setLoading] = useState(true);
  // tokenReady = true once jp_token is confirmed to exist in localStorage
  // Components that call protected routes should wait for this before firing
  const [tokenReady, setTokenReady] = useState(
    () => !!localStorage.getItem("jp_token")
  );

  const hasCalledBackend = useRef(false); // 🔥 IMPORTANT

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const existingToken = localStorage.getItem("jp_token");

        if (existingToken) {
          // Token already present from a previous session — mark ready immediately
          setTokenReady(true);
        } else if (!hasCalledBackend.current) {
          // ✅ Prevent duplicate calls
          hasCalledBackend.current = true;

          try {
            const data = await loginToBackend(
              user.uid,
              user.email,
              user.displayName || ""
            );

            if (data.success) {
              localStorage.setItem("jp_token", data.token);
              localStorage.setItem("jp_applicant_id", data.applicant_id);
              setApplicantId(data.applicant_id);
              setTokenReady(true); // ✅ Signal that token is now available

              console.log("✅ Backend login:", data.applicant_id);
            }
          } catch (err) {
            console.error("❌ Backend login failed:", err.message);
          }
        }
      } else {
        localStorage.removeItem("jp_token");
        localStorage.removeItem("jp_applicant_id");
        setApplicantId(null);
        setCurrentUser(null);
        setTokenReady(false);

        hasCalledBackend.current = false; // reset
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // API ID + password login — bypasses Firebase on the frontend entirely.
  // The backend verifies the password against Firebase REST API and returns a JWT.
  const loginWithApiId = async (applicant_id, password) => {
    const data = await loginByApiId(applicant_id, password);
    if (data.success) {
      localStorage.setItem("jp_token", data.token);
      localStorage.setItem("jp_applicant_id", data.applicant_id);
      setApplicantId(data.applicant_id);
      setTokenReady(true);
      // Note: currentUser stays null (no Firebase session) — that's intentional.
      // All protected routes use jp_token, not Firebase currentUser.
    }
    return data;
  };

  const logout = async () => {
    await signOut(auth);

    localStorage.removeItem("jp_token");
    localStorage.removeItem("jp_applicant_id");

    setApplicantId(null);
    setCurrentUser(null);
    setTokenReady(false);
    hasCalledBackend.current = false; // reset
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        color: "#1a237e",
        fontSize: "1.1rem",
        background: "#f0f4f8"
      }}>
        <div>
          <div style={{ textAlign: "center", fontSize: "2rem" }}>🎓</div>
          <div style={{ marginTop: "10px" }}>Loading ApplyPortal...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, applicantId, tokenReady, logout, loginWithApiId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}