import React, { useEffect, useState } from "react";
import API from "../services/api";

import MinimalLight from "../components/templates/MinimalLight";
import DarkPro from "../components/templates/DarkPro";
import CreativeBold from "../components/templates/CreativeBold";
import CorporateClassic from "../components/templates/CorporateClassic";
import ModernCard from "../components/templates/ModernCard";

const Profile = () => {
  const userId = localStorage.getItem("userId");

  const [templateId, setTemplateId] = useState("minimalLight");
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [charges, setCharges] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [projects, setProjects] = useState([]);
  
  const [editMode, setEditMode] = useState(false);
  const [previewLive, setPreviewLive] = useState(false);

  const PreviewModal = ({ portfolio, onClose }) => {
    if (!portfolio) return null;
    const tId = portfolio.templateId || "minimalLight";

    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 9999, padding: "20px", backdropFilter: "blur(5px)", overflowY: "auto"
      }} onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "1200px", maxHeight: "90vh", overflowY: "auto", borderRadius: "12px", background: "white" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "20px", background: "black", color: "white", padding: "8px 12px", borderRadius: "8px", zIndex: 10, cursor: "pointer", border: "none", fontWeight: "bold" }}>
            Close Preview
          </button>
          {tId === "minimalLight" && <MinimalLight portfolio={portfolio} onClose={onClose} />}
          {tId === "darkPro" && <DarkPro portfolio={portfolio} onClose={onClose} />}
          {tId === "creativeBold" && <CreativeBold portfolio={portfolio} onClose={onClose} />}
          {tId === "corporateClassic" && <CorporateClassic portfolio={portfolio} onClose={onClose} />}
          {tId === "modernCard" && <ModernCard portfolio={portfolio} onClose={onClose} />}
        </div>
      </div>
    );
  };

  const availableTemplates = [
    { id: "minimalLight", name: "Minimal Light", bgColor: "#ffffff", color: "#333", border: "#eaeaea" },
    { id: "darkPro", name: "Dark Pro", bgColor: "#111111", color: "#00ff96", border: "#333" },
    { id: "creativeBold", name: "Creative Bold", bgColor: "#ff3366", color: "#ffffff", border: "#000" },
    { id: "corporateClassic", name: "Corporate Classic", bgColor: "#1a365d", color: "#ffffff", border: "#c2c9d6" },
    { id: "modernCard", name: "Modern Card", bgColor: "#e0e7ff", color: "#4f46e5", border: "rgba(255,255,255,0.8)" }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/portfolios");
        const portfolios = res.data;

        const myProfile = portfolios.find(
          (p) => p.user && String(p.user._id || p.user) === String(userId)
        );

        if (myProfile) {
          setProfile(myProfile);
          setTemplateId(myProfile.templateId || "minimalLight");
          setName(myProfile.name || myProfile.user?.name || "");
          setTitle(myProfile.title || "");
          setPhoto(myProfile.photo || "");
          setCharges(myProfile.charges || "");
          setExperience(myProfile.experience || "");
          setSkills(myProfile.skills?.join(", ") || "");
          setGithub(myProfile.github || "");
          setLinkedin(myProfile.linkedin || "");
          setProjects(myProfile.projects || []);
          setEditMode(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleAddProject = () => {
    setProjects([...projects, { name: "", description: "", link: "" }]);
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const handleRemoveProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };

  const getPayload = () => ({
    templateId,
    name,
    title,
    photo,
    charges,
    experience,
    skills: skills.split(",").map((s) => s.trim()).filter((s) => s),
    github,
    linkedin,
    projects: projects.filter(p => p.name || p.description) // filter out empties
  });

  const createProfile = async () => {
    try {
      await API.post("/portfolios", getPayload());
      alert("Profile Created");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async () => {
    try {
      await API.put(`/portfolios/${profile._id}`, getPayload());
      alert("Profile Updated");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        await API.delete("/portfolios/");
        alert("Profile Deleted");
        window.location.reload(); // Reload will reset state and show Create Profile if it was deleted successfully
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div style={{ paddingBottom: "60px", animation: "fadeInUp 0.6s ease-out" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem", color: "var(--text-main)" }}>
        Manage Your Profile
      </h2>

      <div className="glass-card" style={{ maxWidth: "900px", margin: "auto", padding: "40px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "50px" }}>
          {/* Left Column: Basic Info & Links */}
          <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "var(--primary)" }}>Basic Information</h3>
            
            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Full Name (Override)</label>
            <input className="modern-input" placeholder="Your display name" value={name} onChange={(e) => setName(e.target.value)} />

            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Professional Title</label>
            <input className="modern-input" placeholder="e.g. Senior Frontend Developer" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Profile Photo URL</label>
            <input className="modern-input" placeholder="https://example.com/photo.jpg" value={photo} onChange={(e) => setPhoto(e.target.value)} />

            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Hourly Rate / Pricing</label>
            <input className="modern-input" placeholder="e.g. $50/hr or Fixed Rates" value={charges} onChange={(e) => setCharges(e.target.value)} />

            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Experience Summary</label>
            <textarea className="modern-input" placeholder="Detail your years of experience..." value={experience} onChange={(e) => setExperience(e.target.value)} rows="3" style={{ resize: "vertical" }} />

            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Skills (comma separated)</label>
            <input className="modern-input" placeholder="React, Node.js, UI/UX" value={skills} onChange={(e) => setSkills(e.target.value)} />

            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "var(--primary)", marginTop: "30px" }}>Social Links</h3>
            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>GitHub Profile</label>
            <input className="modern-input" placeholder="https://github.com/..." value={github} onChange={(e) => setGithub(e.target.value)} />
            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>LinkedIn Profile</label>
            <input className="modern-input" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          </div>

          {/* Right Column: Projects */}
          <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "var(--primary)" }}>Portfolio Projects</h3>
            
            {projects.map((proj, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #e5e7eb", position: "relative" }}>
                <button onClick={() => handleRemoveProject(idx)} style={{ position: "absolute", top: "10px", right: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                
                <input className="modern-input" style={{ marginBottom: "10px", padding: "8px" }} placeholder="Project Title" value={proj.name} onChange={(e) => handleProjectChange(idx, "name", e.target.value)} />
                <input className="modern-input" style={{ marginBottom: "10px", padding: "8px" }} placeholder="Project Link (Optional)" value={proj.link} onChange={(e) => handleProjectChange(idx, "link", e.target.value)} />
                <textarea className="modern-input" style={{ marginBottom: 0, padding: "8px" }} placeholder="Short description..." value={proj.description} onChange={(e) => handleProjectChange(idx, "description", e.target.value)} rows="2" />
              </div>
            ))}

            <button onClick={handleAddProject} style={{ width: "100%", padding: "10px", background: "transparent", color: "var(--primary)", border: "2px dashed var(--primary)", borderRadius: "var(--radius)", fontWeight: "600", cursor: "pointer" }}>
              + Add Project
            </button>
          </div>
        </div>

        {/* Template Selection Section */}
        <div style={{ padding: "30px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "40px" }}>
          <h3 style={{ textAlign: "center", margin: "0 0 5px 0", color: "#1e293b", fontSize: "1.4rem" }}>Choose Your Portfolio Template</h3>
          <p style={{ textAlign: "center", margin: "0 0 25px 0", color: "#64748b", fontSize: "0.95rem" }}>Select a design below to instantly reskin your public portfolio profile.</p>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
            {availableTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => setTemplateId(tpl.id)}
                style={{ 
                  width: "160px", height: "120px", borderRadius: "12px", cursor: "pointer", position: "relative",
                  background: tpl.bgColor, border: `3px solid ${templateId === tpl.id ? "var(--primary)" : tpl.border}`,
                  boxShadow: templateId === tpl.id ? "0 0 0 4px rgba(79, 70, 229, 0.2)" : "0 4px 6px rgba(0,0,0,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: "700", color: tpl.color, textAlign: "center", padding: "10px" }}>
                  {tpl.name}
                </div>
                {templateId === tpl.id && (
                  <div style={{ position: "absolute", top: "-10px", right: "-10px", background: "var(--primary)", color: "white", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold" }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button 
              onClick={() => setPreviewLive(true)} 
              style={{ background: "#4f46e5", color: "white", border: "none", padding: "12px 24px", fontSize: "1rem", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s", boxShadow: "0 4px 6px rgba(79, 70, 229, 0.2)" }}
              onMouseEnter={(e) => e.target.style.background = "#4338ca"}
              onMouseLeave={(e) => e.target.style.background = "#4f46e5"}
            >
              👁️ Preview Template
            </button>
          </div>
        </div>

        {/* Save/Update/Delete Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          {editMode ? (
            <>
              <button className="modern-button" style={{ padding: "16px 40px", fontSize: "1.1rem", width: "100%", maxWidth: "400px" }} onClick={updateProfile}>
                💾 Update Profile
              </button>
              <button className="modern-button" style={{ padding: "16px 40px", fontSize: "1.1rem", background: "#ef4444", width: "100%", maxWidth: "400px" }} onClick={deleteProfile}>
                🗑️ Delete Profile
              </button>
            </>
          ) : (
            <button className="modern-button" style={{ padding: "16px 40px", fontSize: "1.1rem", background: "#10B981", width: "100%", maxWidth: "400px" }} onClick={createProfile}>
              🚀 Create Profile
            </button>
          )}
        </div>

      </div>

      {previewLive && (
        <PreviewModal 
          portfolio={{ ...getPayload(), user: { name: name || "User" } }} 
          onClose={() => setPreviewLive(false)} 
        />
      )}
    </div>
  );
};

export default Profile;