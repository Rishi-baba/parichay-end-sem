const express = require("express");
const router = express.Router();
const NGO = require("../models/Ngo");
const Lawyer = require("../models/Lawyer");

// Public NGO endpoints
router.get("/", async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Public Lawyer endpoints
router.get("/lawyers/all", async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/lawyers/:id", async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
