const Portfolio = require("../models/Portfolio");

// CREATE
const createPortfolio = async (req, res) => {
    try {
        const { templateId, name, title, photo, charges, github, linkedin, skills, experience, projects } = req.body;

        const portfolio = await Portfolio.create({
            user: req.user.id,
            templateId,
            name,
            title,
            photo,
            charges,
            github,
            linkedin,
            skills,
            experience,
            projects
        });

        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL
const getPortfolios = async (req, res) => {
    const portfolios = await Portfolio.find().populate("user", "name email");
    res.json(portfolios);
};
// GET single portfolio by ID
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY PORTFOLIO (NEW)
const getMyPortfolio = async (req, res) => {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
        return res.status(404).json({ message: "No portfolio found" });
    }

    res.json(portfolio);
};
// UPDATE (NEW)
const updatePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true }
        );

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// DELETE (NEW)
const deletePortfolio = async (req, res) => {
    const portfolio = await Portfolio.findOneAndDelete({ user: req.user.id });

    if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json({ message: "Portfolio deleted" });
};

// ✅ EXPORT AT END
module.exports = {
  createPortfolio,
  getPortfolios,
  getMyPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolioById   
};