const express = require("express");
const router = express.Router();
const { gradeCode } = require("../controllers/graderController");
const protect = require("../middleware/authMiddleware");

router.post("/grade", protect, gradeCode);

module.exports = router;