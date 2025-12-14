const User = require("../models/User");
const Module = require("../models/module");
const Progress = require("../models/progress");
const Activity = require("../models/activity");

const computeNextLevelXP = (level) => level * (level + 1) * 50;

// 🔥 LeetCode-style learning streak
const calculateLearningStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  // Unique activity days (YYYY-MM-DD)
  const activeDays = new Set(
    activities.map((a) =>
      new Date(a.createdAt).toISOString().split("T")[0]
    )
  );

  let streak = 0;
  const today = new Date();

  // Check consecutive days backwards
  for (let i = 0; i < 365; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = day.toISOString().split("T")[0];

    if (activeDays.has(dayStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // ===============================
    // USER
    // ===============================
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // ===============================
    // PROGRESS (SELF-HEAL)
    // ===============================
    let progress = await Progress.findOne({ userId }).lean();

    if (!progress) {
      progress = (
        await Progress.create({
          userId,
          startedModules: [],
          completedLevels: [],
          completedModules: [],
        })
      ).toObject();
    }

    progress.startedModules = Array.isArray(progress.startedModules)
      ? progress.startedModules
      : [];
    progress.completedModules = Array.isArray(progress.completedModules)
      ? progress.completedModules
      : [];

    // ===============================
    // LOAD STARTED MODULES
    // ===============================
    let modules = [];
    if (progress.startedModules.length > 0) {
      modules = await Module.find({
        _id: { $in: progress.startedModules },
      }).lean();
    }

    const modulesWithState = modules.map((m) => ({
      id: m._id,
      title: m.title,
      description: m.description,
      completed: progress.completedModules.some(
        (mid) => String(mid) === String(m._id)
      ),
    }));

    // ===============================
    // ACTIVITY + STREAK
    // ===============================
    const recentActivity = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const learningStreak = calculateLearningStreak(recentActivity);

    // ===============================
    // STATS
    // ===============================
    const totalPoints = user.xp || 0;
    const badgesEarned = (user.badges || []).length;
    const modulesCompleted = progress.completedModules.length;
    const nextLevelXP = computeNextLevelXP(user.level || 1);

    // ===============================
    // RESPONSE
    // ===============================
    res.json({
      user,
      modules: modulesWithState,
      stats: {
        totalPoints,
        badgesEarned,
        modulesCompleted,
        learningStreak, // 🔥 NEW & FINAL
      },
      nextLevelXP,
      recentActivity,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
