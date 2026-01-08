const Module = require("../models/module");
const Progress = require("../models/progress");
const User = require("../models/User");

/* ===============================
   GET MODULES WITH STATUS
================================ */
exports.getModulesWithStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const modules = await Module.find().lean();
    const progress =
      (await Progress.findOne({ userId }).lean()) ||
      (await Progress.create({ userId }));

    const started = progress.startedModules.map(String);
    const completed = progress.completedModules.map(String);

    const result = modules.map((m) => {
      let status = "not_started";
      if (completed.includes(String(m._id))) status = "completed";
      else if (started.includes(String(m._id))) status = "in_progress";

      return {
        _id: m._id,
        title: m.title,
        description: m.description,
        status,
        xp: m.xp || 200,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
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

    if (!progress.startedModules.map(String).includes(String(moduleId))) {
      progress.startedModules.push(moduleId);
      await progress.save();
    }

    res.json({ message: "Module started" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   COMPLETE TOPIC (IDEMPOTENT XP)
================================ */
exports.completeTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const module = await Module.findById(moduleId);
    if (!user || !module)
      return res.status(404).json({ message: "Not found" });

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    let topic = progress.topics.find(
      (t) =>
        String(t.moduleId) === String(moduleId) &&
        t.topicIndex === topicIndex
    );

    if (!topic) {
      topic = {
        moduleId,
        topicIndex,
        videoCompleted: true,
        quizCompleted: true,
        codingCompleted: true,
        xpAwarded: false,
      };
      progress.topics.push(topic);
    }

    if (topic.xpAwarded) {
      return res.json({
        message: "Already completed",
        totalXP: user.xp,
      });
    }

    // 🔥 AWARD XP ONCE
    let earnedXP = module.topics[topicIndex]?.xp || 0;
    user.xp += earnedXP;
    user.level = Math.floor(user.xp / 100) + 1;

    topic.xpAwarded = true;

    await user.save();
    await progress.save();

    res.json({
      message: "Topic completed",
      earnedXP,
      totalXP: user.xp,
      level: user.level,
      progress: topic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 /* ===============================
   GET STARTED MODULES (DASHBOARD)
================================ */
exports.getStartedModules = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId })
      .populate("startedModules", "title description")
      .lean();

    res.json({
      modules: progress?.startedModules || [],
    });
  } catch (err) {
    console.error("❌ getStartedModules error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
