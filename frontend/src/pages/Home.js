import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import MinimalLight from "../components/templates/MinimalLight";
import DarkPro from "../components/templates/DarkPro";
import CreativeBold from "../components/templates/CreativeBold";
import CorporateClassic from "../components/templates/CorporateClassic";
import ModernCard from "../components/templates/ModernCard";

const Home = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const navigate = useNavigate();

  const startChat = async (receiverId) => {
    try {
      if (!receiverId) return alert("Invalid user");
      const res = await API.post("/conversations", { receiverId });
      navigate(`/dashboard/chat?conversationId=${res.data._id}`);
    } catch (e) {
      console.error(e);
      alert("Error starting chat");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await API.get("/portfolios");
        setPortfolios(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAll();
  }, []);

  // Filter logic: matches name, role, OR any skill
  const filteredPortfolios = portfolios.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const userNameMatch = p.user?.name?.toLowerCase().includes(term);
    const portfolioNameMatch = p.name?.toLowerCase().includes(term);
    const titleMatch = p.title?.toLowerCase().includes(term);
    const skillMatch = p.skills?.some((s) => s.toLowerCase().includes(term));
    return userNameMatch || portfolioNameMatch || titleMatch || skillMatch;
  });

  // Modal Component
  const PortfolioModal = ({ portfolio, onClose }) => {
    if (!portfolio) return null;

    const templateId = portfolio.templateId || "minimalLight";

    // Instead of rendering a hardcoded white card, we render the template inside a dark overlay.
    // The overlay itself catches clicks to close if clicked outside the template card.
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 9999, padding: "20px", backdropFilter: "blur(5px)",
      }} onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        {templateId === "minimalLight" && <MinimalLight portfolio={portfolio} onClose={onClose} />}
        {templateId === "darkPro" && <DarkPro portfolio={portfolio} onClose={onClose} />}
        {templateId === "creativeBold" && <CreativeBold portfolio={portfolio} onClose={onClose} />}
        {templateId === "corporateClassic" && <CorporateClassic portfolio={portfolio} onClose={onClose} />}
        {templateId === "modernCard" && <ModernCard portfolio={portfolio} onClose={onClose} />}
      </div>
    );
  };


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden"
    }}>
      <style>
        {`
          .hero-section { padding: 80px 60px; }
          .hero-headline { font-size: 48px; }
          .cards-section { padding: 40px 60px 60px; }
          
          .navy-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(3, 1fr);
            align-items: stretch;
          }
          @media (max-width: 1024px) {
            .hero-section { padding: 60px 40px; }
            .hero-headline { font-size: 36px; }
            .navy-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 768px) {
            .hero-section { padding: 40px 20px; }
            .hero-headline { font-size: 28px; }
            .search-bar { max-width: 100% !important; }
            .navy-grid {
              grid-template-columns: repeat(1, 1fr);
            }
          }
        `}
      </style>

      {/* 1. 🦸 HERO SECTION */}
      <div className="hero-section" style={{
        width: "100%", margin: 0, boxSizing: "border-box",
        background: "#0f172a", textAlign: "center"
      }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <div style={{
            background: "rgba(59,130,246,0.15)", color: "#93c5fd",
            fontSize: "13px", padding: "6px 18px", borderRadius: "20px", marginBottom: "20px",
            border: "0.5px solid rgba(59,130,246,0.3)", fontWeight: "500", letterSpacing: "0.5px"
          }}>
            Find Verified Freelancers
          </div>

          <h1 className="hero-headline" style={{
            fontWeight: "500", lineHeight: "1.3", margin: "0 0 14px 0", letterSpacing: "-0.5px"
          }}>
            <span style={{ color: "#ffffff" }}>The smart way to hire</span><br />
            <span style={{ color: "#60a5fa" }}>freelance talent</span>
          </h1>

          <p style={{
            fontSize: "15px", color: "rgba(255,255,255,0.4)",
            lineHeight: "1.7", margin: "0 0 28px 0"
          }}>
            Post your project, get matched instantly, and start building today.
          </p>

          <div className="search-bar" style={{
            display: "flex", overflow: "hidden", borderRadius: "10px",
            background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(59,130,246,0.25)",
            margin: "0 auto", width: "100%", maxWidth: "520px", height: "48px"
          }}>
            <input
              type="text"
              placeholder="Search by name, skill or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                padding: "12px 20px", fontSize: "14px", color: "rgba(255,255,255,0.8)"
              }}
            />
            <button style={{
              background: "#3b82f6", color: "#ffffff", fontSize: "13px", fontWeight: "500",
              padding: "12px 28px", border: "none", cursor: "pointer", transition: "background 0.2s"
            }} onMouseEnter={(e) => e.target.style.background = "#2563eb"} onMouseLeave={(e) => e.target.style.background = "#3b82f6"}>
              Go
            </button>
          </div>

        </div>
      </div>

      {/* 2. 🃏 FREELANCER CARDS SECTION */}
      <div className="cards-section" style={{ width: "100%", margin: 0, boxSizing: "border-box", background: "#f0f4ff", minHeight: "60vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "18px", fontWeight: "500", color: "#0f172a" }}>Available Freelancers</div>
          </div>

          <div className="navy-grid">
            {filteredPortfolios.length > 0 ? (
              filteredPortfolios.map((p) => {
                const displayName = p.name || p.user?.name || "Freelancer";
                return (
                  <div key={p._id} style={{
                    background: "#ffffff", border: "0.5px solid #dbeafe",
                    height: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    padding: "20px", borderRadius: "12px", boxSizing: "border-box", overflow: "hidden",
                    transition: "box-shadow 0.2s"
                  }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.08)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>

                    {/* ZONE 1 — Top */}
                    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "10px", flexShrink: 0, background: "#dbeafe",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a", fontSize: "16px", fontWeight: "500", overflow: "hidden"
                      }}>
                        {p.photo ? <img src={p.photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : displayName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
                        <div style={{ fontSize: "12px", color: "#3b82f6", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title || "Professional"}</div>
                      </div>
                    </div>

                    {/* ZONE 2 — Middle */}
                    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: "8px" }}>

                      <div style={{
                        fontSize: "13px", color: "#64748b", lineHeight: "1.5", flexShrink: 0,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"
                      }}>
                        {p.experience || "Highly skilled professional ready to take on exciting projects and deliver quality work."}
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", overflow: "hidden", maxHeight: "26px" }}>
                        {p.skills?.slice(0, 4).map((s, i) => (
                          <span key={i} style={{ fontSize: "11px", padding: "4px 10px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontWeight: "500" }}>
                            {s}
                          </span>
                        ))}
                        {p.skills?.length > 4 && (
                          <span style={{ fontSize: "11px", padding: "4px 10px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontWeight: "500" }}>
                            +{p.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ZONE 3 — Bottom */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                      <button style={{
                        flex: 1, textAlign: "center", padding: "10px", background: "#0f172a", borderRadius: "8px",
                        fontSize: "12px", color: "#60a5fa", border: "none", cursor: "pointer", fontWeight: "500", transition: "background 0.2s"
                      }} onMouseEnter={(e) => { e.target.style.background = "#1e293b"; e.target.style.color = "#93c5fd"; }} onMouseLeave={(e) => { e.target.style.background = "#0f172a"; e.target.style.color = "#60a5fa"; }} onClick={() => setSelectedPortfolio(p)}>
                        View Details
                      </button>
                      
                      {/* Message Button */}
                      {(p.user?._id || p.user) && (
                        <button title="Message Freelancer" style={{
                          width: "40px", padding: "10px", background: "#e0e7ff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px", color: "#4f46e5", border: "none", cursor: "pointer", fontWeight: "500", transition: "all 0.2s"
                        }} onMouseEnter={(e) => { e.target.style.background = "#c7d2fe"; }} onMouseLeave={(e) => { e.target.style.background = "#e0e7ff"; }} onClick={(e) => { e.stopPropagation(); startChat(p.user?._id || p.user); }}>
                          💬
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: "1 / -1", fontSize: "10px", color: "#64748b", textAlign: "center", padding: "30px", background: "white", borderRadius: "10px", border: "0.5px solid #dbeafe" }}>
                No freelancers match your search.
              </div>
            )}
          </div>
        </div>
      </div>

      <PortfolioModal portfolio={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} />
    </div>
  );
};

export default Home;