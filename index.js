require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mini CRM API is running 🚀" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ─── Database + Start ─────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`\n🔥 Mini CRM Backend running on http://localhost:${PORT}`);
      console.log(`📋 Admin credentials: admin@samr.com / admin123\n`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ─── Seed Default Admin ───────────────────────────────────────────────────────
async function seedAdmin() {
  const User = require("./models/User");
  const bcrypt = require("bcryptjs");

  const existing = await User.findOne({ email: "admin@samr.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "AKHIL Admin",
      email: "admin@puneethreos.com",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Default admin seeded: admin@samr.com / admin123");
  }
}
