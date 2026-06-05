import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import ProgressBar from "../components/shared/ProgressBar";
import Step1Personal from "../components/steps/Step1Personal";
import Step2Education from "../components/steps/Step2Education";
import Step3Experience from "../components/steps/Step3Experience";
import Step4Documents from "../components/steps/Step4Documents";
import Step5Review from "../components/steps/Step5Review";
import { getApplication } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ApplicationPage.css";

const STEPS = ["Personal", "Education", "Experience", "Documents", "Review"];

const EMPTY_FORM = {
  // Step 1 — Personal
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  nationality: "",

  // Step 2 — Education
  degrees: [],
  twelfthBoard: "",
  twelfthMarks: "",
  twelfthYear: "",
  tenthBoard: "",
  tenthMarks: "",
  tenthYear: "",
  schoolGapReason: "",

  // Step 3 — Experience
  skillsList: [],
  experiences: [],
  internshipsList: [],
  projectsList: [],
  certsList: [],
  profileLinks: [],

  // Step 4 — Documents
  resumeLink: "",
  photoLink: "",
  idProofLink: "",
};

// Map the getApplication() API response back into EMPTY_FORM shape for editing
function mapApiToForm(data) {
  if (!data) return EMPTY_FORM;
  return {
    firstName:      data.first_name     || "",
    lastName:       data.last_name      || "",
    dob:            data.date_of_birth
                      ? data.date_of_birth.split("T")[0]
                      : "",
    gender:         data.gender         || "",
    phone:          data.phone          || "",
    address:        data.address        || "",
    city:           data.city           || "",
    state:          data.state          || "",
    pincode:        data.pincode        || "",
    nationality:    data.nationality    || "",

    degrees:        Array.isArray(data.degrees) ? data.degrees : [],
    twelfthBoard:   data.twelfth_board  || "",
    twelfthMarks:   data.twelfth_marks  || "",
    twelfthYear:    data.twelfth_year   || "",
    tenthBoard:     data.tenth_board    || "",
    tenthMarks:     data.tenth_marks    || "",
    tenthYear:      data.tenth_year     || "",
    schoolGapReason: data.school_gap_reason || "",

    skillsList: Array.isArray(data.skillsList) ? data.skillsList : [],

    // Normalize DB field names → frontend field names, and add id for .map() keys
    experiences: Array.isArray(data.experiences)
      ? data.experiences.map(e => ({
          id:             e.id || Date.now() + Math.random(),
          company:        e.company_name  || e.company  || "",
          role:           e.role          || "",
          startDate:      e.start_date    || e.startDate || "",
          endDate:        e.end_date      || e.endDate   || "",
          currentlyWorking: !!(e.currently_working || e.currentlyWorking),
          skillsLearned:  e.skills_learned
                            ? e.skills_learned.split(",").map(s => s.trim()).filter(Boolean)
                            : (Array.isArray(e.skillsLearned) ? e.skillsLearned : []),
          description:    e.description   || "",
        }))
      : [],

    internshipsList: Array.isArray(data.internshipsList)
      ? data.internshipsList.map(i => ({
          id:             i.id || Date.now() + Math.random(),
          company:        i.organisation   || i.company || "",
          role:           i.role           || "",
          startDate:      i.start_date     || i.startDate || "",
          endDate:        i.end_date       || i.endDate   || "",
          currentlyWorking: !!(i.currently_interning || i.currentlyWorking),
          skillsLearned:  i.skills_learned
                            ? i.skills_learned.split(",").map(s => s.trim()).filter(Boolean)
                            : (Array.isArray(i.skillsLearned) ? i.skillsLearned : []),
          description:    i.description   || "",
        }))
      : [],

    projectsList: Array.isArray(data.projectsList)
      ? data.projectsList.map(p => ({
          id:          p.id || Date.now() + Math.random(),
          title:       p.title       || "",
          url:         p.project_url || p.url || "",
          description: p.description || "",
          techSkills:  p.tech_skills
                         ? p.tech_skills.split(",").map(s => s.trim()).filter(Boolean)
                         : (Array.isArray(p.techSkills) ? p.techSkills : []),
          startDate:   p.start_date  || p.startDate || "",
          endDate:     p.end_date    || p.endDate   || "",
          ongoing:     !!(p.is_ongoing || p.ongoing),
        }))
      : [],

    certsList: Array.isArray(data.certsList)
      ? data.certsList.map(c => ({
          id:            c.id || Date.now() + Math.random(),
          name:          c.cert_name   || c.name   || "",
          issuer:        c.issuing_org || c.issuer || "",
          credentialUrl: c.credential_url || c.credentialUrl || "",
          date:          c.date_issued    || c.date          || "",
        }))
      : [],

    profileLinks: Array.isArray(data.profileLinks)
      ? data.profileLinks.map(l => ({
          id:    l.id || Date.now() + Math.random(),
          label: l.platform_name || l.label || "",
          icon:  l.platform_icon || l.icon  || "🔗",
          url:   l.profile_url   || l.url   || "",
          placeholder: "https://",
        }))
      : [],

    resumeLink:     data.resume_filename   || "",
    photoLink:      data.photo_filename    || "",
    idProofLink:    data.id_proof_filename || "",
  };
}

