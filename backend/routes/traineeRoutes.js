const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const Assignment = require("../models/Assignment");
const Module = require("../models/module");

// 📌 1) Get trainee assigned modules
router.get("/assigned", protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ trainee: req.user._id })
      .populate("module");

    const formatted = assignments.map(a => ({
      assignmentId: a._id,
      moduleId: a.module._id,
      title: a.module.title,
      description: a.module.description,
      topicsCount: a.module.topics.length,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 2) Get module details (topics + levels)
router.get("/module/:id", protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });

    res.json(module);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 3) Add a Topic to a Module
router.post("/module/:id/topic", protect, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });

    module.topics.push({ title, levels: [] });
    await module.save();

    res.json({ message: "Topic added", module });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 4) Add Level inside Topic
router.post("/module/:id/topic/:topicIndex/level", protect, async (req, res) => {
  try {
    const { title, number, taskType, xp } = req.body;
    const { id, topicIndex } = req.params;

    const module = await Module.findById(id);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    topic.levels.push({
      title,
      number,
      taskType,
      xp
    });

    await module.save();

    res.json({ message: "Level added", module });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
