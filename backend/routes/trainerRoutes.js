// backend/routes/traineeRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const traineeController = require("../controllers/traineeController");

// assigned modules
router.get("/assigned", protect, traineeController.getAssignedModules);

// get module details
router.get("/module/:moduleId", protect, traineeController.getSingleModule);

// add topic
router.post("/module/:moduleId/topic", protect, traineeController.addTopic);

// create level (only level creation)
router.post("/module/:moduleId/topic/:topicIndex/level", protect, traineeController.createLevel);

// add single task to an existing level
router.post("/module/:moduleId/topic/:topicIndex/level/:levelIndex/task", protect, traineeController.addTaskToLevel);

// get tasks of a level
router.get("/module/:moduleId/topic/:topicIndex/level/:levelIndex/tasks", protect, traineeController.getLevelTasks);

// delete task
router.delete("/module/:moduleId/topic/:topicIndex/level/:levelIndex/task/:taskIndex", protect, traineeController.deleteTaskFromLevel);

module.exports = router;
