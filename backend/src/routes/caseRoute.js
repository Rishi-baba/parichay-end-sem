const express = require('express');
const { createCase } = require('../controller/caseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const Case = require('../models/case');

router.post('/create', protect, createCase);

// GET MY CASES
router.get("/my-cases", protect, async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
