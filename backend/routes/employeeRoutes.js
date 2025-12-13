// backend/routes/employeeRoutes.js


const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const employeeController = require("../controllers/employeeController");


// Get levels for topic (used to build roadmap)
router.get("/module/:moduleId/topics/:topicIndex/levels", protect, employeeController.getLevelsForTopic);

// Get single level data (for player)
router.get("/module/:moduleId/topics/:topicIndex/levels/:levelIndex", protect, employeeController.getSingleLevel);

// Mark level complete
router.post("/module/:moduleId/topics/:topicIndex/levels/:levelIndex/complete", protect, employeeController.completeLevel);

module.exports = router;
