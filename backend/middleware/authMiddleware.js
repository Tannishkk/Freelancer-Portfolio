const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secret"); // ⚠️ must match login

    req.user = { id: decoded.id }; // ✅ VERY IMPORTANT

    next();
  } catch (err) {
    console.log("❌ AUTH ERROR:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};