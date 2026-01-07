const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");

const { createModule } = require("../controllers/moduleController");
const Module = require("../models/module");

/* ======================================================
   📌 CREATE MODULE (ADMIN ONLY)
====================================================== */
router.post("/create", protect, verifyAdmin, createModule);

/* ======================================================
   📌 GET ALL MODULES
   ✅ Used by:
      - Admin Assign Module
      - Employee Modules Page
====================================================== */
router.get("/", protect, async (req, res) => {
  try {
    const modules = await Module.find({});

    const formatted = modules.map((m) => ({
      _id: m._id, // ✅ KEEP _id (VERY IMPORTANT)
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
   📌 GET TOPICS OF A MODULE (Learning Path Page)
====================================================== */
router.get("/:moduleId/topics", protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json({
      moduleId: module._id,
      moduleTitle: module.title,
      topics: module.topics.map((topic, index) => ({
  index,
  title: topic.title,
  videoUrl: topic.videoUrl,   // ✅ REQUIRED
  xp: topic.xp || 0,
  videoDuration: topic.videoDuration || "",
  taskCount: topic.tasks.length,
}))

    });
  } catch (err) {
    console.error("Fetch topics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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

    // 🔥 IMPORTANT: RETURN TASKS DIRECTLY FROM DB
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

/* ======================================================
   EXPORT ROUTER
====================================================== */
module.exports = router;
