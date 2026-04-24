import React, { useState } from "react";
import "../shared/StepForm.css";
import "./Step2Education.css";

const DEGREE_OPTIONS = [
  "", "Diploma", "B.Tech", "B.E.", "B.Sc", "B.Com",
  "B.A.", "BCA", "BBA", "M.Tech", "M.E.", "M.Sc",
  "MBA", "MCA", "M.A.", "M.Com", "Ph.D", "Other"
];

// Minimum expected duration (years) for each degree type
const DEGREE_MIN_YEARS = {
  "Diploma":  2,
  "B.Tech":   4, "B.E.": 4, "B.Sc": 3, "B.Com": 3,
  "B.A.":     3, "BCA":  3, "BBA":  3,
  "M.Tech":   2, "M.E.": 2, "M.Sc": 2, "MBA":   2,
  "MCA":      3, "M.A.": 2, "M.Com": 2,
  "Ph.D":     3,
  "Other":    1
};

const emptyDegree = () => ({
  id:          Date.now() + Math.random(),
  degree:      "",
  branch:      "",
  institution: "",
  cgpa:        "",
  passingYear: "",
  gapReason:   "",   // filled only if gap is flagged
});

// Returns a warning string or "" if everything looks fine
function getYearWarning(degrees, index) {
  const cur = degrees[index];
  if (!cur.degree || !cur.passingYear) return "";

  const curYear = parseInt(cur.passingYear, 10);
  if (isNaN(curYear)) return "";

  // Check against PREVIOUS degree
  if (index > 0) {
    const prev = degrees[index - 1];
    if (!prev.passingYear) return "";
    const prevYear = parseInt(prev.passingYear, 10);
    if (isNaN(prevYear)) return "";

    const gap = curYear - prevYear;
    const minExpected = DEGREE_MIN_YEARS[cur.degree] || 1;

    if (gap < 0) {
      return `⚠️ Passing year (${curYear}) is before your previous degree (${prevYear}). Please check.`;
    }
    if (gap < minExpected) {
      return `⚠️ Only ${gap} year(s) gap between degrees. A ${cur.degree} typically takes ${minExpected} year(s). Please explain below.`;
    }
    if (gap > minExpected + 4) {
      return `⚠️ ${gap - minExpected} extra year(s) beyond expected duration. If there was a gap year, career break, or backlog, please explain below.`;
    }
  }

  // Check against Class 12 passing year
  const twYear = parseInt(degrees._twelthYear, 10);
  if (!isNaN(twYear) && index === 0) {
    const gap = curYear - twYear;
    const minExpected = DEGREE_MIN_YEARS[cur.degree] || 1;

    if (gap < 0) {
      return `⚠️ Degree passing year (${curYear}) is before your Class XII year (${twYear}).`;
    }
    if (gap < minExpected) {
      return `⚠️ Only ${gap} year(s) after Class XII. A ${cur.degree} typically needs ${minExpected} year(s). Please explain below.`;
    }
    if (gap > minExpected + 4) {
      return `⚠️ ${gap - minExpected} extra year(s) beyond expected. Please explain any gap year or break below.`;
    }
  }

  return "";
}

