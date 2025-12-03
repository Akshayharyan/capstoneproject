const Progress = require("../models/progress");
const Module = require("../models/module");

exports.startModule = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    let progress = await Progress.findOne({ userId });

    // If progress doesn't exist for user, create it
    if (!progress) {
      progress = await Progress.create({
        userId,
        startedModules: [],
        completedQuests: [],
        completedModules: []
      });
    }

    // Add only if not added before
    if (!progress.startedModules.includes(moduleId)) {
      progress.startedModules.push(moduleId);
      await progress.save();
    }

    res.json({ message: "Module started successfully" });
  } catch (error) {
    console.error("Start module error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
