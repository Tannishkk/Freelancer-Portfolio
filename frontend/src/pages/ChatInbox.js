import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import API from "../services/api";

const socket = io("http://localhost:5000");

const ChatInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [userPhotos, setUserPhotos] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Join personal room for updates
    if (userId) {
      socket.emit("joinPersonalRoom", userId);
    }

    const fetchPortfolios = async () => {
      try {
        const res = await API.get("/portfolios");
        const map = {};
        res.data.forEach((p) => {
          const uId = p.user?._id || p.user;
          if (uId) map[uId] = p.photo;
        });
        setUserPhotos(map);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPortfolios();

    const fetchConversations = async () => {
      try {
        const res = await API.get("/conversations");
        setConversations(res.data);
        
        // Open specifically passed conversation
        const queryParams = new URLSearchParams(location.search);
        const autoOpenId = queryParams.get("conversationId");
        if (autoOpenId) {
          const conv = res.data.find((c) => c._id === autoOpenId);
          if (conv) openConversation(conv);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchConversations();

    socket.on("conversationUpdated", ({ conversationId, message, unreadCounts }) => {
      let isNew = false;
      // Best to update state to bump it
      setConversations((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((c) => String(c._id) === String(conversationId));
        if (idx !== -1) {
          updated[idx].lastMessage = message;
          updated[idx].lastMessageAt = message.createdAt;
          updated[idx].unreadCounts = unreadCounts;
          // Sort
          return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        } else {
          // Identify new conversation
          isNew = true;
          return prev;
        }
      });
      if (isNew) fetchConversations();
      // Fire global update for Navbar
      window.dispatchEvent(new Event('chatReadObj'));
    });

    return () => {
      socket.off("conversationUpdated");
    };
  }, [userId, location.search]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (selectedConv && msg.conversationId === selectedConv._id) {
        setMessages((prev) => [...prev, msg]);
        markRead(selectedConv._id);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConv]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const markRead = async (convId) => {
    try {
      const res = await API.put(`/conversations/${convId}/read`);
      // Update local unread count
      setConversations(prev => prev.map(c => {
        if (c._id === convId) {
            c.unreadCounts = res.data.unreadCounts;
        }
        return c;
      }));
      // trigger a custom event so navbar can sync
      window.dispatchEvent(new Event('chatReadObj'));
    } catch (e) {
      console.error(e);
    }
  };

  const openConversation = async (conv) => {
    setSelectedConv(conv);
    socket.emit("joinRoom", conv._id);
    try {
      const res = await API.get(`/conversations/${conv._id}/messages`);
      setMessages(res.data);
      if (conv.unreadCounts && conv.unreadCounts[userId] > 0) {
        markRead(conv._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = () => {
    if (!text.trim() || !selectedConv) return;
    let otherUser = selectedConv.participants.find((p) => String(p._id) !== String(userId));
    if (!otherUser) otherUser = selectedConv.participants[0];
    
    socket.emit("sendMessage", {
      conversationId: selectedConv._id,
      roomId: selectedConv._id,
      message: text,
      sender: userId,
      receiver: otherUser._id,
    });
    setText("");
  };

  const filteredConversations = conversations.filter((c) => {
    let other = c.participants.find((p) => String(p._id) !== String(userId));
    if (!other && c.participants.length > 0) other = c.participants[0]; // Self-chat fallback
    if (!other) return false;
    return (other.name || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: "flex", height: "calc(100vh - 72px)", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      
      {/* LEFT PANEL */}
      {(!isMobile || !selectedConv) && (
        <div style={{ width: isMobile ? "100%" : "320px", background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}>
            <h2 style={{ margin: "0 0 15px 0", fontSize: "1.2rem", fontWeight: "600", color: "#0f172a" }}>Messages</h2>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredConversations.length === 0 && (
             <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
               No chats yet. Browse freelancers and start a conversation.
             </div>
          )}
          {filteredConversations.map((c) => {
            let other = c.participants.find((p) => String(p._id) !== String(userId));
            if (!other) other = c.participants[0];
            const myUnread = c.unreadCounts && c.unreadCounts[userId] ? c.unreadCounts[userId] : 0;
            const isSelected = selectedConv?._id === c._id;
            const photo = userPhotos[other._id];

            return (
              <div 
                key={c._id} 
                onClick={() => openConversation(c)}
                style={{ 
                  display: "flex", padding: "16px 20px", cursor: "pointer", gap: "12px",
                  background: isSelected ? "#eff6ff" : "transparent",
                  borderBottom: "1px solid #f1f5f9", transition: "background 0.2s"
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Avatar */}
                <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", flexShrink: 0, overflow: "hidden" }}>
                  {photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (other.name?.[0] || 'U').toUpperCase()}
                </div>
                
                {/* Content */}
                <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{other.name || "User"}</span>
                    {c.lastMessageAt && (
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", flexShrink: 0 }}>
                        {new Date(c.lastMessageAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.lastMessage ? c.lastMessage.text : "New Chat"}
                    </span>
                    {myUnread > 0 && (
                      <span style={{ background: "#ef4444", color: "white", fontSize: "0.7rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px" }}>
                        {myUnread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* RIGHT PANEL */}
      {(!isMobile || selectedConv) && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white" }}>
          {selectedConv ? (
            <>
              {/* Header */}
            <div style={{ padding: "20px 30px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px" }}>
              {isMobile && (
                <button 
                  onClick={() => setSelectedConv(null)}
                  style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", marginRight: "10px", color: "#4f46e5" }}>
                  ← Back
                </button>
              )}
              {(() => {
                 let other = selectedConv.participants.find((p) => String(p._id) !== String(userId));
                 if (!other) other = selectedConv.participants[0];
                 const photo = userPhotos[other?._id];
                 return (
                   <>
                     <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", overflow: "hidden" }}>
                       {photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (other?.name?.[0] || 'U').toUpperCase()}
                     </div>
                     <div>
                       <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>{other?.name || "User"}</h3>
                     </div>
                   </>
                 );
              })()}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: "30px", overflowY: "auto", background: "#f8fafc" }}>
              {messages.map((msg, idx) => {
                const isMine = msg.sender === userId;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                    <div style={{
                      maxWidth: "65%", padding: "12px 16px", borderRadius: "16px",
                      background: isMine ? "#3b82f6" : "white",
                      color: isMine ? "white" : "#1e293b",
                      border: isMine ? "none" : "1px solid #e2e8f0",
                      borderBottomRightRadius: isMine ? "4px" : "16px",
                      borderBottomLeftRadius: isMine ? "16px" : "4px",
                      lineHeight: "1.4"
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px", padding: "0 4px" }}>
                      {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "20px 30px", borderTop: "1px solid #e2e8f0", background: "white", display: "flex", gap: "15px" }}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "12px 20px", borderRadius: "24px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem", background: "#f8fafc" }}
              />
              <button 
                onClick={sendMessage}
                style={{ background: "#4f46e5", color: "white", border: "none", padding: "0 24px", borderRadius: "24px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.target.style.background = "#4338ca"}
                onMouseLeave={(e) => e.target.style.background = "#4f46e5"}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", background: "#f8fafc" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>💬</div>
              <h3 style={{ margin: "0 0 10px 0", color: "#475569" }}>Your Messages</h3>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>Select a conversation from the left to start chatting.</p>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default ChatInbox;
