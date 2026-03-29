import React from "react";

const CorporateClassic = ({ portfolio, onClose }) => {
  const displayName = portfolio.name || portfolio.user?.name || "Freelancer";

  return (
    <div className="animate-fade-in-up" style={{
      background: "#f4f7f6", padding: "0", width: "100%", maxWidth: "850px",
      borderRadius: "8px", maxHeight: "90vh", overflowY: "auto", position: "relative",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333", border: "1px solid #c2c9d6",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    }}>
      {/* Top Navigation / Header */}
      <div style={{ background: "#1a365d", padding: "20px 40px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "600", letterSpacing: "1px" }}>{displayName} <span style={{ fontWeight: "300", color: "#a0aec0", fontSize: "1rem" }}>| Portfolio</span></h2>
        <button onClick={onClose} style={{
          background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#a0aec0"
        }}>
          &times;
        </button>
      </div>

      <div style={{ padding: "40px" }}>
        {/* Profile Header Grid */}
        <div style={{ display: "flex", gap: "30px", marginBottom: "40px", alignItems: "flex-start" }}>
          <img
            src={portfolio.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=150&background=cbd5e0&color=1a365d`}
            alt="Avatar" style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: "0 0 10px 0", fontSize: "2.2rem", color: "#2d3748" }}>{displayName}</h1>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.2rem", color: "#4a5568", fontWeight: "500" }}>{portfolio.title || "Professional Consultant"}</h3>
            <p style={{ margin: "0 0 20px 0", color: "#718096", lineHeight: "1.6" }}>{portfolio.experience || "Dedicated professional with extensive industry experience."}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              {/*<button style={{ background: "#2b6cb0", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }} onClick={() => window.location.href=`/dashboard/chat/${portfolio.user._id}`}>
                Contact Consultant
              </button>*/}
              {portfolio.charges && (
                <div style={{ padding: "10px 20px", border: "1px solid #cbd5e0", color: "#4a5568", borderRadius: "4px", backgroundColor: "#fff", fontWeight: "600" }}>
                  {portfolio.charges}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "0 0 30px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>

          {/* Left Column (Skills & Links) */}
          <div>
            <h3 style={{ color: "#2d3748", fontSize: "1.1rem", borderBottom: "2px solid #3182ce", paddingBottom: "8px", marginBottom: "20px" }}>Professional Skills</h3>
            <ul style={{ listStyleType: "none", padding: "0", margin: "0 0 30px 0" }}>
              {portfolio.skills?.length > 0 ? portfolio.skills.map((s, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #edf2f7", color: "#4a5568" }}>• {s}</li>
              )) : <li style={{ color: "#a0aec0" }}>No skills listed.</li>}
            </ul>

            <h3 style={{ color: "#2d3748", fontSize: "1.1rem", borderBottom: "2px solid #3182ce", paddingBottom: "8px", marginBottom: "20px" }}>Connect</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer" style={{ color: "#2b6cb0", textDecoration: "none", fontWeight: "500" }}>LinkedIn Profile ↗</a>}
              {portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer" style={{ color: "#2b6cb0", textDecoration: "none", fontWeight: "500" }}>GitHub Repository ↗</a>}
            </div>
          </div>

          {/* Right Column (Projects) */}
          <div>
            <h3 style={{ color: "#2d3748", fontSize: "1.1rem", borderBottom: "2px solid #3182ce", paddingBottom: "8px", marginBottom: "20px" }}>Recent Objectives & Projects</h3>
            {portfolio.projects && portfolio.projects.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {portfolio.projects.map((proj, idx) => (
                  <div key={idx}>
                    <h4 style={{ margin: "0 0 5px 0", color: "#2b6cb0", fontSize: "1.1rem" }}>{proj.name}</h4>
                    <p style={{ margin: "0 0 10px 0", color: "#4a5568", lineHeight: "1.5" }}>{proj.description}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: "#3182ce", fontSize: "0.9rem", textDecoration: "none", fontWeight: "600" }}>View Documentation ↗</a>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#a0aec0" }}>No project data available.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CorporateClassic;
