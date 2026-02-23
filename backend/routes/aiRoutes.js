const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  generateAndSaveTestCases,
} = require("../controllers/aiController");

/* ================= TEST CASE ROUTE ================= */

router.post(
  "/generate-testcases/:moduleId/:topicIndex/:taskIndex",
  protect,
  generateAndSaveTestCases
);

module.exports = router;