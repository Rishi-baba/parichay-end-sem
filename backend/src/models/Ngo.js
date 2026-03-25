const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  availability: {
    type: String,
    enum: ["available", "limited", "closed"],
    default: "available"
  },
  description: { type: String, required: true },
  services: [String],
  phone: String,
  email: String,
  website: String,
  isVerified: { type: Boolean, default: false },
  logo: String
}, { timestamps: true });

module.exports = mongoose.model("NGO", ngoSchema);
