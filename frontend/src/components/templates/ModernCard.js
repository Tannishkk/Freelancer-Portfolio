import React from "react";

const ModernCard = ({ portfolio, onClose }) => {
  const displayName = portfolio.name || portfolio.user?.name || "Freelancer";

  return (
    <div className="animate-fade-in-up" style={{
      background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", padding: "40px", width: "100%", maxWidth: "850px",
      borderRadius: "24px", maxHeight: "90vh", overflowY: "auto", position: "relative",
      fontFamily: "'Inter', sans-serif", color: "#333", border: "1px solid rgba(255,255,255,0.8)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px",
        background: "rgba(0,0,0,0.05)", border: "none", width: "40px", height: "40px", borderRadius: "50%",
        fontSize: "1.5rem", cursor: "pointer", color: "#666", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s"
      }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}>
        &times;
      </button>

      {/* Main Profile Card */}
      <div style={{ background: "white", borderRadius: "20px", padding: "30px", display: "flex", alignItems: "center", gap: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)", marginBottom: "30px" }}>
        <img
          src={portfolio.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=150&background=e0e7ff&color=4f46e5`}
          alt="Avatar" style={{ borderRadius: "20px", width: "130px", height: "130px", objectFit: "cover" }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 5px 0", fontSize: "2rem", fontWeight: "700", color: "#1f2937" }}>{displayName}</h1>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "500", color: "#6366f1" }}>{portfolio.title || "Modern Creator"}</h3>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
            {/* <button style={{ background: "#4f46e5", color: "white", padding: "10px 24px", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600", transition: "transform 0.2s" }} onClick={() => window.location.href=`/dashboard/chat/${portfolio.user._id}`} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              Hire Me
            </button>*/}
            {portfolio.charges && (
              <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#10b981", background: "#ecfdf5", padding: "8px 16px", borderRadius: "12px" }}>
                {portfolio.charges}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

          {/* About Card */}
          <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.2rem", fontWeight: "700", color: "#1f2937" }}>About Me</h3>
            <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.7", color: "#4b5563" }}>
              {portfolio.experience || "A detailed description of my background and expertise currently unavailable."}
            </p>
          </div>

          {/* Social Links Card */}
          <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.2rem", fontWeight: "700", color: "#1f2937" }}>Links</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              {portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", background: "#f3f4f6", color: "#374151", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>GitHub</a>}
              {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", background: "#eff6ff", color: "#2563eb", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>LinkedIn</a>}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

          {/* Skills Card */}
          <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.2rem", fontWeight: "700", color: "#1f2937" }}>Top Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {portfolio.skills?.length > 0 ? portfolio.skills.map((s, i) => (
                <span key={i} style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)", color: "#4f46e5", padding: "8px 16px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600" }}>{s}</span>
              )) : <span style={{ color: "#9ca3af" }}>No specifics listed.</span>}
            </div>
          </div>

          {/* Projects Card container */}
          <div style={{ background: "transparent" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.2rem", fontWeight: "700", color: "#1f2937", paddingLeft: "10px" }}>Featured Work</h3>
            {portfolio.projects && portfolio.projects.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {portfolio.projects.map((proj, idx) => (
                  <div key={idx} style={{ background: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#1f2937", fontWeight: "700" }}>{proj.name}</h4>
                    <p style={{ margin: "0 0 15px 0", fontSize: "0.95rem", color: "#4b5563", lineHeight: "1.6" }}>{proj.description}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: "#4f46e5", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>Explore Project <span style={{ fontSize: "1.2rem" }}>›</span></a>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#9ca3af", paddingLeft: "10px" }}>No projects added recently.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModernCard;
