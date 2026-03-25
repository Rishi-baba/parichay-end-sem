const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// POST /api/upload
// Returns the URL of the uploaded file
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(201).json({ url: fileUrl });
});

module.exports = router;
