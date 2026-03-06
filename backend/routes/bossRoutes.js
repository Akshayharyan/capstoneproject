const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const bossController = require("../controllers/bossController");

/* =========================================
   START OR RESUME BATTLE
========================================= */
router.post("/start", protect, bossController.startBattle);

/* =========================================
   GET CURRENT BATTLE STATE
========================================= */
router.get("/:moduleId", protect, bossController.getBattleState);

/* =========================================
   GENERATE TURN CHALLENGE
========================================= */
router.post("/challenge", protect, bossController.generateTurnChallenge);

/* =========================================
   ATTACK BOSS
========================================= */
router.post("/attack", protect, bossController.attackBoss);

/* =========================================
   RETRY BATTLE
========================================= */
router.post("/retry", protect, bossController.retryBattle);

module.exports = router;