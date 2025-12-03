
const Module = require("../models/module");
const Progress = require("../models/progress");

exports.getModuleQuests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId).lean();
    if (!module) return res.status(404).json({ message: "Module not found" });

    const progress = await Progress.findOne({ userId }).lean();

    const completedIds = progress?.completedQuests
      .filter((cq) => String(cq.moduleId) === String(moduleId))
      .map((cq) => String(cq.questId)) || [];

    const quests = module.quests
      .sort((a, b) => a.order - b.order)
      .map((q, index) => {
        const isCompleted = completedIds.includes(String(q._id));
        const isCurrent = index === completedIds.length;
        const isLocked = index > completedIds.length;

        return {
          id: q._id,
          title: q.title,
          xp: q.xp,
          order: q.order,
          status: isCompleted ? "Completed" : isCurrent ? "Current" : "Locked",
        };
      });

    res.json({
      moduleTitle: module.title,
      quests,
    });
  } catch (error) {
    console.error("Get module quests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
