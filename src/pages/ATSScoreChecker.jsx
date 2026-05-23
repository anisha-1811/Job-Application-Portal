// src/pages/ATSScoreChecker.jsx
import React, { useState, useRef } from "react";
import { useATSScore } from "../hooks/useAI";
import ATSScoreResult from "../components/ats/ATSScoreResult";

// ── Sub-components ────────────────────────────────────────────────────────────

function FileDropZone({ file, onFileChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") onFileChange(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileChange(selected);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? "#6366f1" : file ? "#10b981" : "#d1d5db"}`,
        borderRadius: 12,
        padding: "32px 20px",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "#eef2ff" : file ? "#f0fdf4" : "#fafafa",
        transition: "all 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div style={{ fontSize: 36, marginBottom: 8 }}>{file ? "✅" : "📄"}</div>
      {file ? (
        <>
          <p style={{ margin: 0, fontWeight: 700, color: "#065f46", fontSize: 15 }}>
            {file.name}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
            {(file.size / 1024).toFixed(1)} KB · Click to change
          </p>
        </>
      ) : (
        <>
          <p style={{ margin: 0, fontWeight: 600, color: "#374151", fontSize: 15 }}>
            Drop your resume PDF here
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>
            or click to browse · Max 5 MB · Text-based PDFs only
          </p>
        </>
      )}
    </div>
  );
}

// ── Tips sidebar ──────────────────────────────────────────────────────────────

function TipCard({ icon, title, body }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 12,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#111827" }}>{title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{body}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ATSScoreChecker() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const { loading, error, atsData, analyze, reset } = useATSScore();

  const canSubmit = resumeFile && jobDescription.trim().length >= 50 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    await analyze(resumeFile, jobDescription, jobTitle);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("ats-results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setJobTitle("");
    reset();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Page Header ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#eef2ff", color: "#4f46e5", borderRadius: 99,
            padding: "6px 16px", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", marginBottom: 16,
          }}>
            ✨ AI-Powered
          </div>
          <h1 style={{
            margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800, color: "#111827",
          }}>
            ATS Resume Checker
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 16, maxWidth: 500, marginInline: "auto" }}>
            Upload your resume and paste a job description. Our AI analyzes keyword alignment,
            gaps, and gives you an ATS compatibility score.
          </p>
        </div>

        {/* ── Main layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>

          {/* ── Left: Form + Results ── */}
          <div>
            {/* Form card */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: 28,
              boxShadow: "0 2px 12px rgba(0,0,0,.07)", marginBottom: 24,
            }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, color: "#111827" }}>
                📋 Upload & Analyze
              </h2>

              <form onSubmit={handleSubmit}>
                {/* File upload */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Resume PDF <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <FileDropZone file={resumeFile} onFileChange={setResumeFile} />
                </div>

                {/* Job Title */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Job Title <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* JD Textarea */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Job Description <span style={{ color: "#ef4444" }}>*</span>
                    <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 8 }}>
                      ({jobDescription.trim().length} chars — min 50)
                    </span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here. Include responsibilities, requirements, and skills — the more detail, the better the analysis."
                    rows={10}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 10,
                      border: "1.5px solid #e5e7eb", fontSize: 14,
                      resize: "vertical", outline: "none", lineHeight: 1.6,
                      boxSizing: "border-box", fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    background: "#fee2e2", color: "#991b1b", borderRadius: 10,
                    padding: "12px 16px", fontSize: 13, marginBottom: 16,
                    border: "1px solid #fca5a5",
                  }}>
                    ❌ {error}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    style={{
                      flex: 1, padding: "12px 24px", borderRadius: 10, border: "none",
                      background: canSubmit ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#e5e7eb",
                      color: canSubmit ? "#fff" : "#9ca3af",
                      fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    {loading ? "🔍 Analyzing..." : "✨ Analyze My Resume"}
                  </button>

                  {(atsData || error) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      style={{
                        padding: "12px 20px", borderRadius: 10,
                        border: "1.5px solid #e5e7eb", background: "#fff",
                        color: "#374151", fontSize: 14, fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{
                background: "#fff", borderRadius: 20, padding: 40,
                boxShadow: "0 2px 12px rgba(0,0,0,.07)", textAlign: "center",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  border: "4px solid #e5e7eb", borderTopColor: "#6366f1",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }} />
                <p style={{ margin: 0, color: "#374151", fontWeight: 600 }}>
                  Analyzing resume against job description...
                </p>
                <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: 13 }}>
                  Gemini AI is reading keywords, experience, and skills
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Results */}
            {atsData && !loading && (
              <div id="ats-results">
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 16,
                }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827" }}>
                    📊 Analysis Results
                  </h2>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "8px 16px", borderRadius: 8,
                      border: "1.5px solid #e5e7eb", background: "#fff",
                      fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer",
                    }}
                  >
                    🖨️ Print Report
                  </button>
                </div>
                <ATSScoreResult data={atsData} />
              </div>
            )}
          </div>

          {/* ── Right: Tips ── */}
          <div style={{ position: "sticky", top: 24 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#374151" }}>
              💡 ATS Tips
            </h3>
            <TipCard
              icon="🎯"
              title="Mirror the JD"
              body="Use the exact keywords from the job description. ATS systems match strings literally."
            />
            <TipCard
              icon="📝"
              title="Simple formatting"
              body="Avoid tables, text boxes, and columns. ATS parsers read left-to-right, single column."
            />
            <TipCard
              icon="📊"
              title="Quantify impact"
              body="Replace 'managed projects' with 'managed 5 projects, reducing delivery time by 20%'."
            />
            <TipCard
              icon="🔑"
              title="Skills section"
              body="Have an explicit Skills section. List both full names and acronyms (e.g. React.js / React)."
            />
            <TipCard
              icon="📄"
              title="Text-based PDF"
              body="Export from Word or Google Docs. Scanned PDFs have no parsable text and score 0."
            />
            <TipCard
              icon="⚡"
              title="Aim for 75+"
              body="A score above 75 significantly improves your chances of passing automated screening."
            />
          </div>
        </div>
      </div>
    </div>
  );
}