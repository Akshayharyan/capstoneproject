const User = require("../models/user");
const Module = require("../models/module");
const Progress = require("../models/progress");
const Activity = require("../models/activity");

const computeNextLevelXP = (level) => level * (level + 1) * 50;

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    let progress = await Progress.findOne({ userId }).lean();
    if (!progress) {
      progress = (
        await Progress.create({
          userId,
          startedModules: [],
          completedQuests: [],
          completedModules: []
        })
      ).toObject();
    }

    // Load only started modules
    const startedModuleIds = progress.startedModules || [];

    let modules = [];
    if (startedModuleIds.length > 0) {
      modules = await Module.find({ _id: { $in: startedModuleIds } }).lean();
    }

    const modulesWithState = modules.map((m) => {
      const quests = m.quests.map((q) => {
        const done = progress.completedQuests.some(
          (cq) =>
            String(cq.moduleId) === String(m._id) &&
            String(cq.questId) === String(q._id)
        );

        return {
          id: q._id,
          title: q.title,
          xp: q.xp,
          order: q.order,
          done,
        };
      });

      return {
        id: m._id,
        title: m.title,
        description: m.description,
        xp: m.xp,
        quests,
        completed: progress.completedModules.includes(m._id),
      };
    });

    const totalPoints = user.xp || 0;
    const badgesEarned = (user.badges || []).length;
    const modulesCompleted = (progress.completedModules || []).length;
    const nextLevelXP = computeNextLevelXP(user.level || 1);

    const recentActivity = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      user,
      modules: modulesWithState,
      stats: {
        totalPoints,
        badgesEarned,
        modulesCompleted,
      },
      nextLevelXP,
      recentActivity,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
