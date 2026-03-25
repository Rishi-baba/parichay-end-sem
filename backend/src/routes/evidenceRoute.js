const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createEvidence } = require('../controller/evidenceController');
const { protect } = require('../middleware/authMiddleware');
const Evidence = require('../models/Evidence');

// Set up Multer storage
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/create', protect, upload.array('files', 10), createEvidence);

// GET MY EVIDENCE
router.get("/my-evidence", protect, async (req, res) => {
  try {
    const evidence = await Evidence.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(evidence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ATTACH EVIDENCE TO CASE
router.post("/attach-to-case", protect, async (req, res) => {
  try {
    const { evidenceId, caseId } = req.body;
    
    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    // Ensure the user owns this evidence
    if (evidence.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this evidence" });
    }

    evidence.case = caseId;
    await evidence.save();

    res.json({ message: "Evidence linked to case successfully", evidence });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE EVIDENCE
router.get("/:id", protect, async (req, res) => {
  try {
    const evidence = await Evidence.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!evidence) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    res.json(evidence);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: "Invalid evidence ID" });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE EVIDENCE
router.delete("/:id", protect, async (req, res) => {
  try {
    const evidence = await Evidence.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!evidence) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
