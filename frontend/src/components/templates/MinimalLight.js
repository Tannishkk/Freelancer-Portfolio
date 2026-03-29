import React from "react";

const MinimalLight = ({ portfolio, onClose }) => {
  const displayName = portfolio.name || portfolio.user?.name || "Freelancer";

  return (
    <div className="glass-card animate-fade-in-up" style={{
      background: "#ffffff", padding: "50px", width: "100%", maxWidth: "800px",
      borderRadius: "8px", maxHeight: "90vh", overflowY: "auto", position: "relative",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#333333",
      border: "1px solid #eaeaea", boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px",
        background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "#999999", zIndex: 10
      }}>
        &times;
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "40px", borderBottom: "1px solid #f0f0f0", paddingBottom: "30px" }}>
        <img
          src={portfolio.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=120&background=f0f0f0&color=333333`}
          alt="Avatar" style={{ borderRadius: "50%", width: "120px", height: "120px", objectFit: "cover", border: "1px solid #eaeaea" }}
        />
        <div>
          <h1 style={{ margin: "0 0 5px 0", fontSize: "2.2rem", fontWeight: "300", letterSpacing: "1px" }}>{displayName}</h1>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "400", color: "#666666" }}>{portfolio.title || "Professional Freelancer"}</h3>
          {portfolio.charges && (
            <span style={{ fontSize: "0.95rem", color: "#333", background: "#f9f9f9", padding: "6px 12px", borderRadius: "4px", border: "1px solid #eaeaea" }}>
              Rate: <b>{portfolio.charges}</b>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
        {/* Left Column */}
        <div>
          <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px" }}>Experience</h4>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#555" }}>{portfolio.experience || "Not specified"}</p>

          <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px", marginTop: "30px" }}>Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {portfolio.skills?.length > 0 ? portfolio.skills.map((s, i) => (
              <span key={i} style={{ background: "#f5f5f5", color: "#333", padding: "4px 10px", borderRadius: "4px", fontSize: "0.85rem", border: "1px solid #eaeaea" }}>{s}</span>
            )) : <span style={{ color: "#999" }}>None listed</span>}
          </div>

          <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px", marginTop: "30px" }}>Contact</h4>
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            {portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer" style={{ color: "#333", textDecoration: "none", fontSize: "0.9rem" }}>GitHub ↗</a>}
            {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer" style={{ color: "#333", textDecoration: "none", fontSize: "0.9rem" }}>LinkedIn ↗</a>}
          </div>
          {/*<button style={{ background: "#333", color: "white", padding: "12px 20px", border: "none", borderRadius: "4px", width: "100%", cursor: "pointer", fontSize: "0.95rem" }} onClick={() => window.location.href=`/dashboard/chat/${portfolio.user._id}`}>
            Send Message
          </button>*/}
        </div>

        {/* Right Column */}
        <div>
          <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "20px" }}>Selected Projects</h4>
          {portfolio.projects && portfolio.projects.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {portfolio.projects.map((proj, idx) => (
                <div key={idx}>
                  <h5 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "500", color: "#222" }}>{proj.name}</h5>
                  <p style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#666", lineHeight: "1.5" }}>{proj.description}</p>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: "#333", textDecoration: "underline", fontSize: "0.85rem" }}>View live project</a>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#999" }}>No projects added.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalLight;
