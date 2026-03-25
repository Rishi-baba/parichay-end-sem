const User = require("../models/user");
const Case = require("../models/case");
const Evidence = require("../models/Evidence");
const Lawyer = require("../models/Lawyer");
const NGO = require("../models/Ngo");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting user" });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching cases" });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) return res.status(404).json({ message: "Case not found" });
    res.json({ message: "Case deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting case" });
  }
};

exports.getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find()
      .populate("user", "name email")
      .populate("case", "title")
      .sort({ createdAt: -1 });
    res.json(evidence);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching evidence" });
  }
};

exports.deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });
    res.json({ message: "Evidence deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting evidence" });
  }
};

exports.createLawyer = async (req, res) => {
  try {
    const lawyer = await Lawyer.create(req.body);
    res.status(201).json(lawyer);
  } catch (err) {
    console.error("Error creating lawyer:", err);
    res.status(500).json({ error: err.message || "Failed to create lawyer" });
  }
};

exports.createNgo = async (req, res) => {
  try {
    const ngo = await NGO.create(req.body);
    res.status(201).json(ngo);
  } catch (err) {
    console.error("Error creating NGO:", err);
    res.status(500).json({ error: err.message || "Failed to create NGO" });
  }
};

exports.getLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching lawyers" });
  }
};

exports.deleteLawyer = async (req, res) => {
  try {
    await Lawyer.findByIdAndDelete(req.params.id);
    res.json({ message: "Lawyer removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting lawyer" });
  }
};

exports.getNgos = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching NGOs" });
  }
};

exports.deleteNgo = async (req, res) => {
  try {
    await NGO.findByIdAndDelete(req.params.id);
    res.json({ message: "NGO removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting NGO" });
  }
};
