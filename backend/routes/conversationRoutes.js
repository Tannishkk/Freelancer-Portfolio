const express = require("express");
const router = express.Router();
const { createOrGetConversation, getMyConversations, markAsRead, getGlobalUnreadCount, getMessages } = require("../controllers/conversationController");
const protect = require("../middleware/authMiddleware");

// Global unread route (must be before /:conversationId parameter logic)
router.get("/unread", protect, getGlobalUnreadCount);
router.post("/", protect, createOrGetConversation);
router.get("/", protect, getMyConversations);
router.put("/:conversationId/read", protect, markAsRead);
router.get("/:conversationId/messages", protect, getMessages);

module.exports = router;
