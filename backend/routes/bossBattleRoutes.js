const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const bossController = require("../controllers/bossBattleController");


console.log("Boss Controller:", bossController);


router.post("/start-boss", protect, bossController.startBossFight);
router.post("/damage-boss", protect, bossController.damageBoss);

module.exports = router;
