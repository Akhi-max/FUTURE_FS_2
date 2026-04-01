const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
