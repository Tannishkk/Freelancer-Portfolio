import React from "react";

const CreativeBold = ({ portfolio, onClose }) => {
  const displayName = portfolio.name || portfolio.user?.name || "Freelancer";

  return (
    <div className="animate-fade-in-up" style={{
      background: "#ffffff", padding: 0, width: "100%", maxWidth: "800px",
      borderRadius: "20px", maxHeight: "90vh", overflowY: "auto", position: "relative",
      fontFamily: "'Poppins', sans-serif", color: "#333", border: "4px solid #000",
      boxShadow: "10px 10px 0px #ff3366"
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "#000",
        color: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%",
        fontSize: "1.5rem", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        &times;
      </button>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #ff3366 0%, #ff9933 100%)", padding: "60px 40px", color: "white" }}>
        <img
          src={portfolio.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=120&background=fff&color=ff3366`}
          alt="Avatar" style={{ borderRadius: "20px", width: "120px", height: "120px", objectFit: "cover", border: "4px solid white", marginBottom: "20px", transform: "rotate(-5deg)" }}
        />
        <h1 style={{ margin: "0 0 10px 0", fontSize: "3rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", lineHeight: "1.1" }}>{displayName}</h1>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "1.5rem", fontWeight: "600", background: "#000", display: "inline-block", padding: "5px 15px", transform: "rotate(2deg)" }}>{portfolio.title || "Creative Mind"}</h3>
      </div>

      <div style={{ padding: "40px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>

        {/* Left Side */}
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0 0 20px 0", color: "#ff3366", textTransform: "uppercase" }}>My Projects</h2>
          {portfolio.projects && portfolio.projects.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {portfolio.projects.map((proj, idx) => (
                <div key={idx} style={{ background: "#f4f4f4", padding: "20px", borderRadius: "10px", border: "2px solid #000" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.3rem", fontWeight: "800" }}>{proj.name}</h3>
                  <p style={{ margin: "0 0 15px 0", fontSize: "1rem", lineHeight: "1.6" }}>{proj.description}</p>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#ff9933", color: "#000", padding: "8px 16px", textDecoration: "none", fontWeight: "bold", border: "2px solid #000", borderRadius: "4px" }}>View Work &rarr;</a>}
                </div>
              ))}
            </div>
          ) : (
            <p>No projects yet.</p>
          )}

          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "40px 0 20px 0", color: "#000", textTransform: "uppercase" }}>My Story</h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.8", background: "#fff", padding: "20px", border: "2px dashed #ff3366", borderRadius: "10px" }}>
            {portfolio.experience || "Experience details coming soon."}
          </p>
        </div>

        {/* Right Side */}
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0 0 20px 0", color: "#000", textTransform: "uppercase" }}>Arsenal</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {portfolio.skills?.length > 0 ? portfolio.skills.map((s, i) => (
              <span key={i} style={{ background: "#000", color: "#fff", padding: "8px 15px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: "bold", border: "2px solid #ff3366" }}>{s}</span>
            )) : <span>Blank slate</span>}
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "40px 0 20px 0", color: "#000", textTransform: "uppercase" }}>Rates</h2>
          <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#ff3366", background: "#f4f4f4", padding: "15px", textAlign: "center", border: "2px solid #000", borderRadius: "10px", transform: "rotate(-2deg)" }}>
            {portfolio.charges || "Let's Talk"}
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "40px 0 20px 0", color: "#000", textTransform: "uppercase" }}>Hit Me Up</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* <button style={{ background: "#ff3366", color: "#fff", padding: "15px", border: "2px solid #000", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "800", textTransform: "uppercase", boxShadow: "4px 4px 0 #000" }} onClick={() => window.location.href=`/dashboard/chat/${portfolio.user._id}`}>
              Chat Now
            </button>*/}
            {portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer" style={{ textAlign: "center", textDecoration: "none", color: "#000", fontWeight: "bold", border: "2px solid #000", padding: "10px", borderRadius: "10px" }}>GitHub</a>}
            {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer" style={{ textAlign: "center", textDecoration: "none", color: "#000", fontWeight: "bold", border: "2px solid #000", padding: "10px", borderRadius: "10px" }}>LinkedIn</a>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreativeBold;
