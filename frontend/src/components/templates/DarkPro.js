import React from "react";

const DarkPro = ({ portfolio, onClose }) => {
  const displayName = portfolio.name || portfolio.user?.name || "Freelancer";

  return (
    <div className="animate-fade-in-up" style={{
      background: "#111111", padding: "40px", width: "100%", maxWidth: "800px",
      borderRadius: "16px", maxHeight: "90vh", overflowY: "auto", position: "relative",
      fontFamily: "'Inter', sans-serif", color: "#e0e0e0", border: "1px solid #333",
      boxShadow: "0 0 40px rgba(0,255,150,0.1)"
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px",
        background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "#666", zIndex: 10
      }}>
        &times;
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-50px", left: "50%", transform: "translateX(-50%)", width: "150px", height: "150px", background: "#00ff96", filter: "blur(100px)", opacity: 0.2, zIndex: 0 }}></div>
        <img
          src={portfolio.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=120&background=222&color=00ff96`}
          alt="Avatar" style={{ borderRadius: "50%", width: "110px", height: "110px", objectFit: "cover", border: "2px solid #00ff96", position: "relative", zIndex: 1, boxShadow: "0 0 20px rgba(0,255,150,0.3)" }}
        />
        <h1 style={{ margin: "15px 0 5px 0", fontSize: "2rem", fontWeight: "800", color: "#ffffff", letterSpacing: "1px" }}>{displayName}</h1>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem", fontWeight: "400", color: "#00ff96" }}>{portfolio.title || "Pro Freelancer"}</h3>
        {portfolio.charges && (
          <div style={{ display: "inline-block", background: "rgba(0, 255, 150, 0.1)", color: "#00ff96", padding: "6px 16px", borderRadius: "20px", border: "1px solid rgba(0, 255, 150, 0.3)", fontSize: "0.9rem" }}>
            {portfolio.charges}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left Side */}
        <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #2a2a2a" }}>
          <h4 style={{ color: "#fff", fontSize: "1.1rem", margin: "0 0 15px 0", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Experience</h4>
          <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: "1.6" }}>{portfolio.experience || "Not listed"}</p>

          <h4 style={{ color: "#fff", fontSize: "1.1rem", margin: "25px 0 15px 0", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Core Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {portfolio.skills?.length > 0 ? portfolio.skills.map((s, i) => (
              <span key={i} style={{ background: "#222", color: "#00ff96", padding: "6px 12px", borderRadius: "6px", fontSize: "0.85rem", border: "1px solid #333" }}>{s}</span>
            )) : <span style={{ color: "#666" }}>None listed</span>}
          </div>

          <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
            {portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", background: "#333", color: "#fff", padding: "10px", borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem" }}>GitHub</a>}
            {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", background: "#0077b5", color: "#fff", padding: "10px", borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem" }}>LinkedIn</a>}
          </div>

          {/*<button style={{ background: "#00ff96", color: "#000", padding: "12px", border: "none", borderRadius: "6px", width: "100%", marginTop: "15px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }} onClick={() => window.location.href=`/dashboard/chat/${portfolio.user._id}`}>
              Initialize Contact
            </button>*/}
        </div>

        {/* Right Side */}
        <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #2a2a2a" }}>
          <h4 style={{ color: "#fff", fontSize: "1.1rem", margin: "0 0 15px 0", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Featured Projects</h4>
          {portfolio.projects && portfolio.projects.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {portfolio.projects.map((proj, idx) => (
                <div key={idx} style={{ background: "#222", padding: "15px", borderRadius: "8px", borderLeft: "3px solid #00ff96" }}>
                  <h5 style={{ margin: "0 0 5px 0", fontSize: "1.05rem", color: "#fff" }}>{proj.name}</h5>
                  <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "#999", lineHeight: "1.5" }}>{proj.description}</p>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: "#00ff96", textDecoration: "none", fontSize: "0.85rem" }}>Launch Project ↗</a>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#666" }}>No projects launched yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DarkPro;
