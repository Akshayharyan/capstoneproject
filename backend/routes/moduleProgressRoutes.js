const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getModulesWithStatus,
  startModule,
  getStartedModules,
  completeTopic, // 🆕
} = require("../controllers/moduleProgressController");

// EXISTING ROUTES (UNCHANGED)
router.get("/modules/status", protect, getModulesWithStatus);
router.post("/modules/start", protect, startModule);
router.get("/dashboard/started-modules", protect, getStartedModules);

// 🆕 COMPLETE TOPIC + XP
router.post("/modules/complete-topic", protect, completeTopic);

module.exports = router;
