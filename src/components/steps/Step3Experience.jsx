import React, { useState, useRef, useEffect } from "react";
import "../shared/StepForm.css";
import "./Step3Experience.css";

// ─── Master skills list ───────────────────────────────────────────────────────
const ALL_SKILLS = [
  // Languages
  "C","C++","C#","Java","Python","JavaScript","TypeScript","Go","Rust","Swift",
  "Kotlin","PHP","Ruby","Scala","R","MATLAB","Perl","Bash","Shell Scripting",
  "Assembly","Dart","Lua","Haskell","Elixir","Groovy","COBOL","Fortran","SAS",
  // Web Frontend
  "HTML","CSS","React","React Native","Angular","Vue.js","Next.js","Nuxt.js",
  "Svelte","Bootstrap","Tailwind CSS","jQuery","Redux","GraphQL","WebSockets",
  "Three.js","D3.js","Sass","Less","Webpack","Vite","Babel",
  // Web Backend
  "Node.js","Express.js","Django","Flask","FastAPI","Spring Boot","Laravel",
  "Ruby on Rails","ASP.NET","NestJS","Gin","Fiber","Hapi.js","Strapi",
  // Databases
  "MySQL","PostgreSQL","MongoDB","Firebase","SQLite","Oracle","Redis",
  "Cassandra","DynamoDB","Neo4j","Elasticsearch","MariaDB","CockroachDB",
  "Supabase","PlanetScale","Prisma","Sequelize","Mongoose",
  // Cloud & DevOps
  "AWS","Azure","Google Cloud","Docker","Kubernetes","Terraform","Ansible",
  "Jenkins","GitHub Actions","GitLab CI","CircleCI","Nginx","Apache",
  "Linux","Ubuntu","Debian","CentOS","Heroku","Vercel","Netlify","Render",
  // AI / ML
  "Machine Learning","Deep Learning","NLP","Computer Vision","TensorFlow",
  "PyTorch","Keras","Scikit-learn","Pandas","NumPy","Matplotlib","OpenCV",
  "Hugging Face","LangChain","YOLO","XGBoost","LightGBM","Stable Diffusion",
  // Mobile
  "Android Development","iOS Development","Flutter","React Native","Ionic",
  "Xamarin","Expo","SwiftUI","Jetpack Compose",
  // Tools & Others
  "Git","GitHub","GitLab","Bitbucket","Jira","Confluence","Postman","Figma",
  "Canva","Adobe XD","Selenium","Cypress","Jest","Mocha","Pytest",
  "REST API","gRPC","Microservices","Socket.io","OAuth","JWT","Stripe",
  // Electronics & Hardware
  "Arduino","Raspberry Pi","ESP32","VHDL","Verilog","PCB Design","FPGA",
  "Embedded Systems","IoT","Circuit Design","Proteus","Eagle","KiCad",
  "Multisim","PLC Programming","SCADA","AutoCAD","SolidWorks","ANSYS",
  // Data & Analytics
  "Power BI","Tableau","Excel","Google Sheets","Apache Spark","Hadoop",
  "Kafka","Airflow","dbt","Snowflake","BigQuery","Data Analysis",
  "Data Visualization","Statistics","A/B Testing","SQL","NoSQL",
  // Cyber Security
  "Ethical Hacking","Penetration Testing","Kali Linux","Wireshark","Nmap",
  "Burp Suite","Metasploit","OWASP","Network Security","Cryptography","OSCP",
  // Soft / Other
  "Agile","Scrum","Kanban","Project Management","Technical Writing","UI/UX",
  "Product Management","Business Analysis","Digital Marketing","SEO",
].sort();

