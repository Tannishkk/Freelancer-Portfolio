import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import API from "../services/api";

const socket = io("https://freelancer-portfolio-9i0k.onrender.com");

const Chat = () => {
  const { id } = useParams(); // receiverId
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userPhotos, setUserPhotos] = useState({});

  const senderId = localStorage.getItem("userId");

  // Create unique room
  const room = [senderId, id].sort().join("_");
  console.log("ROOM:", room);

  useEffect(() => {
    // fetch user photos
    const fetchPhotos = async () => {
      try {
        const res = await API.get("/portfolios");
        const map = {};
        res.data.forEach((p) => {
          const uId = p.user?._id || p.user;
          if (uId) {
            map[uId] = p.photo;
          }
        });
        setUserPhotos(map);
      } catch (err) {
        console.error("Error fetching portfolios for photos:", err);
      }
    };
    fetchPhotos();

    // fetch existing messages
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${senderId}/${id}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (senderId && id) {
      fetchMessages();
    }

    // join room
    socket.emit("joinRoom", room);

    // listen messages
    socket.on("receiveMessage", (data) => {
      console.log("Received:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [room, senderId, id]);
 

 const sendMessage = () => {
  if (!message.trim()) return;

  socket.emit("sendMessage", {
    roomId: room,      //  match backend
    message: message,  // match backend
    sender: senderId,
    receiver: id,
  });


  setMessage("");
};
return (
  <div style={{ padding: "20px" }}>
    <h2>Chat</h2>

    <div
      style={{
        height: "400px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        background: "#f9f9f9",
      }}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: msg.sender === senderId ? "row-reverse" : "row",
            alignItems: "flex-end",
            margin: "15px 0",
            gap: "10px",
          }}
        >
          {/* Profile Photo */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1e3a8a",
              fontWeight: "600",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {userPhotos[msg.sender] ? (
              <img
                src={userPhotos[msg.sender]}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "U"
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.sender === senderId ? "flex-end" : "flex-start",
              maxWidth: "70%",
            }}
          >
            {/* Chat Bubble */}
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "15px",
                background: msg.sender === senderId ? "#007bff" : "#e5e5ea",
                color: msg.sender === senderId ? "white" : "black",
                borderBottomRightRadius: msg.sender === senderId ? "0" : "15px",
                borderBottomLeftRadius: msg.sender === senderId ? "15px" : "0",
              }}
            >
              {msg.text}
            </span>

            {/* Timestamp */}
            <span
              style={{
                fontSize: "10px",
                color: "#888",
                marginTop: "4px",
                padding: "0 4px",
              }}
            >
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", gap: "10px" }}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flex: 1, padding: "10px" }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: "10px 15px",
          background: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  </div>
);
};

export default Chat;
