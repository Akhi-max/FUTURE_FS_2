const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new",
    },
    notes: [noteSchema],
  },
  { timestamps: true }
);

// Text index for search
leadSchema.index({ name: "text", email: "text", phone: "text", source: "text" });

module.exports = mongoose.model("Lead", leadSchema);
