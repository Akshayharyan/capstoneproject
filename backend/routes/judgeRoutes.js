const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { runCode } = require("../controllers/judgeController");

router.post("/run", protect, runCode);

module.exports = router;