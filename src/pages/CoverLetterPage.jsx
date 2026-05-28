// src/pages/CoverLetterPage.jsx — Phase 6: AI Cover Letter Generator
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getApplication } from "../services/api";
import { generateCoverLetter } from "../services/ai";
import Navbar from "../components/shared/Navbar";

const TONES = [
  { id: "professional", label: "Professional",  icon: "👔", desc: "Formal & authoritative" },
  { id: "friendly",     label: "Friendly",       icon: "😊", desc: "Warm & personable"     },
  { id: "enthusiastic", label: "Enthusiastic",   icon: "🔥", desc: "Energetic & passionate" },
];

function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
  background: "#fff", color: "#111827",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

export default function CoverLetterPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    title: "", company: "", hiringManager: "", description: "", tone: "professional",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    getApplication()
      .then(r => r.success && setProfile(r.data))
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    if (!form.title || !form.company) {
      setError("Job title and company name are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await generateCoverLetter(
        profile || {},
        { title: form.title, company: form.company, hiringManager: form.hiringManager, description: form.description },
        form.tone
      );
      if (res.success) {
        setResult(res.data);
        setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
      } else {
        setError(res.error || "Generation failed.");
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fullLetter = result
    ? [result.salutation, "", ...result.paragraphs, "", result.closing].join("\n")
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullLetter], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cover-letter-${form.company.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "32px 24px",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
        transition: "all 0.5s ease",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10, padding: 0 }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #ec4899, #f43f5e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>✉️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>
                AI Cover Letter Generator
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                Tailored cover letters powered by Gemini AI — ready in seconds.
              </p>
            </div>
          </div>
        </div>

        {!profile && (
          <div style={{
            background: "#fef3c7", border: "1.5px solid #fbbf24", borderRadius: 12,
            padding: "12px 18px", fontSize: 13, color: "#92400e", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            ⚠️ Complete your <button onClick={() => navigate("/apply")} style={{ background:"none",border:"none",color:"#1a237e",fontWeight:700,cursor:"pointer",padding:0 }}>profile</button> first for a personalised letter. You can still generate a generic one below.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "600px 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Form Panel ── */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f3f4f6" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 22 }}>
              📋 Job Details
            </div>

            <Field label="Job Title" required>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g. Frontend Developer"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#ec4899"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </Field>

            <Field label="Company Name" required>
              <input value={form.company} onChange={e => set("company", e.target.value)}
                placeholder="e.g. Google"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#ec4899"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </Field>

            <Field label="Hiring Manager Name" hint="Leave blank to use 'Hiring Manager'">
              <input value={form.hiringManager} onChange={e => set("hiringManager", e.target.value)}
                placeholder="e.g. Sarah Johnson (optional)"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#ec4899"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </Field>

            <Field label="Job Description" hint="Paste the full JD for a more targeted letter">
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Paste the job description here…"
                rows={6}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#ec4899"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </Field>

            {/* Tone Selector */}
            <Field label="Letter Tone">
              <div style={{ display: "flex", gap: 10 }}>
                {TONES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => set("tone", t.id)}
                    style={{
                      flex: 1, borderRadius: 12, padding: "12px 8px", textAlign: "center",
                      border: `2px solid ${form.tone === t.id ? "#ec4899" : "#e5e7eb"}`,
                      background: form.tone === t.id ? "#fdf2f8" : "#fff",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: form.tone === t.id ? "#ec4899" : "#374151" }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </Field>

            {error && (
              <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: "100%", padding: "14px 0",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #ec4899, #f43f5e)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "✨ Generating your letter…" : "✉️ Generate Cover Letter"}
            </button>
          </div>

          {/* ── Preview Panel ── */}
          {result ? (
            <div ref={previewRef} style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>📄 Your Cover Letter</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleCopy}
                    style={{
                      padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb",
                      background: copied ? "#d1fae5" : "#fff", cursor: "pointer",
                      fontSize: 12, fontWeight: 700, color: copied ? "#10b981" : "#374151",
                    }}>
                    {copied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button onClick={handleDownload}
                    style={{
                      padding: "8px 14px", borderRadius: 8, border: "none",
                      background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                      cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#fff",
                    }}>
                    ⬇ Download
                  </button>
                </div>
              </div>

              {/* Letter content */}
              <div style={{
                background: "#fafafa", borderRadius: 12, padding: 24,
                border: "1px solid #e5e7eb", lineHeight: 1.8,
              }}>
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 14, fontWeight: 600 }}>
                  Subject: {result.subject}
                </div>
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
                  <p style={{ margin: "0 0 16px", fontSize: 13, color: "#374151" }}>{result.salutation}</p>
                  {result.paragraphs?.map((p, i) => (
                    <p key={i} style={{ margin: "0 0 14px", fontSize: 13, color: "#374151", lineHeight: 1.75 }}>{p}</p>
                  ))}
                  <p style={{ margin: 0, fontSize: 13, color: "#374151", whiteSpace: "pre-line" }}>{result.closing}</p>
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  background: "#ede9fe", borderRadius: 8, padding: "6px 12px",
                  fontSize: 12, color: "#6366f1", fontWeight: 700,
                }}>
                  ~{result.wordCount || fullLetter.split(/\s+/).length} words
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Tone: {TONES.find(t => t.id === form.tone)?.label}
                </div>
                <button
                  onClick={handleGenerate}
                  style={{
                    marginLeft: "auto", background: "none", border: "1.5px solid #ec4899",
                    color: "#ec4899", borderRadius: 8, padding: "6px 14px",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>
                  ↻ Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: "linear-gradient(135deg, #fdf2f8, #fff)",
              borderRadius: 20, padding: 40, textAlign: "center",
              border: "2px dashed #f9a8d4",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 300,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                Your cover letter will appear here
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", maxWidth: 260, lineHeight: 1.6 }}>
                Fill in the job details on the left and click Generate to create your personalised letter.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}