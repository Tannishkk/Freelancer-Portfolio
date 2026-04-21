const express = require("express");
const router = express.Router();

const { createPortfolio, getPortfolios, getMyPortfolio, updatePortfolio, deletePortfolio,getPortfolioById } = require("../controllers/portfolioController");
const protect = require("../middleware/authMiddleware");

// Create
router.post("/", protect, createPortfolio);

// Get all
router.get("/", getPortfolios);

// Get my portfolio
router.get("/me", protect, getMyPortfolio);

// Update
router.put("/", protect, updatePortfolio);

// Delete
router.delete("/", protect, deletePortfolio);
// Get by ID (NEW)
router.get("/:id", getPortfolioById); //  ADD THIS
// Update by ID (NEW)
router.put("/:id", protect, updatePortfolio);
module.exports = router;
