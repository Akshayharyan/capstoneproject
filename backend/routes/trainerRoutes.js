// backend/routes/trainerRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const trainerController = require("../controllers/trainerController");

// assigned modules
router.get("/assigned", protect, trainerController.getAssignedModules);

// get module details
router.get("/module/:moduleId", protect, trainerController.getSingleModule);

// add topic
router.post("/module/:moduleId/topic", protect, trainerController.addTopic);

// create level (only level creation)
router.post("/module/:moduleId/topic/:topicIndex/level", protect, trainerController.createLevel);

// add single task to an existing level
router.post("/module/:moduleId/topic/:topicIndex/level/:levelIndex/task", protect, trainerController.addTaskToLevel);

// get tasks of a level
router.get("/module/:moduleId/topic/:topicIndex/level/:levelIndex/tasks", protect, trainerController.getLevelTasks);

// delete task
router.delete("/module/:moduleId/topic/:topicIndex/level/:levelIndex/task/:taskIndex", protect, trainerController.deleteTaskFromLevel);

module.exports = router;
