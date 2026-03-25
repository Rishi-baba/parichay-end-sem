const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);
