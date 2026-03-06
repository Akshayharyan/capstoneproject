const express = require("express");
const router = express.Router();

console.log("🔥 trainerBossRoutes.js LOADED");

/* =====================================================
   TEST ROUTES (FOR DEBUGGING)
===================================================== */

// Simple GET test
router.get("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({
    success: true,
    message: "Trainer Boss route is working"
  });
});

// Simple POST test
router.post("/ping", (req, res) => {
  console.log("✅ POST TEST ROUTE HIT");
  res.json({
    success: true,
    message: "POST route working"
  });
});


/* =====================================================
   IMPORT MIDDLEWARE
===================================================== */

const protect = require("../middleware/authMiddleware");
const verifyTrainer = require("../middleware/verifyTrainer");


/* =====================================================
   IMPORT CONTROLLER FUNCTIONS
===================================================== */

const {
  createBoss,
  updateBoss,
  getBossByModule,
  addSignatureChallenge,
  getSignatureChallenges,
  deleteSignatureChallenge
} = require("../controllers/trainerBossController");


/* =====================================================
   BOSS MANAGEMENT (1 BOSS PER MODULE)
===================================================== */

// Create boss
router.post("/", protect, verifyTrainer, (req, res, next) => {
  console.log("🔥 CREATE BOSS ROUTE HIT");
  console.log("BODY:", req.body);
  next();
}, createBoss);


// Update boss
router.put("/:bossId", protect, verifyTrainer, (req, res, next) => {
  console.log("🔥 UPDATE BOSS ROUTE HIT");
  next();
}, updateBoss);


// Get boss by module
router.get("/module/:moduleId", protect, verifyTrainer, (req, res, next) => {
  console.log("🔥 GET BOSS BY MODULE ROUTE HIT");
  next();
}, getBossByModule);


/* =====================================================
   SIGNATURE CHALLENGE MANAGEMENT
===================================================== */

// Add signature challenge
router.post("/:bossId/challenge", protect, verifyTrainer, addSignatureChallenge);

// Get signature challenges
router.get("/:bossId/challenges", protect, verifyTrainer, getSignatureChallenges);

// Delete challenge
router.delete("/challenge/:challengeId", protect, verifyTrainer, deleteSignatureChallenge);


module.exports = router;