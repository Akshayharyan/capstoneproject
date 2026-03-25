const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const gameController = require("../controllers/gameController");

/* =========================================
   START GAME (Pick 15-20 MCQs)
========================================= */
router.post("/start", protect, gameController.startGame);

/* =========================================
   SUBMIT ANSWER
========================================= */
router.post("/answer", protect, gameController.submitAnswer);

/* =========================================
   GET CURRENT GAME STATE
========================================= */
router.get("/:sessionId", protect, gameController.getGameState);

/* =========================================
   GET GAME RESULTS
========================================= */
router.get("/results/:sessionId", protect, gameController.getResults);

/* =========================================
   RETRY GAME
========================================= */
router.post("/retry", protect, gameController.retryGame);

module.exports = router;
