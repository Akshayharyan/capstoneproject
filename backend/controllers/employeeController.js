const Module = require("../models/module");
const Progress = require("../models/progress");
const User = require("../models/User");

// -----------------------------
// GET LEVELS FOR A TOPIC
// -----------------------------
const getLevelsForTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;
    const userId = req.user._id;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    let progress = await Progress.findOne({ userId });

    const completedLevels = progress?.completedLevels || [];

    const levels = topic.levels.map((lv, idx) => {
      const completed = completedLevels.some(
        (l) =>
          String(l.moduleId) === String(moduleId) &&
          l.topicIndex === Number(topicIndex) &&
          l.levelNumber === idx
      );

      const unlocked =
        idx === 0 ||
        completedLevels.some(
          (l) =>
            String(l.moduleId) === String(moduleId) &&
            l.topicIndex === Number(topicIndex) &&
            l.levelNumber === idx - 1
        );

      return {
        id: lv._id,
        index: idx,
        number: lv.number || idx + 1,
        title: lv.title,
        xp: lv.xp || 0,
        completed,
        unlocked,
      };
    });

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
// COMPLETE LEVEL (IDEMPOTENT + SAFE)
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

    // 🔐 SELF-HEAL OLD / MISSING DOCS
    if (!progress) {
      progress = new Progress({
        userId,
        completedLevels: [],
        startedModules: [],
        completedModules: [],
      });
    }

    // 🔐 HARD SAFETY
    if (!Array.isArray(progress.completedLevels)) {
      progress.completedLevels = [];
    }

    // ✅ IDENTITY = module + topicIndex + levelIndex
    const alreadyCompleted = progress.completedLevels.some(
      (l) =>
        String(l.moduleId) === String(moduleId) &&
        l.topicIndex === Number(topicIndex) &&
        l.levelNumber === Number(levelIndex)
    );

    // 🚫 BLOCK DUPLICATE XP
    if (alreadyCompleted) {
      return res.json({
        success: true,
        alreadyCompleted: true,
        xpAwarded: 0,
      });
    }

    // ✅ MARK LEVEL COMPLETE
    progress.completedLevels.push({
      moduleId,
      topicIndex: Number(topicIndex),
      levelNumber: Number(levelIndex),
      xpEarned: Number(level.xp) || 0,
    });

    await progress.save();

    // ✅ AWARD XP ONCE
    const xpAwarded = Number(level.xp) || 0;

    await User.findByIdAndUpdate(userId, {
      $inc: { xp: xpAwarded },
    });

    res.json({
      success: true,
      alreadyCompleted: false,
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
