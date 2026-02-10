const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");

const { createModule } = require("../controllers/moduleController");

const {
  getModuleTopicsWithStatus,
  getModulesWithStatus, // 🔥 IMPORTANT
} = require("../controllers/moduleProgressController");

const Module = require("../models/module");

/* ======================================================
   📌 CREATE MODULE (ADMIN ONLY)
====================================================== */
router.post("/create", protect, verifyAdmin, createModule);

/* ======================================================
   📌 GET ALL MODULES WITH STATUS (EMPLOYEE SIDE) ✅ FIX
   👉 USED BY: Employee Modules Page
   👉 URL: /api/modules/status
====================================================== */
router.get(
  "/status",
  protect,
  getModulesWithStatus
);

/* ======================================================
   📌 GET ALL MODULES (ADMIN LIST ONLY)
====================================================== */
router.get("/", protect, verifyAdmin, async (req, res) => {
  try {
    const modules = await Module.find({});

    const formatted = modules.map((m) => ({
      _id: m._id,
      title: m.title,
      description: m.description || "",
      topicCount: m.topics.length,
      totalXp: m.topics.reduce((sum, t) => sum + (t.xp || 0), 0),
    }));

    res.json({ modules: formatted });
  } catch (err) {
    console.error("Fetch modules error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   📌 GET TOPICS OF A MODULE (🔥 WITH PROGRESS & UNLOCK)
   👉 USED BY: TopicRoadmap (EMPLOYEE)
====================================================== */
router.get(
  "/:moduleId/topics",
  protect,
  getModuleTopicsWithStatus
);

/* ======================================================
   📌 GET SINGLE TOPIC (VIDEO + TASKS)
====================================================== */
router.get("/:moduleId/topics/:topicIndex", protect, async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;

    const module = await Module.findById(moduleId).lean();
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const topic = module.topics?.[Number(topicIndex)];
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({
      title: topic.title,
      videoUrl: topic.videoUrl,
      xp: topic.xp || 0,
      tasks: topic.tasks || [],
    });
  } catch (err) {
    console.error("Fetch topic error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   📌 DELETE MODULE (ADMIN ONLY)
====================================================== */
router.delete("/:moduleId", protect, verifyAdmin, async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.moduleId);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("Delete module error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
