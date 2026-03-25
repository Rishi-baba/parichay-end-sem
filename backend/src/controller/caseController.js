const Case = require("../models/case");

const createCase = async (req, res) => {
  try {
    const { title, category, urgency } = req.body;
    
    if (!title || !category || !urgency) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!["low", "moderate", "high"].includes(urgency)) {
      return res.status(400).json({ success: false, message: "Invalid urgency level" });
    }

    const newCase = new Case({
      user: req.user._id,
      title,
      category,
      urgency
    });

    await newCase.save();

    res.status(201).json({ success: true, case: newCase });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createCase
};
