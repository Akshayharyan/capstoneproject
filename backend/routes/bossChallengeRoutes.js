const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  generateBossChallenge,
  attackBoss,
} = require("../controllers/bossChallengeController");

router.post("/generate-challenge", protect, generateBossChallenge);
router.post("/attack", protect, attackBoss);

module.exports = router;
 