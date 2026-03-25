const Evidence = require('../models/Evidence');

// Create a new evidence record
exports.createEvidence = async (req, res) => {
  try {
    const { title, date, location, description, isPrivate } = req.body;
    
    if (!date || !location || !description) {
      return res.status(400).json({ message: "Date, location, and description are required." });
    }

    // Process uploaded files if any
    const fileUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const evidence = new Evidence({
      user: req.user._id,
      title: title || "",
      date,
      location,
      description,
      files: fileUrls,
      isPrivate: isPrivate === 'true' || isPrivate === true
    });

    const savedEvidence = await evidence.save();
    
    res.status(201).json({
      message: "Evidence saved successfully",
      evidence: savedEvidence
    });
  } catch (error) {
    console.error("Evidence Create Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
