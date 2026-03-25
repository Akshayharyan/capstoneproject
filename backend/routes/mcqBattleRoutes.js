const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const mcqBattleController = require("../controllers/mcqBattleController");

/* =========================================
   START MCQ BATTLE
========================================= */
router.post("/start", protect, mcqBattleController.startMCQBattle);

/* =========================================
   GET CURRENT BATTLE STATE
========================================= */
router.get("/:moduleId", protect, mcqBattleController.getBattleState);

/* =========================================
   SUBMIT ANSWER
========================================= */
router.post("/answer", protect, mcqBattleController.submitAnswer);

/* =========================================
   GET BATTLE RESULTS
========================================= */
router.get("/results/:moduleId", protect, mcqBattleController.getBattleResults);

/* =========================================
   RETRY BATTLE
========================================= */
router.post("/retry", protect, mcqBattleController.retryBattle);

module.exports = router;
