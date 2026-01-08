const Module = require("../models/module");
const Progress = require("../models/progress");
const User = require("../models/User");

/* ===============================
   📌 GET ALL MODULES WITH USER STATUS
================================ */
exports.getModulesWithStatus = async (req, res) => {
  try {
    console.log("✅ getModulesWithStatus HIT");

    const userId = req.user._id;

    const modules = await Module.find().lean();
    const progress = await Progress.findOne({ userId }).lean();

    const started = progress?.startedModules?.map(String) || [];
    const completed = progress?.completedModules?.map(String) || [];

    const result = modules.map((m) => {
      let status = "not_started";

      if (completed.includes(String(m._id))) {
        status = "completed";
      } else if (started.includes(String(m._id))) {
        status = "in_progress";
      }

      return {
        _id: m._id,
        title: m.title,
        description: m.description,
        xp: m.xp || 200,
        status,
        progress:
          status === "completed"
            ? 100
            : status === "in_progress"
            ? 50
            : 0,
      };
    });

    console.log("📦 MODULE STATUS RESULT:", result.length);
    res.json(result); // ✅ IMPORTANT: return ARRAY
  } catch (err) {
    console.error("❌ getModulesWithStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   📌 START MODULE
================================ */
exports.startModule = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({
        userId,
        startedModules: [],
        completedModules: [],
      });
    }

    if (!progress.startedModules.map(String).includes(String(moduleId))) {
      progress.startedModules.push(moduleId);
      await progress.save();
    }

    res.json({ message: "Module started" });
  } catch (err) {
    console.error("❌ startModule error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   📌 GET STARTED MODULES (DASHBOARD)
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

/* ===============================
   🆕 COMPLETE TOPIC + AWARD XP
================================ */
exports.completeTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.body;
    const userId = req.user.id;

    if (topicIndex === undefined) {
      return res.status(400).json({ message: "Topic index required" });
    }

    const user = await User.findById(userId);
    const module = await Module.findById(moduleId);

    if (!user || !module) {
      return res.status(404).json({ message: "User or Module not found" });
    }

    const topic = module.topics[topicIndex];
    if (!topic) {
      return res.status(400).json({ message: "Invalid topic index" });
    }

    let progress = user.moduleProgress.find(
      (p) => String(p.moduleId) === String(moduleId)
    );

    if (!progress) {
      progress = { moduleId, completedTopics: [] };
      user.moduleProgress.push(progress);
    }

    if (progress.completedTopics.includes(topicIndex)) {
      return res.json({ message: "Topic already completed", xp: user.xp });
    }

    progress.completedTopics.push(topicIndex);

    let earnedXP = topic.xp || 0;
    if (Array.isArray(topic.tasks)) {
      topic.tasks.forEach((t) => {
        if (t.xp) earnedXP += t.xp;
      });
    }

    user.xp += earnedXP;
    user.level = Math.floor(user.xp / 100) + 1;

    await user.save();

    res.json({
      message: "Topic completed successfully",
      earnedXP,
      totalXP: user.xp,
      level: user.level,
    });
  } catch (err) {
    console.error("❌ completeTopic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
