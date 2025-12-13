const Module = require("../models/module");
const Progress = require("../models/progress");
const User = require("../models/User");

// -----------------------------
// GET LEVELS FOR A TOPIC
// -----------------------------
const getLevelsForTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const levels = topic.levels.map((lv, idx) => ({
      id: lv._id,
      index: idx,
      number: lv.number || idx + 1,
      title: lv.title,
      xp: lv.xp || 0,
      taskCount: lv.tasks?.length || 0,
    }));

    res.json({
      moduleTitle: module.title,
      topicTitle: topic.title,
      levels,
    });
  } catch (err) {
    console.error("getLevelsForTopic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// GET SINGLE LEVEL
// -----------------------------
const getSingleLevel = async (req, res) => {
  try {
    const { moduleId, topicIndex, levelIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const level = topic.levels[levelIndex];
    if (!level) return res.status(404).json({ message: "Level not found" });

    res.json(level);
  } catch (err) {
    console.error("getSingleLevel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// COMPLETE LEVEL (FINAL FIX)
// -----------------------------
const completeLevel = async (req, res) => {
  try {
    const { moduleId, topicIndex, levelIndex } = req.params;
    const userId = req.user._id;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const level = topic.levels[levelIndex];
    if (!level) return res.status(404).json({ message: "Level not found" });

    let progress = await Progress.findOne({ userId });

    // 🔐 HARD SAFETY: initialize everything
    if (!progress) {
      progress = new Progress({
        userId,
        completedQuests: [],
        completedModules: [],
      });
    }

    // 🔐 CRITICAL FIX: ensure array exists (for old records)
    if (!Array.isArray(progress.completedQuests)) {
      progress.completedQuests = [];
    }

    const alreadyCompleted = progress.completedQuests.some(
      (q) => q.questId?.toString() === level._id.toString()
    );

    if (alreadyCompleted) {
      return res.json({
        message: "Level already completed",
        xpAwarded: 0,
      });
    }

    progress.completedQuests.push({
      moduleId,
      questId: level._id,
    });

    await progress.save();

    const xpAwarded = Number(level.xp) || 0;

    await User.findByIdAndUpdate(userId, {
      $inc: { xp: xpAwarded },
    });

    res.json({
      success: true,
      xpAwarded,
    });
  } catch (err) {
    console.error("completeLevel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLevelsForTopic,
  getSingleLevel,
  completeLevel,
};
