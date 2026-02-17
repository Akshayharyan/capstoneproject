const Module = require("../models/module");
const Progress = require("../models/progress");
const User = require("../models/User");
const { unlockModuleAchievements } = require("../utils/unlockAchievements");

/* ===============================
   GET ALL MODULES WITH STATUS
   (EMPLOYEE DASHBOARD)
================================ */
exports.getModulesWithStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const modules = await Module.find().populate("boss").lean();

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    const completedSet = new Set(
      progress.completedModules.map((id) => String(id))
    );

    const startedSet = new Set(
      progress.startedModules.map((id) => String(id))
    );

    const formatted = modules.map((m) => ({
      _id: m._id,
      title: m.title,
      description: m.description || "",
      topicCount: m.topics.length,
      started: startedSet.has(String(m._id)),
      completed: completedSet.has(String(m._id)),
      boss: m.boss || null,
    }));

    res.set("Cache-Control", "no-store");
    res.json({ modules: formatted });
  } catch (err) {
    console.error("Get modules status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MODULE TOPICS WITH STATUS
   (AUTHORITATIVE UNLOCK LOGIC)
================================ */
exports.getModuleTopicsWithStatus = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;

    const module = await Module.findById(moduleId)
      .populate("boss")
      .lean();

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    // Map topic progress by index
    const progressMap = {};
    progress.topics
      .filter((t) => String(t.moduleId) === String(moduleId))
      .forEach((t) => {
        progressMap[t.topicIndex] = t;
      });

    let completedCount = 0;

    const topics = module.topics.map((topic, index) => {
      const p = progressMap[index];
      const isCompleted = p?.xpAwarded === true;

      if (isCompleted) completedCount++;

      let status = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (index === 0) {
        status = "active";
      } else if (progressMap[index - 1]?.xpAwarded === true) {
        status = "active";
      }

      return {
        index,
        title: topic.title,
        xp: topic.xp,
        status,
      };
    });

    const progressPercent =
      module.topics.length === 0
        ? 0
        : Math.round((completedCount / module.topics.length) * 100);

    res.set("Cache-Control", "no-store");

    res.json({
      moduleTitle: module.title,
      progressPercent,
      topics,

      // 🐲 Boss unlock info
      boss: module.boss || null,
      bossUnlocked: completedCount === module.topics.length,
    });
  } catch (err) {
    console.error("Get module topics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   START MODULE
================================ */
exports.startModule = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    if (!progress.startedModules.includes(moduleId)) {
      progress.startedModules.push(moduleId);
      await progress.save();
    }

    res.json({ message: "Module started" });
  } catch (err) {
    console.error("Start module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   COMPLETE TOPIC (XP ONLY ONCE)
================================ */
exports.completeTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.body;
    const userId = req.user._id;

    const module = await Module.findById(moduleId);
    const user = await User.findById(userId);

    if (!module || !user) {
      return res.status(404).json({ message: "Not found" });
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    if (!progress.startedModules.includes(moduleId)) {
      progress.startedModules.push(moduleId);
    }

    let topicProgress = progress.topics.find(
      (t) =>
        String(t.moduleId) === String(moduleId) &&
        t.topicIndex === topicIndex
    );

    if (!topicProgress) {
      topicProgress = {
        moduleId,
        topicIndex,
        videoCompleted: true,
        quizCompleted: true,
        codingCompleted: true,
        xpAwarded: false,
      };
      progress.topics.push(topicProgress);
    }

    if (!topicProgress.xpAwarded) {
      const earnedXP = module.topics[topicIndex]?.xp || 0;
      user.xp += earnedXP;
      user.level = Math.floor(user.xp / 100) + 1;
      topicProgress.xpAwarded = true;
    }

    const completedTopics = progress.topics.filter(
      (t) =>
        String(t.moduleId) === String(moduleId) && t.xpAwarded
    ).length;

    if (completedTopics === module.topics.length) {
      if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
        await unlockModuleAchievements(userId, moduleId);
      }
    }

    await user.save();
    await progress.save();

    res.json({
      success: true,
      user: { xp: user.xp, level: user.level },
      progress,
    });
  } catch (err) {
    console.error("Complete topic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET STARTED MODULES
================================ */
exports.getStartedModules = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId });
    if (!progress) return res.json([]);

    const modules = await Module.find({
      _id: { $in: progress.startedModules },
    });

    res.json(modules);
  } catch (err) {
    console.error("Get started modules error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   COMPLETE VIDEO
================================ */
exports.completeVideo = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    let topicProgress = progress.topics.find(
      (t) =>
        String(t.moduleId) === String(moduleId) &&
        t.topicIndex === topicIndex
    );

    if (!topicProgress) {
      topicProgress = {
        moduleId,
        topicIndex,
        videoCompleted: true,
        quizCompleted: false,
        codingCompleted: false,
        xpAwarded: false,
      };
      progress.topics.push(topicProgress);
    } else {
      topicProgress.videoCompleted = true;
    }

    await progress.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Complete video error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   COMPLETE QUIZ
================================ */
exports.completeQuiz = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    let topicProgress = progress.topics.find(
      (t) =>
        String(t.moduleId) === String(moduleId) &&
        t.topicIndex === topicIndex
    );

    if (!topicProgress) {
      topicProgress = {
        moduleId,
        topicIndex,
        videoCompleted: false,
        quizCompleted: true,
        codingCompleted: false,
        xpAwarded: false,
      };
      progress.topics.push(topicProgress);
    } else {
      topicProgress.quizCompleted = true;
    }

    await progress.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Complete quiz error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
