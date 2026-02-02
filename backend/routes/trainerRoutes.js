// backend/routes/trainerRoutes.js
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAssignedModules,
  getSingleModule,
  addTopic,
  addTaskToTopic,
  getTopicTasks,
  deleteTaskFromTopic,
  createAchievement, // ✅ import directly
} = require("../controllers/trainerController");

/* ======================================================
   TRAINER ROUTES — FINAL
====================================================== */

// Get modules assigned to trainer
router.get("/assigned", protect, getAssignedModules);

// Get module details (with topics)
router.get("/module/:moduleId", protect, getSingleModule);

// Add topic to module
router.post("/module/:moduleId/topic", protect, addTopic);

// Add task (quiz / coding) to topic
router.post(
  "/module/:moduleId/topic/:topicIndex/task",
  protect,
  addTaskToTopic
);

// Get tasks of a topic
router.get(
  "/module/:moduleId/topic/:topicIndex/tasks",
  protect,
  getTopicTasks
);

// Delete task from topic
router.delete(
  "/module/:moduleId/topic/:topicIndex/task/:taskIndex",
  protect,
  deleteTaskFromTopic
);

// 🔥 CREATE ACHIEVEMENT (TRAINER ONLY)
router.post(
  "/achievements",
  protect,              // ✅ FIXED HERE
  createAchievement
);

module.exports = router;
