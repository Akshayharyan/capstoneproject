console.log("🔥 bossRoutes loaded");

const express = require("express");
const router = express.Router();
const Boss = require("../models/Boss");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  const bosses = await Boss.find();
  res.json(bosses);
});

module.exports = router;
