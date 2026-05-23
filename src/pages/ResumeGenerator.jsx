import { useRef, useState } from "react";
import { useResumeGenerator } from "../hooks/useAI";
import ResumePreview from "../components/resume/ResumePreview";
import { downloadResumePDF } from "../utils/pdfExport";
import {
  FileText, Loader2, Download, Sparkles,
  Plus, Trash2, ChevronDown, ChevronUp
} from "lucide-react";

const emptyExperience = () => ({
  company: "", role: "", duration: "", description: ""
});
const emptyProject = () => ({
  name: "", tech: "", description: ""
});
const emptyCert = () => ({ name: "", issuer: "", year: "" });

export default function ResumeGenerator() {
  const { loading, error, generate } = useResumeGenerator();
  const previewRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skillsList: [""],
    experiences: [emptyExperience()],
    internshipsList: [],
    projectsList: [emptyProject()],
    certsList: [],
    targetRole: "",
    tone: "professional",
  });

  const [generatedResume, setGeneratedResume] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openSections, setOpenSections] = useState({
    personal: true, skills: true, experience: true,
    projects: true, internships: false, certs: false,
  });

  // ── Section toggle ──────────────────────────────────────────
  const toggle = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  // ── Generic field update ────────────────────────────────────
  const setField = (key, val) =>
    setFormData((p) => ({ ...p, [key]: val }));

  // ── Array helpers ───────────────────────────────────────────
  const updateArrayItem = (key, index, field, value) =>
    setFormData((p) => {
      const arr = [...p[key]];
      arr[index] = typeof field === "string"
        ? { ...arr[index], [field]: value }
        : value;           // for flat arrays (skillsList)
      return { ...p, [key]: arr };
    });

  const addArrayItem = (key, template) =>
    setFormData((p) => ({ ...p, [key]: [...p[key], template] }));

  const removeArrayItem = (key, index) =>
    setFormData((p) => ({
      ...p,
      [key]: p[key].filter((_, i) => i !== index),
    }));

  // ── AI Generation ───────────────────────────────────────────
  const handleGenerate = async () => {
    const result = await generate(formData);
    if (!result) { alert("Generation failed: " + (error || "Unknown error")); return; }
    setGeneratedResume(result); 
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ── PDF Download ────────────────────────────────────────────
  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      await downloadResumePDF(previewRef.current, formData.fullName || "resume");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── UI helpers ──────────────────────────────────────────────
  const SectionHeader = ({ label, sectionKey, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggle(sectionKey)}
      className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span className="flex items-center gap-2 font-semibold text-gray-700">
        <Icon size={16} /> {label}
      </span>
      {openSections[sectionKey]
        ? <ChevronUp size={16} />
        : <ChevronDown size={16} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} /> AI-Powered
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Generator</h1>
          <p className="text-gray-500">Fill in your details — Gemini AI crafts a polished, ATS-ready resume.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── FORM ──────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <SectionHeader label="Personal Information" sectionKey="personal" icon={FileText} />
              {openSections.personal && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    ["fullName", "Full Name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                    ["location", "Location (City, Country)", "text"],
                    ["linkedin", "LinkedIn URL", "url"],
                    ["github", "GitHub URL", "url"],
                  ].map(([key, label, type]) => (
                    <div key={key} className={key === "fullName" || key === "location" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <input
                        type={type}
                        value={formData[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={label}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Target Role</label>
                    <input
                      type="text"
                      value={formData.targetRole}
                      onChange={(e) => setField("targetRole", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Professional Summary (optional — AI will enhance it)</label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => setField("summary", e.target.value)}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="Brief overview of your background..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Resume Tone</label>
                    <select
                      value={formData.tone}
                      onChange={(e) => setField("tone", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                      <option value="technical">Technical</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
              <SectionHeader label="Skills" sectionKey="skills" icon={Sparkles} />
              {openSections.skills && (
                <div className="space-y-2 pt-2">
                  {formData.skillsList.map((skill, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={skill}
                        onChange={(e) => updateArrayItem("skillsList", i, null, e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Skill ${i + 1}`}
                      />
                      {formData.skillsList.length > 1 && (
                        <button onClick={() => removeArrayItem("skillsList", i)}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("skillsList", "")}
                    className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                    <Plus size={14} /> Add Skill
                  </button>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <SectionHeader label="Work Experience" sectionKey="experience" icon={FileText} />
              {openSections.experience && formData.experiences.map((exp, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Experience {i + 1}</span>
                    {formData.experiences.length > 1 && (
                      <button onClick={() => removeArrayItem("experiences", i)}
                        className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    )}
                  </div>
                  {[
                    ["company", "Company Name"],
                    ["role", "Job Title / Role"],
                    ["duration", "Duration (e.g. Jan 2023 – Mar 2024)"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs text-gray-500 mb-1">{label}</label>
                      <input
                        value={exp[field]}
                        onChange={(e) => updateArrayItem("experiences", i, field, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={label}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Key Responsibilities / Achievements</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateArrayItem("experiences", i, "description", e.target.value)}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="What did you do and achieve?"
                    />
                  </div>
                </div>
              ))}
              {openSections.experience && (
                <button onClick={() => addArrayItem("experiences", emptyExperience())}
                  className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800">
                  <Plus size={14} /> Add Experience
                </button>
              )}
            </div>

            {/* Projects */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <SectionHeader label="Projects" sectionKey="projects" icon={FileText} />
              {openSections.projects && formData.projectsList.map((proj, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Project {i + 1}</span>
                    {formData.projectsList.length > 1 && (
                      <button onClick={() => removeArrayItem("projectsList", i)}
                        className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    )}
                  </div>
                  {[["name", "Project Name"], ["tech", "Technologies Used"]].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs text-gray-500 mb-1">{label}</label>
                      <input
                        value={proj[field]}
                        onChange={(e) => updateArrayItem("projectsList", i, field, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={label}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateArrayItem("projectsList", i, "description", e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="What did this project do? What was your role?"
                    />
                  </div>
                </div>
              ))}
              {openSections.projects && (
                <button onClick={() => addArrayItem("projectsList", emptyProject())}
                  className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800">
                  <Plus size={14} /> Add Project
                </button>
              )}
            </div>

            {/* Internships (collapsible optional) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <SectionHeader label="Internships (Optional)" sectionKey="internships" icon={FileText} />
              {openSections.internships && (
                <>
                  {formData.internshipsList.map((intern, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase">Internship {i + 1}</span>
                        <button onClick={() => removeArrayItem("internshipsList", i)}
                          className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                      {[["company", "Company"], ["role", "Role"], ["duration", "Duration"]].map(([field, label]) => (
                        <input key={field} value={intern[field]}
                          onChange={(e) => updateArrayItem("internshipsList", i, field, e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder={label} />
                      ))}
                      <textarea value={intern.description}
                        onChange={(e) => updateArrayItem("internshipsList", i, "description", e.target.value)}
                        rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        placeholder="What you did..." />
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("internshipsList", emptyExperience())}
                    className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800">
                    <Plus size={14} /> Add Internship
                  </button>
                </>
              )}
            </div>

            {/* Certifications (optional) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <SectionHeader label="Certifications (Optional)" sectionKey="certs" icon={FileText} />
              {openSections.certs && (
                <>
                  {formData.certsList.map((cert, i) => (
                    <div key={i} className="flex gap-2 items-start border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {[["name", "Cert Name"], ["issuer", "Issuer"], ["year", "Year"]].map(([field, label]) => (
                          <input key={field} value={cert[field]}
                            onChange={(e) => updateArrayItem("certsList", i, field, e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder={label} />
                        ))}
                      </div>
                      <button onClick={() => removeArrayItem("certsList", i)}
                        className="text-red-400 hover:text-red-600 mt-2"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("certsList", emptyCert())}
                    className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-800">
                    <Plus size={14} /> Add Certification
                  </button>
                </>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Generating with Gemini AI...</>
                : <><Sparkles size={18} /> Generate My Resume</>}
            </button>
          </div>

          {/* ── PREVIEW ───────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              {generatedResume ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-700">Resume Preview</h2>
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl text-sm font-medium transition-all"
                    >
                      {isDownloading
                        ? <><Loader2 size={14} className="animate-spin" /> Generating PDF...</>
                        : <><Download size={14} /> Download PDF</>}
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-auto max-h-[80vh]">
                    <ResumePreview ref={previewRef} data={generatedResume} rawForm={formData} />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-10 text-center text-gray-400 space-y-3">
                  <FileText size={40} className="mx-auto opacity-30" />
                  <p className="text-sm">Your AI-generated resume<br />will appear here</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}