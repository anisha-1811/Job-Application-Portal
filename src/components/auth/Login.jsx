import React, { useState } from "react";
import { auth, googleProvider } from "../../firebase/config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const TAB_EMAIL  = "email";
const TAB_APIID  = "apiid";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithApiId } = useAuth();

  const [tab,      setTab]      = useState(TAB_EMAIL);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // Email tab
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // API ID tab
  const [apiId,    setApiId]    = useState("");
  const [apiPass,  setApiPass]  = useState("");

  const clearError = () => setError("");

  // ── Email + Password ────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError(""); setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
    setLoading(false);
  };

  // ── API ID + Password ───────────────────────────────────────────────────────
  const handleApiIdLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await loginWithApiId(apiId.trim().toUpperCase(), apiPass);
      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid API ID or password.");
      }
    } catch (err) {
      setError("Invalid API ID or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">🎓</div>
          <h1>Career Portal</h1>
          <p>Career &amp; Internship Applications</p>
        </div>

        <h2>Sign In to Your Account</h2>

        {/* ── Tab switcher ── */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 24,
          border: "1.5px solid #e5e7eb", borderRadius: 10, overflow: "hidden",
        }}>
          {[
            { key: TAB_EMAIL, label: "📧 Email" },
            { key: TAB_APIID, label: "🔑 API ID" },
          ].map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => { setTab(t.key); clearError(); }}
              style={{
                flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", transition: "all 0.15s",
                background: tab === t.key ? "#1a237e" : "#fff",
                color:      tab === t.key ? "#fff"    : "#6b7280",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <div className="error-box">{error}</div>}

        {/* ── Email tab ── */}
        {tab === TAB_EMAIL && (
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        {/* ── API ID tab ── */}
        {tab === TAB_APIID && (
          <form onSubmit={handleApiIdLogin}>
            <div className="form-group">
              <label>Your API ID</label>
              <input
                type="text"
                placeholder="e.g. APP1A2B3C4D5E"
                value={apiId}
                onChange={e => setApiId(e.target.value)}
                required
                style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
              />
              <small style={{ color: "#6b7280", marginTop: 4, display: "block" }}>
                Your unique API ID was shown after registration. Check your dashboard if you're unsure.
              </small>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" placeholder="Your account password"
                value={apiPass} onChange={e => setApiPass(e.target.value)} required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying…" : "Sign In with API ID"}
            </button>
          </form>
        )}

        <div className="divider">or</div>

        <button onClick={handleGoogleLogin} className="btn-google" disabled={loading}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className="auth-footer">
          New user? <Link to="/register">Create an account</Link>
        </div>

      </div>
    </div>
  );
}