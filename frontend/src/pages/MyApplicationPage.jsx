import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplication } from "../services/api";
import Navbar from "../components/shared/Navbar";
import "./MyApplicationPage.css";

export default function MyApplicationPage() {
  const navigate = useNavigate();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const token = localStorage.getItem("jp_token");
        if (!token) { navigate("/login"); return; }
        const result = await getApplication();
        if (result.success && result.data?.application_code) {
          setAppData(result.data);
        } else {
          navigate("/apply");
        }
      } catch (err) {
        navigate("/apply");
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [navigate]);

  if (loading) {
    return (
      <div className="myapp-loading">
        <div className="myapp-spinner"></div>
        <p>Loading your application...</p>
      </div>
    );
  }

  if (!appData) return null;

  const STATUS_COLORS = {
    submitted:    { bg: "#dbeafe", color: "#1d4ed8", label: "Submitted" },
    under_review: { bg: "#fef9c3", color: "#854d0e", label: "Under Review" },
    shortlisted:  { bg: "#dcfce7", color: "#166534", label: "Shortlisted" },
    rejected:     { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
    selected:     { bg: "#f0fdf4", color: "#15803d", label: "Selected 🎉" },
  };
  const st = STATUS_COLORS[appData.final_status] || STATUS_COLORS.submitted;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const dash = (v) => v || "—";

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    } catch { return iso; }
  };

  // ── Build sections ──────────────────────────────────────────────────────────

  const personalRows = [
    ["Full Name",    dash(`${appData.first_name || ""} ${appData.last_name || ""}`.trim())],
    ["Date of Birth", fmtDate(appData.date_of_birth)],
    ["Gender",       dash(appData.gender)],
    ["Phone",        dash(appData.phone)],
    ["Address",      [appData.address, appData.city, appData.state, appData.pincode].filter(Boolean).join(", ") || "—"],
    ["Nationality",  dash(appData.nationality)],
  ];

  const schoolRows = [
    ["Class XII", `${dash(appData.twelfth_board)} — ${dash(appData.twelfth_marks)} (${dash(appData.twelfth_year)})`],
    ["Class X",   `${dash(appData.tenth_board)}   — ${dash(appData.tenth_marks)}   (${dash(appData.tenth_year)})`],
  ];

  const degreeRows = Array.isArray(appData.degrees) && appData.degrees.length > 0
    ? appData.degrees.map((d, i) => [
        `Degree ${i + 1}`,
        `${dash(d.degree)} in ${dash(d.branch)} — ${dash(d.institution)} | CGPA: ${dash(d.cgpa)} | Year: ${dash(d.passingYear)}`,
      ])
    : [["Degrees", "—"]];

  const skillsRows = [[
    "Technical Skills",
    Array.isArray(appData.skillsList) && appData.skillsList.length > 0
      ? appData.skillsList.join(", ")
      : "—",
  ]];

  const expRows = Array.isArray(appData.experiences) && appData.experiences.length > 0
    ? appData.experiences.map((e, i) => [
        `Experience ${i + 1}`,
        [
          `${dash(e.company || e.company_name)} — ${dash(e.role)}`,
          `${e.start_date || e.startDate || ""} to ${e.currently_working || e.currentlyWorking ? "Present" : (e.end_date || e.endDate || "")}`,
          e.description || e.skills_learned ? `${e.description || ""} ${e.skills_learned ? "| Skills: " + e.skills_learned : ""}`.trim() : "",
        ].filter(Boolean).join("\n"),
      ])
    : [["Work Experience", "Fresher / Not added"]];

  const internRows = Array.isArray(appData.internshipsList) && appData.internshipsList.length > 0
    ? appData.internshipsList.map((i, idx) => [
        `Internship ${idx + 1}`,
        [
          `${dash(i.organisation || i.company)} — ${dash(i.role)}`,
          `${i.start_date || i.startDate || ""} to ${i.currently_interning || i.currentlyWorking ? "Present" : (i.end_date || i.endDate || "")}`,
          i.description || "",
        ].filter(Boolean).join("\n"),
      ])
    : [["Internships", "—"]];

  const projectRows = Array.isArray(appData.projectsList) && appData.projectsList.length > 0
    ? appData.projectsList.map((p, i) => [
        `Project ${i + 1}`,
        [
          dash(p.title),
          p.description || "",
          p.tech_skills || p.techSkills ? `Tech: ${p.tech_skills || p.techSkills}` : "",
          p.project_url || p.url ? `URL: ${p.project_url || p.url}` : "",
          p.is_ongoing || p.ongoing ? "(Ongoing)" : "",
        ].filter(Boolean).join("\n"),
      ])
    : [["Projects", "—"]];

  const certRows = Array.isArray(appData.certsList) && appData.certsList.length > 0
    ? appData.certsList.map((c, i) => [
        `Certificate ${i + 1}`,
        `${dash(c.cert_name || c.name)} — ${dash(c.issuing_org || c.issuer)}${c.date_issued || c.date ? " (" + (c.date_issued || c.date) + ")" : ""}${c.credential_url || c.credentialUrl ? " | " + (c.credential_url || c.credentialUrl) : ""}`,
      ])
    : [["Certifications", "—"]];

  const linkRows = Array.isArray(appData.profileLinks) && appData.profileLinks.length > 0
    ? appData.profileLinks.map((l, i) => [
        l.platform_name || l.label || `Link ${i + 1}`,
        l.profile_url || l.url || "—",
      ])
    : [["Profile Links", "—"]];

  const docRows = [
    ["Resume",   dash(appData.resume_filename)],
    ["Photo",    dash(appData.photo_filename)],
    ["ID Proof", dash(appData.id_proof_filename)],
  ];

  const sections = [
    { title: "👤 Personal Information",     rows: personalRows },
    { title: "🏫 School Records",            rows: schoolRows   },
    { title: "🎓 Degrees",                   rows: degreeRows   },
    { title: "⚡ Skills",                    rows: skillsRows   },
    { title: "💼 Work Experience",           rows: expRows      },
    { title: "🏢 Internships",               rows: internRows   },
    { title: "🚀 Projects",                  rows: projectRows  },
    { title: "🏆 Certifications",            rows: certRows     },
    { title: "🔗 Profile Links",             rows: linkRows     },
    { title: "📎 Documents",                 rows: docRows      },
  ];

  return (
    <>
      <Navbar />
      <div className="myapp-page">

        <div className="myapp-header">
          <h1>My Application</h1>
          <p>Your submitted application details are shown below.</p>
        </div>

        {/* Status card */}
        <div className="myapp-status-card">
          <div className="myapp-status-left">
            <div className="myapp-app-id">
              <span className="myapp-app-id-label">Application ID</span>
              <span className="myapp-app-id-value">{appData.application_code}</span>
            </div>
            <div className="myapp-email">📧 {appData.email}</div>
            <div className="myapp-date">
              🕐 Submitted:{" "}
              {appData.submitted_at ? new Date(appData.submitted_at).toLocaleString() : "—"}
            </div>
          </div>
          <div className="myapp-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </div>
        </div>

        {/* All sections */}
        {sections.map(sec => (
          <div className="myapp-section" key={sec.title}>
            <div className="myapp-section-title">{sec.title}</div>
            <table className="myapp-table">
              <tbody>
                {sec.rows.map(([label, value]) => (
                  <tr key={label}>
                    <td className="myapp-td-label">{label}</td>
                    <td className="myapp-td-value">
                      <span style={{ whiteSpace: "pre-wrap" }}>{value || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {appData.reviewer_notes && (
          <div className="myapp-notes">
            <div className="myapp-notes-title">📝 Reviewer Notes</div>
            <p>{appData.reviewer_notes}</p>
          </div>
        )}

        <button className="myapp-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

      </div>
    </>
  );
}