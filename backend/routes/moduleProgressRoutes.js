const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getModulesWithStatus,
  startModule,
  getStartedModules,
  completeTopic, // 🆕
  completeVideo,
   completeQuiz,
} = require("../controllers/moduleProgressController");

// EXISTING ROUTES (UNCHANGED)
router.get("/modules/status", protect, getModulesWithStatus);
router.post("/modules/start", protect, startModule);
router.get("/dashboard/started-modules", protect, getStartedModules);

// 🆕 COMPLETE TOPIC + XP
router.post("/modules/complete-topic", protect, completeTopic);
router.post("/modules/complete-video", protect, completeVideo);

router.post("/modules/complete-quiz", protect, completeQuiz);


module.exports = router;
