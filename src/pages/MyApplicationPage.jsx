import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplication } from "../services/api";
import Navbar from "../components/shared/Navbar";
import "./MyApplicationPage.css";

export default function MyApplicationPage() {
  const navigate       = useNavigate();
  const [appData,  setAppData]  = useState(null);
  const [loading,  setLoading]  = useState(true);

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

  const sections = [
    {
      title: "👤 Personal Information",
      rows: [
        ["Full Name",    `${appData.first_name || ""} ${appData.last_name || ""}`.trim()],
        ["Date of Birth",
  appData.date_of_birth
    ? new Date(appData.date_of_birth).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    : "—"
],
        ["Gender",       appData.gender        || "—"],
        ["Phone",        appData.phone         || "—"],
        ["City / State", `${appData.city || ""}, ${appData.state || ""}`],
        ["Pincode",      appData.pincode       || "—"],
        ["Nationality",  appData.nationality   || "—"],
      ]
    },
    {
      title: "🏫 School Records",
      rows: [
        ["Class XII", `${appData.twelfth_board || "—"} — ${appData.twelfth_marks || "—"} (${appData.twelfth_year || "—"})`],
        ["Class X",   `${appData.tenth_board   || "—"} — ${appData.tenth_marks   || "—"} (${appData.tenth_year   || "—"})`],
      ]
    },
    {
      title: "🎓 Degrees",
      rows: Array.isArray(appData.degrees) && appData.degrees.length > 0
        ? appData.degrees.map(d => [
            `Degree ${d.degree_order}`,
            `${d.degree_type} in ${d.branch} — ${d.institution} | CGPA: ${d.cgpa} | Year: ${d.passing_year}`
          ])
        : [["Degrees", "—"]]
    },
    {
      title: "⚡ Skills",
      rows: [["Technical Skills",
        Array.isArray(appData.skillsList) && appData.skillsList.length > 0
          ? appData.skillsList.join(", ")
          : "—"
      ]]
    },
    {
      title: "🚀 Projects",
      rows: Array.isArray(appData.projectsList) && appData.projectsList.length > 0
        ? appData.projectsList.map(p => [
            p.title || "Project",
            `${p.description || ""} ${p.project_url ? "| " + p.project_url : ""} ${p.is_ongoing ? "(Ongoing)" : ""}`
          ])
        : [["Projects", "—"]]
    },
    {
      title: "📎 Documents",
      rows: [
        ["Resume",   appData.resume_filename   || "—"],
        ["Photo",    appData.photo_filename    || "—"],
        ["ID Proof", appData.id_proof_filename || "—"],
      ]
    },
  ];

  return (
    <>
      <Navbar />
      <div className="myapp-page">

        {/* Header */}
        <div className="myapp-header">
          <h1>My Application</h1>
          <p>Your submitted application details are shown below.</p>
        </div>

        {/* Status card */}
        <div className="myapp-status-card">
          <div className="myapp-status-left">
            <div className="myapp-app-id">
              <span className="myapp-app-id-label">Application ID</span>
              <span className="myapp-app-id-value">
                {appData.application_code}
              </span>
            </div>
            <div className="myapp-email">📧 {appData.email}</div>
            <div className="myapp-date">
              🕐 Submitted:{" "}
              {appData.submitted_at
                ? new Date(appData.submitted_at).toLocaleString()
                : "—"}
            </div>
          </div>
          <div
            className="myapp-status-badge"
            style={{ background: st.bg, color: st.color }}
          >
            {st.label}
          </div>
        </div>

        {/* Review sections */}
        {sections.map(sec => (
          <div className="myapp-section" key={sec.title}>
            <div className="myapp-section-title">{sec.title}</div>
            <table className="myapp-table">
              <tbody>
                {sec.rows.map(([label, value]) => (
                  <tr key={label}>
                    <td className="myapp-td-label">{label}</td>
                    <td className="myapp-td-value">
                      <span style={{ whiteSpace: "pre-wrap" }}>
                        {value || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Reviewer notes */}
        {appData.reviewer_notes && (
          <div className="myapp-notes">
            <div className="myapp-notes-title">📝 Reviewer Notes</div>
            <p>{appData.reviewer_notes}</p>
          </div>
        )}

        <button
          className="myapp-back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </div>
    </>
  );
}