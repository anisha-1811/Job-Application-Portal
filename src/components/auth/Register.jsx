import React, { useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function ApiIdModal({ apiId, onContinue }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(apiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
      padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "36px 32px",
        maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
          Account Created!
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
          This is your unique <strong>API ID</strong>. You can use it along with your password to log in anytime — even without your email.
        </p>

        <div style={{
          background: "#f0f4ff", border: "2px dashed #6366f1",
          borderRadius: 12, padding: "16px 20px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Your API ID
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1a237e", fontFamily: "monospace", letterSpacing: "0.06em" }}>
            {apiId}
          </div>
        </div>

        <div style={{
          background: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 10,
          padding: "10px 14px", marginBottom: 24, fontSize: 13, color: "#92400e", fontWeight: 600,
        }}>
          ⚠️ Save this ID somewhere safe — you'll need it to log in using the API ID option.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={copy} style={{
            flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 14, fontWeight: 600,
            border: "1.5px solid #6366f1", background: "#fff", color: "#6366f1", cursor: "pointer",
          }}>
            {copied ? "✅ Copied!" : "📋 Copy ID"}
          </button>
          <button onClick={onContinue} style={{
            flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 14, fontWeight: 700,
            border: "none", background: "linear-gradient(135deg, #1a237e, #3949ab)",
            color: "#fff", cursor: "pointer",
          }}>
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [newApiId, setNewApiId] = useState(null); // shown in modal after registration

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(user, { displayName: form.name });

      // Grab the API ID that AuthContext stores after onAuthStateChanged fires
      // Give it a moment to write to localStorage
      await new Promise(r => setTimeout(r, 1200));
      const storedId = localStorage.getItem("jp_applicant_id");
      if (storedId) {
        setNewApiId(storedId);  // show modal — user clicks Continue to navigate
      } else {
        navigate("/dashboard"); // fallback if something was slow
      }

    } catch (err) {
      console.error("Register Error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Registration failed. Try again.");
      }
    }

    setLoading(false);
  };

  if (newApiId) {
    return <ApiIdModal apiId={newApiId} onContinue={() => navigate("/dashboard")} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">🎓</div>
          <h1>Career Portal</h1>
          <p>Create your account to apply</p>
        </div>

        <h2>Create Account</h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}