/**
 * mapProfileToResume(apiData)
 * Takes the raw getApplication() response from the backend
 * and maps it to the shape ResumeGenerator's formData expects.
 * Every field is safe — missing values fall back to empty string / empty array.
 */
export function mapProfileToResume(d) {
  if (!d) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const str  = (v) => v || "";
  const arr  = (v) => (Array.isArray(v) && v.length > 0 ? v : null);

  // ── Profile links → linkedin / github ───────────────────────────────────
  const links       = arr(d.profileLinks) || [];
  const findLink    = (...labels) => {
    const hit = links.find(l =>
      labels.some(lbl =>
        (l.platform_name || l.label || "").toLowerCase().includes(lbl)
      )
    );
    return hit ? (hit.profile_url || hit.url || "") : "";
  };
  const linkedin = findLink("linkedin");
  const github   = findLink("github");

  // ── Skills → flat string array ───────────────────────────────────────────
  const rawSkills = arr(d.skillsList);
  const skills    = rawSkills
    ? rawSkills.map(s => (typeof s === "string" ? s : s.skill_name || s.name || "")).filter(Boolean)
    : [""];

  // ── Experiences ──────────────────────────────────────────────────────────
  const rawExp = arr(d.experiences);
  const experiences = rawExp
    ? rawExp.map(e => ({
        company:     str(e.company_name  || e.company),
        role:        str(e.role),
        duration:    formatDuration(
                       e.start_date  || e.startDate,
                       e.end_date    || e.endDate,
                       e.currently_working || e.currentlyWorking
                     ),
        description: str(e.description),
      }))
    : [{ company: "", role: "", duration: "", description: "" }];

  // ── Internships ──────────────────────────────────────────────────────────
  const rawIntern = arr(d.internshipsList);
  const internshipsList = rawIntern
    ? rawIntern.map(i => ({
        company:     str(i.organisation || i.company),
        role:        str(i.role),
        duration:    formatDuration(
                       i.start_date || i.startDate,
                       i.end_date   || i.endDate,
                       i.currently_interning || i.currentlyWorking
                     ),
        description: str(i.description),
      }))
    : [];

  // ── Projects ─────────────────────────────────────────────────────────────
  const rawProj = arr(d.projectsList);
  const projectsList = rawProj
    ? rawProj.map(p => ({
        name:        str(p.title),
        tech:        str(p.tech_skills || (Array.isArray(p.techSkills) ? p.techSkills.join(", ") : p.techSkills)),
        description: str(p.description),
      }))
    : [{ name: "", tech: "", description: "" }];

  // ── Certifications ───────────────────────────────────────────────────────
  const rawCerts = arr(d.certsList);
  const certsList = rawCerts
    ? rawCerts.map(c => ({
        name:   str(c.cert_name   || c.name),
        issuer: str(c.issuing_org || c.issuer),
        year:   str(c.date_issued || c.date
                  ? (c.date_issued || c.date).toString().slice(0, 4)
                  : ""),
      }))
    : [];

  // ── Final mapped object ──────────────────────────────────────────────────
  return {
    fullName:       `${str(d.first_name)} ${str(d.last_name)}`.trim(),
    email:          str(d.email),
    phone:          str(d.phone),
    location:       [d.city, d.state].filter(Boolean).join(", "),
    linkedin,
    github,
    summary:        "",          // intentionally blank — AI will generate
    skillsList:     skills,
    experiences,
    internshipsList,
    projectsList,
    certsList,
    targetRole:     "",          // user should fill — we don't store this
    tone:           "professional",
  };
}

// ── Duration helper ──────────────────────────────────────────────────────────
function formatDuration(start, end, current) {
  const fmt = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    } catch { return d; }
  };
  const s = fmt(start);
  const e = current ? "Present" : fmt(end);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}