export default function Step2Education({ data, update, onNext, onBack }) {

  const [degrees, setDegrees] = useState(
    data.degrees && data.degrees.length > 0
      ? data.degrees
      : [emptyDegree()]
  );

  // sync Class XII / X fields normally
  const handle = (e) => update({ [e.target.name]: e.target.value });

  const handleDegreeChange = (id, field, value) => {
    const updated = degrees.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    );
    setDegrees(updated);
    update({ degrees: updated });
  };

  const addDegree = () => {
    if (degrees.length >= 3) return;
    const updated = [...degrees, emptyDegree()];
    setDegrees(updated);
    update({ degrees: updated });
  };

  const removeDegree = (id) => {
    if (degrees.length === 1) return;
    const updated = degrees.filter(d => d.id !== id);
    setDegrees(updated);
    update({ degrees: updated });
  };

  // Attach Class XII year to degrees array so warning fn can access it
  const degreesWithRef = Object.assign([...degrees], {
    _twelthYear: data.twelthYear || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate each degree card
    for (let i = 0; i < degrees.length; i++) {
      const d = degrees[i];
      if (!d.degree || !d.branch || !d.institution || !d.cgpa || !d.passingYear) {
        alert(`Please fill all required fields for Degree ${i + 1}.`);
        return;
      }
      // If a warning exists AND no gap reason given — block submission
      const warning = getYearWarning(degreesWithRef, i);
      if (warning && !d.gapReason.trim()) {
        alert(`Degree ${i + 1}: A year gap was detected. Please fill in the reason for the gap before proceeding.`);
        return;
      }
    }

    // Class X / XII validation
    if (!data.twelthBoard || !data.twelthMarks || !data.twelthYear) {
      alert("Please fill all Class XII fields."); return;
    }
    if (!data.tenthBoard || !data.tenthMarks || !data.tenthYear) {
      alert("Please fill all Class X fields."); return;
    }

    update({ degrees });
    onNext();
  };

  const CARD_COLORS = ["#1a237e", "#15803d", "#9a3412"];
  const CARD_BG     = ["#eef2ff", "#f0fdf4", "#fff7ed"];
  const CARD_LABELS = ["Primary Degree", "Second Degree", "Third Degree"];

  return (
    <form onSubmit={handleSubmit} className="step-form">

      <h2>Step 2: Educational Qualifications</h2>
      <p className="step-desc">
        Add all your degrees in chronological order (oldest first).
        You can add up to <strong>3 degrees</strong>.
        Class X and XII are separate below.
      </p>

      {/* ── Degree Cards ── */}
      <div className="edu-degrees-wrapper">
        {degrees.map((deg, index) => {
          const warning = getYearWarning(degreesWithRef, index);
          const needsReason = !!warning;

          return (
            <div
              key={deg.id}
              className={`edu-degree-card ${needsReason ? "edu-card-flagged" : ""}`}
              style={{ borderColor: CARD_COLORS[index] }}
            >
              {/* Header */}
              <div className="edu-card-header" style={{ background: CARD_COLORS[index] }}>
                <div className="edu-card-title">
                  <span className="edu-card-num">{index + 1}</span>
                  <span>{CARD_LABELS[index]}</span>
                </div>
                {degrees.length > 1 && (
                  <button
                    type="button"
                    className="edu-remove-btn"
                    onClick={() => removeDegree(deg.id)}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="edu-card-body" style={{ background: CARD_BG[index] }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree *</label>
                    <select
                      value={deg.degree}
                      onChange={e => handleDegreeChange(deg.id, "degree", e.target.value)}
                      required
                    >
                      <option value="">Select Degree</option>
                      {DEGREE_OPTIONS.filter(Boolean).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Branch / Specialization *</label>
                    <input
                      value={deg.branch}
                      onChange={e => handleDegreeChange(deg.id, "branch", e.target.value)}
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Institution / University Name *</label>
                  <input
                    value={deg.institution}
                    onChange={e => handleDegreeChange(deg.id, "institution", e.target.value)}
                    placeholder="Full name of university or college"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CGPA / Percentage *</label>
                    <input
                      value={deg.cgpa}
                      onChange={e => handleDegreeChange(deg.id, "cgpa", e.target.value)}
                      placeholder="e.g. 8.5 / 10 or 85%"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Passing Year *</label>
                    <input
                      type="number"
                      value={deg.passingYear}
                      onChange={e => handleDegreeChange(deg.id, "passingYear", e.target.value)}
                      placeholder="e.g. 2025"
                      min="2000"
                      max="2035"
                      required
                    />
                  </div>
                </div>

                {/* ── Year gap warning + reason box ── */}
                {needsReason && (
                  <div className="edu-gap-block">
                    <div className="edu-gap-warning">
                      {warning}
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="edu-gap-label">
                        Reason for Gap / Delay *
                        <span className="edu-gap-required">
                          Required to proceed
                        </span>
                      </label>
                      <textarea
                        value={deg.gapReason}
                        onChange={e => handleDegreeChange(deg.id, "gapReason", e.target.value)}
                        placeholder={
                          deg.passingYear && parseInt(deg.passingYear) < (
                            index > 0
                              ? parseInt(degrees[index - 1]?.passingYear || 0)
                              : parseInt(data.twelthYear || 0)
                          )
                            ? "e.g. I completed Class XII in a different year due to medical reasons..."
                            : "e.g. I took a gap year to prepare for entrance exams / worked at a company / had health issues / appeared for competitive exams multiple times..."
                        }
                        rows={3}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 13px",
                          border: "2px solid #f59e0b",
                          borderRadius: "10px",
                          fontSize: "0.9rem",
                          fontFamily: "inherit",
                          resize: "vertical",
                          outline: "none",
                          background: "white",
                          boxSizing: "border-box"
                        }}
                        onFocus={e => e.target.style.borderColor = "#d97706"}
                        onBlur={e => e.target.style.borderColor = "#f59e0b"}
                      />
                      <span className="form-hint">
                        💡 This information is kept confidential and only used for verification.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add degree button */}
        {degrees.length < 3 && (
          <button
            type="button"
            className="edu-add-btn"
            onClick={addDegree}
          >
            <span className="edu-add-icon">＋</span>
            Add Another Degree
            <span className="edu-add-hint">
              {3 - degrees.length} more allowed
            </span>
          </button>
        )}

        {degrees.length === 3 && (
          <div className="edu-max-notice">
            ✓ Maximum 3 degrees added
          </div>
        )}
      </div>

      {/* ── Class XII ── */}
      <div className="section-heading">Class XII — Higher Secondary</div>
      <div className="form-row">
        <div className="form-group">
          <label>Board *</label>
          <input
            name="twelthBoard"
            value={data.twelthBoard || ""}
            onChange={handle}
            placeholder="CBSE / ICSE / State Board"
            required
          />
        </div>
        <div className="form-group">
          <label>Marks / Percentage *</label>
          <input
            name="twelthMarks"
            value={data.twelthMarks || ""}
            onChange={handle}
            placeholder="e.g. 92%"
            required
          />
        </div>
        <div className="form-group">
          <label>Passing Year *</label>
          <input
            type="number"
            name="twelthYear"
            value={data.twelthYear || ""}
            onChange={handle}
            placeholder="e.g. 2021"
            min="2000"
            max="2030"
            required
          />
        </div>
      </div>

      {/* ── Class X ── */}
      <div className="section-heading">Class X — Secondary</div>
      <div className="form-row">
        <div className="form-group">
          <label>Board *</label>
          <input
            name="tenthBoard"
            value={data.tenthBoard || ""}
            onChange={handle}
            placeholder="CBSE / ICSE / State Board"
            required
          />
        </div>
        <div className="form-group">
          <label>Marks / Percentage *</label>
          <input
            name="tenthMarks"
            value={data.tenthMarks || ""}
            onChange={handle}
            placeholder="e.g. 95%"
            required
          />
        </div>
        <div className="form-group">
          <label>Passing Year *</label>
          <input
            type="number"
            name="tenthYear"
            value={data.tenthYear || ""}
            onChange={handle}
            placeholder="e.g. 2019"
            min="2000"
            max="2030"
            required
          />
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="step-buttons">
        <button type="button" onClick={onBack} className="btn-back">
          ← Back
        </button>
        <button type="submit" className="btn-next">
          Next: Experience →
        </button>
      </div>
    </form>
  );
}