export default function ApplicationPage() {
  const navigate = useNavigate();
  const { tokenReady } = useAuth();

  const [step, setStep]           = useState(1);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [checking, setChecking]   = useState(true);   // true while we look up existing app
  const [isEditing, setIsEditing] = useState(false);  // true when editing an existing submission
  const [toast, setToast]         = useState(null);   // { msg, type } for brief notifications

  // On mount (once token is ready): check whether this user already submitted
  useEffect(() => {
    if (!tokenReady) return;

    getApplication()
      .then(res => {
        if (res.success && res.data?.application_code) {
          // User has a completed submission
          const isEdit = new URLSearchParams(window.location.search).get("edit") === "1";
          if (isEdit) {
            // Came from "Edit Application" button — pre-fill and allow editing
            setFormData(mapApiToForm(res.data));
            setIsEditing(true);
            setChecking(false);
          } else {
            // Normal navigation to /apply — redirect to dashboard with a note
            navigate("/dashboard", { state: { toast: "Your application is already submitted. Use 'Edit Application' to make changes." } });
          }
        } else {
          // No submission yet — fresh form
          setChecking(false);
        }
      })
      .catch(() => {
        // API error — allow the form to load anyway (graceful degradation)
        setChecking(false);
      });
  }, [tokenReady, navigate]);

  const update = (fields) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Loading state while we check for existing submission
  if (checking) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: 16,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "4px solid #e5e7eb", borderTopColor: "#6366f1",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#6b7280", fontSize: 14 }}>Loading your application…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? "#fee2e2" : "#d1fae5",
          color: toast.type === "error" ? "#991b1b" : "#065f46",
          border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#6ee7b7"}`,
          borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600,
          zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,.12)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {toast.msg}
        </div>
      )}

      <div className="application-container">
        <div className="application-header">
          <h1>{isEditing ? "Edit Your Application" : "Job Application Portal"}</h1>
          <p>
            {isEditing
              ? "Update any section below, then re-submit on Step 5."
              : "Complete all 5 steps to submit your application"}
          </p>
          {isEditing && (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                marginTop: 10,
                background: "none", border: "1.5px solid #6366f1",
                color: "#6366f1", borderRadius: 8, padding: "6px 16px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Back to Dashboard
            </button>
          )}
        </div>

        <ProgressBar currentStep={step} steps={STEPS} />

        {step === 1 && (
          <Step1Personal data={formData} update={update} onNext={next} />
        )}
        {step === 2 && (
          <Step2Education data={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <Step3Experience data={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === 4 && (
          <Step4Documents data={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === 5 && (
          <Step5Review
            data={formData}
            onBack={back}
            isEditing={isEditing}
            onSuccess={() => {
              showToast(isEditing ? "Application updated!" : "Application submitted!");
              setTimeout(() => navigate("/dashboard"), 1200);
            }}
          />
        )}
      </div>
    </>
  );
}