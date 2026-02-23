const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getAssignedModules,
  getSingleModule,
  addTopic,

  /* TASK MANAGEMENT */
  addTaskToTopic,
  updateTaskInTopic,
  getTopicTasks,
  deleteTaskFromTopic,
  addTestCase,

  /* ACHIEVEMENTS & BOSS */
  createAchievement,
  assignBossToModule
} = require("../controllers/trainerController");

/* =====================================================
   MODULE ROUTES
===================================================== */

// Get modules assigned to trainer
router.get("/assigned", protect, getAssignedModules);

// Get single module with topics
router.get("/module/:moduleId", protect, getSingleModule);

// Add topic to module
router.post("/module/:moduleId/topic", protect, addTopic);


/* =====================================================
   TASK ROUTES
===================================================== */

// Get all tasks inside a topic
router.get(
  "/module/:moduleId/topic/:topicIndex/tasks",
  protect,
  getTopicTasks
);

// Add new task (quiz / coding / bugfix)
router.post(
  "/module/:moduleId/topic/:topicIndex/task",
  protect,
  addTaskToTopic
);

// ✏️ Edit existing task
router.put(
  "/module/:moduleId/topic/:topicIndex/task/:taskIndex",
  protect,
  updateTaskInTopic
);

// 🗑 Delete task
router.delete(
  "/module/:moduleId/topic/:topicIndex/task/:taskIndex",
  protect,
  deleteTaskFromTopic
);

// ➕ Add test case to coding task
router.post(
  "/module/:moduleId/topic/:topicIndex/task/:taskIndex/testcase",
  protect,
  addTestCase
);
router.put(
  "/module/:moduleId/topic/:topicIndex/task/:taskIndex",
  protect,
  updateTaskInTopic
);

/* =====================================================
   ACHIEVEMENTS & BOSS
===================================================== */

// Create achievement
router.post("/achievements", protect, createAchievement);

// Assign boss to module
router.post(
  "/module/:moduleId/assign-boss",
  protect,
  assignBossToModule
);

module.exports = router;