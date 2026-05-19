import { forwardRef } from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

// Safely parse either a JSON string or already-parsed object
function parseResume(data) {
  if (!data) return null;
  if (typeof data === "object") return data;
  try {
    // Strip markdown code fences if AI returned them
    const clean = data.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { rawText: data };
  }
}

const ResumePreview = forwardRef(({ data, rawForm }, ref) => {
  const resume = parseResume(data);

  if (!resume) return null;

  // If AI returned raw text (fallback)
  if (resume.rawText) {
    return (
      <div ref={ref} className="p-8 font-sans text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
        {resume.rawText}
      </div>
    );
  }

  const {
    name, email, phone, location, linkedin, github,
    summary, skills = [], experience = [],
    projects = [], internships = [], certifications = []
  } = resume;

  return (
    <div
      ref={ref}
      id="resume-preview"
      className="bg-white font-sans text-gray-800 text-[13px] leading-relaxed"
      style={{ width: "100%", minHeight: "297mm", padding: "32px 36px", boxSizing: "border-box" }}
    >
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{name || rawForm.fullName}</h1>
        {rawForm.targetRole && (
          <p className="text-blue-600 font-medium mt-0.5">{rawForm.targetRole}</p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-gray-500">
          {(email || rawForm.email) && (
            <span className="flex items-center gap-1">
              <Mail size={11} /> {email || rawForm.email}
            </span>
          )}
          {(phone || rawForm.phone) && (
            <span className="flex items-center gap-1">
              <Phone size={11} /> {phone || rawForm.phone}
            </span>
          )}
          {(location || rawForm.location) && (
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {location || rawForm.location}
            </span>
          )}
          {(linkedin || rawForm.linkedin) && (
            <span className="flex items-center gap-1">
              <Linkedin size={11} /> {(linkedin || rawForm.linkedin).replace(/https?:\/\/(www\.)?/, "")}
            </span>
          )}
          {(github || rawForm.github) && (
            <span className="flex items-center gap-1">
              <Github size={11} /> {(github || rawForm.github).replace(/https?:\/\/(www\.)?/, "")}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Professional Summary">
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-medium border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{exp.role || exp.title}</p>
                    <p className="text-blue-600 text-xs font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap">{exp.duration}</span>
                </div>
                {exp.bullets?.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5 list-disc list-outside ml-4 text-gray-600">
                    {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                ) : exp.description ? (
                  <p className="mt-1 text-gray-600">{exp.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Internships */}
      {internships.length > 0 && (
        <Section title="Internships">
          <div className="space-y-4">
            {internships.map((intern, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{intern.role}</p>
                    <p className="text-blue-600 text-xs font-medium">{intern.company}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{intern.duration}</span>
                </div>
                {intern.bullets?.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5 list-disc list-outside ml-4 text-gray-600">
                    {intern.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                ) : intern.description ? (
                  <p className="mt-1 text-gray-600">{intern.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{proj.name}</p>
                  {proj.tech && (
                    <span className="text-gray-400 text-xs">— {proj.tech}</span>
                  )}
                </div>
                {proj.bullets?.length > 0 ? (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-gray-600">
                    {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                ) : proj.description ? (
                  <p className="mt-0.5 text-gray-600">{proj.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-1">
            {certifications.map((cert, i) => (
              <div key={i} className="flex justify-between">
                <span className="font-medium text-gray-800">{cert.name}</span>
                <span className="text-gray-400 text-xs">{cert.issuer} {cert.year && `· ${cert.year}`}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";
export default ResumePreview;

// Reusable section wrapper
function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}