const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const Message = require("./models/Message");

const app = express();

// 🔥 MIDDLEWARE
app.use(express.json());
app.use(cors());

// 🔥 CONNECT DB
connectDB();

// 🔥 ROUTES
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/portfolios", require("./routes/portfolioRoutes"));
app.use("/api/messages", require("./routes/messageRoutes")); // ✅ for chat history
app.use("/api/conversations", require("./routes/conversationRoutes")); // ✅ for Inbox UI

app.get("/", (req, res) => {
  res.send("API running...");
});

// 🔥 SOCKET SETUP
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // ✅ JOIN ROOM (Chat Window)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("📥 Joined room:", roomId);
  });

  // ✅ JOIN PERSONAL ROOM (For global unread notifications)
  socket.on("joinPersonalRoom", (userId) => {
    socket.join(userId.toString());
    console.log("📥 Joined personal room:", userId);
  });

  // ✅ SEND MESSAGE
  socket.on("sendMessage", async ({ conversationId, roomId, message, sender, receiver }) => {
    try {
      console.log("📤 sendMessage triggered");

      if (!receiver) {
        console.log("❌ Receiver missing");
        return;
      }

      // ✅ SAVE MESSAGE IN DB
      const savedMessage = await Message.create({
        sender,
        receiver,
        text: message,
        conversationId,
      });

      console.log("💾 Message saved");

      // ✅ UPDATE CONVERSATION
      if (conversationId) {
        const Conversation = require("./models/Conversation");
        let conv = await Conversation.findById(conversationId);
        if (conv) {
          conv.lastMessage = savedMessage._id;
          conv.lastMessageAt = savedMessage.createdAt;
          // Increment unread count for receiver
          let count = conv.unreadCounts.get(receiver.toString()) || 0;
          conv.unreadCounts.set(receiver.toString(), count + 1);
          await conv.save();

          // ✅ EMIT TO RECEIVER'S PERSONAL ROOM (update their unread counts globally)
          io.to(receiver.toString()).emit("conversationUpdated", {
            conversationId,
            message: savedMessage,
            unreadCounts: conv.unreadCounts,
          });
          
          // Emit to sender personal room too so their conversation list bumps to top
          io.to(sender.toString()).emit("conversationUpdated", {
            conversationId,
            message: savedMessage,
            unreadCounts: conv.unreadCounts,
          });
        }
      }

      // ✅ SEND TO ROOM (Active Chat window)
      io.to(roomId).emit("receiveMessage", {
        ...savedMessage._doc,
      });

    } catch (err) {
      console.log("❌ Error:", err.message);
    }
  });

  // ✅ DISCONNECT
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 🔥 START SERVER
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});