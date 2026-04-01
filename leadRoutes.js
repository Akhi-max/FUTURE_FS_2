const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Lead = require("../models/Lead");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All lead routes require auth
router.use(authenticateToken);

// ─── GET /api/leads ───────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { source: regex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Lead.countDocuments(filter),
    ]);

    res.json({ leads, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error("Get leads error:", err);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// ─── GET /api/leads/stats ─────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const [total, newCount, contacted, converted, lost] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ status: "contacted" }),
      Lead.countDocuments({ status: "converted" }),
      Lead.countDocuments({ status: "lost" }),
    ]);

    res.json({ total, new: newCount, contacted, converted, lost });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lead" });
  }
});

// ─── POST /api/leads ──────────────────────────────────────────────────────────
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").optional().trim(),
    body("source").optional().trim(),
    body("status").optional().isIn(["new", "contacted", "converted", "lost"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, phone, source, status, notes } = req.body;

      const lead = await Lead.create({
        name,
        email,
        phone: phone || "",
        source: source || "",
        status: status || "new",
        notes: notes ? [{ text: notes }] : [],
      });

      res.status(201).json(lead);
    } catch (err) {
      console.error("Create lead error:", err);
      res.status(500).json({ message: "Failed to create lead" });
    }
  }
);

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────
router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email required"),
    body("status").optional().isIn(["new", "contacted", "converted", "lost"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, phone, source, status } = req.body;
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (source !== undefined) updateData.source = source;
      if (status !== undefined) updateData.status = status;

      const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!lead) return res.status(404).json({ message: "Lead not found" });
      res.json(lead);
    } catch (err) {
      console.error("Update lead error:", err);
      res.status(500).json({ message: "Failed to update lead" });
    }
  }
);

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lead" });
  }
});

// ─── POST /api/leads/:id/notes ────────────────────────────────────────────────
router.post("/:id/notes", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { text: text.trim() } } },
      { new: true }
    );

    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Failed to add note" });
  }
});

// ─── DELETE /api/leads/:id/notes/:noteId ──────────────────────────────────────
router.delete("/:id/notes/:noteId", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
