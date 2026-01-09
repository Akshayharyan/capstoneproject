const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { gradeCodingTask } = require("../controllers/graderController");

/* ======================================================
   📌 AUTO GRADER – CODING TASK
====================================================== */
router.post("/grade", protect, gradeCodingTask);

module.exports = router;
