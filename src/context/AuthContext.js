import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { loginToBackend } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [applicantId, setApplicantId] = useState(
    localStorage.getItem("jp_applicant_id") || null
  );
  const [loading, setLoading] = useState(true);

  const hasCalledBackend = useRef(false); // 🔥 IMPORTANT

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const existingToken = localStorage.getItem("jp_token");

        // ✅ Prevent duplicate calls
        if (!existingToken && !hasCalledBackend.current) {
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

        hasCalledBackend.current = false; // reset
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);

    localStorage.removeItem("jp_token");
    localStorage.removeItem("jp_applicant_id");

    setApplicantId(null);
    setCurrentUser(null);
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
    <AuthContext.Provider value={{ currentUser, applicantId, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}