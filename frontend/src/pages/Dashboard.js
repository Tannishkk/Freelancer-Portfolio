import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    socket.emit("joinPersonalRoom", userId);

    const fetchUnread = async () => {
      try {
        const res = await API.get("/conversations/unread");
        setUnreadCount(res.data.count);
      } catch (e) {
        console.error("Error fetching unread count", e);
      }
    };
    fetchUnread();

    socket.on("conversationUpdated", () => {
      fetchUnread();
    });

    const handleLocalRead = () => fetchUnread();
    window.addEventListener("chatReadObj", handleLocalRead);

    return () => {
      socket.off("conversationUpdated");
      window.removeEventListener("chatReadObj", handleLocalRead);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top Navbar */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderRadius: 0,
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
        }}
      >
        <h3 style={{ margin: 0, color: "var(--primary)", fontWeight: "700" }}>Freelance</h3>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span
            style={{ cursor: "pointer", fontWeight: "500", color: "var(--text-main)", transition: "color 0.2s" }}
            onClick={() => navigate("/dashboard/home")}
            onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
            onMouseLeave={(e) => e.target.style.color = "var(--text-main)"}
          >
            Home
          </span>

          <span
            style={{ cursor: "pointer", fontWeight: "500", color: "var(--text-main)", transition: "color 0.2s" }}
            onClick={() => navigate("/dashboard/profile")}
            onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
            onMouseLeave={(e) => e.target.style.color = "var(--text-main)"}
          >
            Profile
          </span>

          <div
            style={{ position: "relative", cursor: "pointer", fontWeight: "500", color: "var(--text-main)", transition: "color 0.2s" }}
            onClick={() => navigate("/dashboard/chat")}
            onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
            onMouseLeave={(e) => e.target.style.color = "var(--text-main)"}
          >
            Chat
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-8px", right: "-12px", background: "#EF4444", color: "white",
                fontSize: "0.65rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px"
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#EF4444",
              border: "1px solid #EF4444",
              borderRadius: "var(--radius)",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#EF4444"; e.target.style.color = "white"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#EF4444"; }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, width: "100%", margin: 0, padding: 0, boxSizing: "border-box" }}>
        <Outlet />  {/* 🔥 THIS RENDERS CHILD PAGES */}
      </div>
    </div>
  );
};

export default Dashboard;