// ─── Skill search dropdown component ─────────────────────────────────────────
function SkillInput({ selected, onChange }) {
  const [query, setQuery]     = useState("");
  const [open,  setOpen]      = useState(false);
  const wrapRef               = useRef(null);

  const filtered = query.trim().length > 0
    ? ALL_SKILLS.filter(s =>
        s.toLowerCase().includes(query.toLowerCase()) &&
        !selected.includes(s)
      ).slice(0, 10)
    : [];

  const addSkill = (skill) => {
    if (!selected.includes(skill)) onChange([...selected, skill]);
    setQuery("");
    setOpen(false);
  };

  const removeSkill = (skill) => onChange(selected.filter(s => s !== skill));

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="skill-input-wrap" ref={wrapRef}>
      {/* Selected chips */}
      <div className="skill-chips">
        {selected.map(s => (
          <span key={s} className="skill-chip">
            {s}
            <button type="button" onClick={() => removeSkill(s)}>✕</button>
          </span>
        ))}
        <input
          type="text"
          className="skill-search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? "Type to search skills…" : "Add more…"}
        />
      </div>
      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul className="skill-dropdown">
          {filtered.map(s => (
            <li key={s} onMouseDown={() => addSkill(s)}>
              {s.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
                part.toLowerCase() === query.toLowerCase()
                  ? <mark key={i}>{part}</mark>
                  : part
              )}
            </li>
          ))}
        </ul>
      )}
      {open && query.trim().length > 0 && filtered.length === 0 && (
        <div className="skill-no-match">
          No match — <button type="button" onMouseDown={() => addSkill(query.trim())}>
            Add "{query.trim()}" anyway
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Reusable month-year picker ───────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS  = Array.from({ length: 30 }, (_, i) => 2000 + i);

function MonthYearPicker({ label, value, onChange, required }) {
  const [month, year] = (value || "").split("-");
  return (
    <div className="mypicker">
      <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
      <div className="mypicker-row">
        <select
          value={month || ""}
          onChange={e => onChange(`${e.target.value}-${year || ""}`)}
          required={required}
        >
          <option value="">Month</option>
          {MONTHS.map(m => <option key={m}>{m}</option>)}
        </select>
        <select
          value={year || ""}
          onChange={e => onChange(`${month || ""}-${e.target.value}`)}
          required={required}
        >
          <option value="">Year</option>
          {YEARS.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const emptyExp  = () => ({ id: Date.now()+Math.random(), company:"", role:"", startDate:"", endDate:"", currentlyWorking:false, skillsLearned:[], description:"" });
const emptyIntern = () => ({ id: Date.now()+Math.random(), company:"", role:"", startDate:"", endDate:"", currentlyWorking:false, skillsLearned:[], description:"" });
const emptyProject = () => ({ id: Date.now()+Math.random(), title:"", url:"", description:"", techSkills:[], startDate:"", endDate:"", ongoing:false });
const emptyCert = () => ({ id: Date.now()+Math.random(), name:"", issuer:"", credentialUrl:"", date:"" });
const PLATFORM_PRESETS = [
  { label:"GitHub",   icon:"🐙", placeholder:"https://github.com/username" },
  { label:"LinkedIn", icon:"💼", placeholder:"https://linkedin.com/in/username" },
  { label:"LeetCode", icon:"🧩", placeholder:"https://leetcode.com/username" },
  { label:"HackerRank",icon:"🏆",placeholder:"https://hackerrank.com/username" },
  { label:"CodeChef", icon:"👨‍🍳",placeholder:"https://codechef.com/users/username" },
  { label:"Codeforces",icon:"⚡",placeholder:"https://codeforces.com/profile/username"},
  { label:"Kaggle",   icon:"📊", placeholder:"https://kaggle.com/username" },
  { label:"Portfolio",icon:"🌐", placeholder:"https://yourportfolio.com" },
];
const emptyLink = () => ({ id: Date.now()+Math.random(), label:"", icon:"🔗", url:"", placeholder:"https://" });

// ─── Main component ───────────────────────────────────────────────────────────
export default function Step3Experience({ data, update, onNext, onBack }) {

  // ── state for all sub-sections ──
  const [skills,      setSkills]      = useState(data.skillsList     || []);
  const [experiences, setExperiences] = useState(data.experiences    || []);
  const [internships, setInternships] = useState(data.internshipsList|| []);
  const [projects,    setProjects]    = useState(data.projectsList   || []);
  const [certs,       setCerts]       = useState(data.certsList      || []);
  const [links,       setLinks]       = useState(data.profileLinks   || []);

  // sync all to parent
  const sync = (patch) => update(patch);

  // ── skills ──
  const onSkillsChange = (arr) => { setSkills(arr); sync({ skillsList: arr }); };

  // ── experiences ──
  const addExp    = () => { const u=[...experiences,emptyExp()];    setExperiences(u); sync({experiences:u}); };
  const removeExp = (id) => { const u=experiences.filter(e=>e.id!==id); setExperiences(u); sync({experiences:u}); };
  const updateExp = (id,field,val) => { const u=experiences.map(e=>e.id===id?{...e,[field]:val}:e); setExperiences(u); sync({experiences:u}); };

  // ── internships ──
  const addIntern    = () => { const u=[...internships,emptyIntern()];    setInternships(u); sync({internshipsList:u}); };
  const removeIntern = (id) => { const u=internships.filter(i=>i.id!==id); setInternships(u); sync({internshipsList:u}); };
  const updateIntern = (id,field,val) => { const u=internships.map(i=>i.id===id?{...i,[field]:val}:i); setInternships(u); sync({internshipsList:u}); };

  // ── projects ──
  const addProject    = () => { const u=[...projects,emptyProject()];    setProjects(u); sync({projectsList:u}); };
  const removeProject = (id) => { const u=projects.filter(p=>p.id!==id); setProjects(u); sync({projectsList:u}); };
  const updateProject = (id,field,val) => { const u=projects.map(p=>p.id===id?{...p,[field]:val}:p); setProjects(u); sync({projectsList:u}); };

  // ── certs ──
  const addCert    = () => { const u=[...certs,emptyCert()];    setCerts(u); sync({certsList:u}); };
  const removeCert = (id) => { const u=certs.filter(c=>c.id!==id); setCerts(u); sync({certsList:u}); };
  const updateCert = (id,field,val) => { const u=certs.map(c=>c.id===id?{...c,[field]:val}:c); setCerts(u); sync({certsList:u}); };

  // ── profile links ──
  const addPreset = (preset) => {
    if (links.find(l=>l.label===preset.label)) return;
    const u=[...links,{...emptyLink(),label:preset.label,icon:preset.icon,placeholder:preset.placeholder}];
    setLinks(u); sync({profileLinks:u});
  };
  const addCustomLink = () => { const u=[...links,emptyLink()]; setLinks(u); sync({profileLinks:u}); };
  const removeLink    = (id) => { const u=links.filter(l=>l.id!==id); setLinks(u); sync({profileLinks:u}); };
  const updateLink    = (id,field,val) => { const u=links.map(l=>l.id===id?{...l,[field]:val}:l); setLinks(u); sync({profileLinks:u}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skills.length === 0) { alert("Please add at least one technical skill."); return; }
    if (projects.length === 0) { alert("Please add at least one project."); return; }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="step-form">
      <h2>Step 3: Skills &amp; Experience</h2>
      <p className="step-desc">
        Fill in your technical skills, work history, projects, and achievements.
        All information is used to evaluate your application.
      </p>

      {/* ════ SKILLS ════ */}
      <div className="section-heading">⚡ Technical Skills</div>
      <div className="form-group">
        <label className="form-label">Skills <span className="req">*</span></label>
        <SkillInput selected={skills} onChange={onSkillsChange} />
        <small className="form-hint">
          🔍 Start typing to search from 200+ skills. Click a skill to add it.
        </small>
      </div>

      {/* ════ WORK EXPERIENCE ════ */}
      <div className="section-heading">🏢 Work Experience</div>
      {experiences.length === 0 && (
        <p className="exp-empty-note">No work experience added yet. Leave blank if fresher.</p>
      )}
      {experiences.map((exp, idx) => (
        <div key={exp.id} className="exp-card">
          <div className="exp-card-header">
            <span>Experience {idx + 1}</span>
            <button type="button" className="exp-remove-btn" onClick={() => removeExp(exp.id)}>✕ Remove</button>
          </div>
          <div className="exp-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name <span className="req">*</span></label>
                <input value={exp.company} onChange={e=>updateExp(exp.id,"company",e.target.value)}
                  placeholder="e.g. Tata Consultancy Services" required />
              </div>
              <div className="form-group">
                <label className="form-label">Role / Designation <span className="req">*</span></label>
                <input value={exp.role} onChange={e=>updateExp(exp.id,"role",e.target.value)}
                  placeholder="e.g. Software Engineer" required />
              </div>
            </div>
            <div className="form-row">
              <MonthYearPicker label="Start Date" value={exp.startDate}
                onChange={v=>updateExp(exp.id,"startDate",v)} required />
              {!exp.currentlyWorking && (
                <MonthYearPicker label="End Date" value={exp.endDate}
                  onChange={v=>updateExp(exp.id,"endDate",v)} required />
              )}
              <div className="form-group" style={{justifyContent:"flex-end"}}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={exp.currentlyWorking}
                    onChange={e=>updateExp(exp.id,"currentlyWorking",e.target.checked)} />
                  Currently working here
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Skills Learned</label>
              <SkillInput selected={exp.skillsLearned}
                onChange={arr=>updateExp(exp.id,"skillsLearned",arr)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea value={exp.description}
                onChange={e=>updateExp(exp.id,"description",e.target.value)}
                placeholder="Key responsibilities, achievements, what you built..."
                rows={2} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="add-entry-btn" onClick={addExp}>
        ＋ Add Work Experience
      </button>

      {/* ════ INTERNSHIPS ════ */}
      <div className="section-heading">🎓 Internships</div>
      {internships.length === 0 && (
        <p className="exp-empty-note">No internships added yet.</p>
      )}
      {internships.map((intern, idx) => (
        <div key={intern.id} className="exp-card intern-card">
          <div className="exp-card-header">
            <span>Internship {idx + 1}</span>
            <button type="button" className="exp-remove-btn" onClick={() => removeIntern(intern.id)}>✕ Remove</button>
          </div>
          <div className="exp-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Organisation <span className="req">*</span></label>
                <input value={intern.company} onChange={e=>updateIntern(intern.id,"company",e.target.value)}
                  placeholder="e.g. DRDO, ISRO, Google" required />
              </div>
              <div className="form-group">
                <label className="form-label">Role <span className="req">*</span></label>
                <input value={intern.role} onChange={e=>updateIntern(intern.id,"role",e.target.value)}
                  placeholder="e.g. Electronics Intern" required />
              </div>
            </div>
            <div className="form-row">
              <MonthYearPicker label="Start Date" value={intern.startDate}
                onChange={v=>updateIntern(intern.id,"startDate",v)} required />
              {!intern.currentlyWorking && (
                <MonthYearPicker label="End Date" value={intern.endDate}
                  onChange={v=>updateIntern(intern.id,"endDate",v)} required />
              )}
              <div className="form-group" style={{justifyContent:"flex-end"}}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={intern.currentlyWorking}
                    onChange={e=>updateIntern(intern.id,"currentlyWorking",e.target.checked)} />
                  Currently interning
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Skills Learned</label>
              <SkillInput selected={intern.skillsLearned}
                onChange={arr=>updateIntern(intern.id,"skillsLearned",arr)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea value={intern.description}
                onChange={e=>updateIntern(intern.id,"description",e.target.value)}
                placeholder="What you worked on, tools used, outcomes..."
                rows={2} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="add-entry-btn intern-btn" onClick={addIntern}>
        ＋ Add Internship
      </button>

      {/* ════ PROJECTS ════ */}
      <div className="section-heading">🚀 Projects</div>
      {projects.length === 0 && (
        <p className="exp-empty-note req-note">⚠️ At least one project is required.</p>
      )}
      {projects.map((proj, idx) => (
        <div key={proj.id} className="exp-card project-card">
          <div className="exp-card-header">
            <span>Project {idx + 1}</span>
            <button type="button" className="exp-remove-btn" onClick={() => removeProject(proj.id)}>✕ Remove</button>
          </div>
          <div className="exp-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Project Title <span className="req">*</span></label>
                <input value={proj.title} onChange={e=>updateProject(proj.id,"title",e.target.value)}
                  placeholder="e.g. Job Application Portal" required />
              </div>
              <div className="form-group">
                <label className="form-label">Project URL</label>
                <input type="url" value={proj.url} onChange={e=>updateProject(proj.id,"url",e.target.value)}
                  placeholder="https://github.com/you/project" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description <span className="req">*</span></label>
              <textarea value={proj.description}
                onChange={e=>updateProject(proj.id,"description",e.target.value)}
                placeholder="What the project does, your role, key features, outcome..."
                rows={2} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tech Skills Used</label>
              <SkillInput selected={proj.techSkills}
                onChange={arr=>updateProject(proj.id,"techSkills",arr)} />
            </div>
            <div className="form-row">
              <MonthYearPicker label="Start Date" value={proj.startDate}
                onChange={v=>updateProject(proj.id,"startDate",v)} />
              {!proj.ongoing && (
                <MonthYearPicker label="End Date" value={proj.endDate}
                  onChange={v=>updateProject(proj.id,"endDate",v)} />
              )}
              <div className="form-group" style={{justifyContent:"flex-end"}}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={proj.ongoing}
                    onChange={e=>updateProject(proj.id,"ongoing",e.target.checked)} />
                  Ongoing project
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="add-entry-btn project-btn" onClick={addProject}>
        ＋ Add Project
      </button>

      {/* ════ ACHIEVEMENTS & CERTS ════ */}
      <div className="section-heading">🏆 Achievements &amp; Certifications</div>
      {certs.length === 0 && (
        <p className="exp-empty-note">No certificates or achievements added yet.</p>
      )}
      {certs.map((cert, idx) => (
        <div key={cert.id} className="exp-card cert-card">
          <div className="exp-card-header">
            <span>Achievement / Certificate {idx + 1}</span>
            <button type="button" className="exp-remove-btn" onClick={() => removeCert(cert.id)}>✕ Remove</button>
          </div>
          <div className="exp-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title / Award Name <span className="req">*</span></label>
                <input value={cert.name} onChange={e=>updateCert(cert.id,"name",e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner" required />
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Organisation <span className="req">*</span></label>
                <input value={cert.issuer} onChange={e=>updateCert(cert.id,"issuer",e.target.value)}
                  placeholder="e.g. Amazon Web Services" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Credential / Certificate URL</label>
                <input type="url" value={cert.credentialUrl}
                  onChange={e=>updateCert(cert.id,"credentialUrl",e.target.value)}
                  placeholder="https://verify.credential.net/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Date Issued</label>
                <input type="month" value={cert.date}
                  onChange={e=>updateCert(cert.id,"date",e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="add-entry-btn cert-btn" onClick={addCert}>
        ＋ Add Achievement / Certificate
      </button>

      {/* ════ PROFILE LINKS ════ */}
      <div className="section-heading">🔗 Profile &amp; Portfolio Links</div>
      <p className="step-desc" style={{marginBottom:"14px"}}>
        Add your professional profiles. Click a platform button to add it quickly.
      </p>

      {/* Quick-add preset buttons */}
      <div className="platform-presets">
        {PLATFORM_PRESETS.map(p => {
          const already = links.find(l => l.label === p.label);
          return (
            <button
              key={p.label}
              type="button"
              className={`preset-btn ${already ? "preset-added" : ""}`}
              onClick={() => addPreset(p)}
              disabled={!!already}
            >
              <span>{p.icon}</span>
              {p.label}
              {already && <span className="preset-tick">✓</span>}
            </button>
          );
        })}
        <button type="button" className="preset-btn preset-custom" onClick={addCustomLink}>
          ＋ Custom
        </button>
      </div>

      {/* Link entries */}
      {links.map(link => (
        <div key={link.id} className="link-entry">
          <div className="link-entry-icon">{link.icon || "🔗"}</div>
          {!link.label && (
            <input
              className="link-label-input"
              value={link.label}
              onChange={e=>updateLink(link.id,"label",e.target.value)}
              placeholder="Platform name"
            />
          )}
          {link.label && (
            <span className="link-platform-name">{link.label}</span>
          )}
          <input
            type="url"
            className="link-url-input"
            value={link.url}
            onChange={e=>updateLink(link.id,"url",e.target.value)}
            placeholder={link.placeholder || "https://"}
          />
          <button type="button" className="link-remove-btn"
            onClick={() => removeLink(link.id)}>✕</button>
        </div>
      ))}

      {/* Navigation */}
      <div className="step-buttons">
        <button type="button" onClick={onBack} className="btn-back">← Back</button>
        <button type="submit" className="btn-next">Next: Documents →</button>
      </div>
    </form>
  );
}