const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: String,
  specialization: { type: [String], required: true },
  experience: Number,
  barCouncilNumber: { type: String, required: true },
  languages: [String],
  email: { type: String, required: true },
  phone: { type: String, required: true },
  availability: {
    type: String,
    enum: ["available", "limited", "unavailable"],
    default: "available"
  },
  consultationTypes: [String],
  bio: String,
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  assignedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case"
  }],
  photo: String
}, { timestamps: true });

module.exports = mongoose.model("Lawyer", lawyerSchema);
