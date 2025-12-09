const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Module = require("../models/module");


// ===============================
// 📌 GET ALL MODULES
// ===============================
router.get("/", protect, async (req, res) => {
  try {
    const modules = await Module.find({}, "title description");
    res.json({ modules });
  } catch (err) {
    console.error("Fetch modules error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// 📌 GET TOPICS OF A MODULE
// ===============================
// GET /api/modules/:moduleId/topics
router.get("/:moduleId/topics", protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    res.json({
      moduleTitle: module.title,
      topics: module.topics.map((t, index) => ({
        id: index,
        title: t.title,
        levelCount: t.levels.length,
      })),
    });
  } catch (err) {
    console.error("Fetch topics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// 📌 GET LEVELS OF A TOPIC
// ===============================
// GET /api/modules/:moduleId/topics/:topicIndex/levels
router.get("/:moduleId/topics/:topicIndex/levels", protect, async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.json({
      topicTitle: topic.title,
      levels: topic.levels.map((lv) => ({
        id: lv._id,
        number: lv.number,
        title: lv.title,
        taskType: lv.taskType,
        xp: lv.xp,
      })),
    });
  } catch (err) {
    console.error("Fetch levels error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// 📌 GET FULL LEVEL DATA
// (for future — reading + quiz/coding)
// ===============================
// GET /api/levels/:levelId
router.get("/level/:levelId", protect, async (req, res) => {
  try {
    const levelId = req.params.levelId;
    const module = await Module.findOne({ "topics.levels._id": levelId });

    if (!module) return res.status(404).json({ message: "Level not found" });

    // Locate level inside nested structure
    for (const topic of module.topics) {
      const level = topic.levels.id(levelId);
      if (level) return res.json(level);
    }

    res.status(404).json({ message: "Level not found" });
  } catch (err) {
    console.error("Fetch level error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
