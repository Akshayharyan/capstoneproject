const Module = require("../models/module");
const Progress = require("../models/progress");

// ===============================
// 📌 GET ALL MODULES WITH USER STATUS
// ===============================
exports.getModulesWithStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const modules = await Module.find().lean();
    let progress = await Progress.findOne({ userId }).lean();

    const started = progress?.startedModules?.map(String) || [];
    const completed = progress?.completedModules?.map(String) || [];

    const result = modules.map((m) => {
      let status = "not_started";
      if (completed.includes(String(m._id))) status = "completed";
      else if (started.includes(String(m._id))) status = "in_progress";

      return {
        _id: m._id,
        title: m.title,
        description: m.description,
        status,
      };
    });

    res.json({ modules: result });
  } catch (err) {
    console.error("getModulesWithStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 📌 START MODULE
// ===============================
exports.startModule = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({
        userId,
        startedModules: [],
        completedLevels: [],
        completedModules: [],
      });
    }

    if (!progress.startedModules.map(String).includes(String(moduleId))) {
      progress.startedModules.push(moduleId);
      await progress.save();
    }

    res.json({ message: "Module started" });
  } catch (err) {
    console.error("startModule error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 📌 GET STARTED MODULES (DASHBOARD)
// ===============================
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
    console.error("getStartedModules error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
