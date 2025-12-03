const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Activity = require("../models/activity");

// Get last 10 activities of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
