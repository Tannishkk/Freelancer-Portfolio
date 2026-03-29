const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// CREATE OR GET CONVERSATION
const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (!receiverId) return res.status(400).json({ message: "receiverId is required" });

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("participants", "name email");

    if (!conversation) {
      // Create it
      const unreadCounts = new Map();
      unreadCounts.set(senderId.toString(), 0);
      unreadCounts.set(receiverId.toString(), 0);

      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        unreadCounts
      });
      conversation = await Conversation.findById(conversation._id).populate("participants", "name email");
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MY CONVERSATIONS
const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate("participants", "name email")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK CONVERSATION AS READ
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Not found" });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // Reset unread count
    conversation.unreadCounts.set(userId.toString(), 0);
    await conversation.save();

    res.json({ message: "Read status updated", unreadCounts: conversation.unreadCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET UNREAD COUNT (Global)
const getGlobalUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({ participants: userId });
        let total = 0;
        conversations.forEach(c => {
            const count = c.unreadCounts.get(userId.toString());
            if (count) total += count;
        });
        res.json({ count: total });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

// GET MESSAGES FOR CONVERSATION
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { createOrGetConversation, getMyConversations, markAsRead, getGlobalUnreadCount, getMessages };
