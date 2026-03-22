const User = require("../models/User");
const Module = require("../models/module");
const Progress = require("../models/progress");
const Activity = require("../models/activity");

const computeNextLevelXP = (level) => level * (level + 1) * 50;

// 🔥 LeetCode-style learning streak
const calculateLearningStreak = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return 0;

  const normalizeDayValue = (input) => {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return null;
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime();
  };

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const activeDayValues = Array.from(
    new Set(
      activities
        .map((a) => normalizeDayValue(a.createdAt || a.updatedAt || a.date))
        .filter((value) => typeof value === "number")
    )
  ).sort((a, b) => b - a);

  if (activeDayValues.length === 0) return 0;

  const todayValue = normalizeDayValue(new Date());
  if (typeof todayValue !== "number") return 0;

  const daysSinceLast = Math.round((todayValue - activeDayValues[0]) / MS_PER_DAY);
  if (daysSinceLast > 1) return 0;

  let streak = 1;

  for (let i = 1; i < activeDayValues.length; i++) {
    const diff = Math.round(
      (activeDayValues[i - 1] - activeDayValues[i]) / MS_PER_DAY
    );

    if (diff === 1) streak++;
    else if (diff > 1) break;
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

    const modulesWithState = modules.map((m) => {
      const completed = progress.completedModules.some(
        (mid) => String(mid) === String(m._id)
      );

      return {
        id: m._id,
        title: m.title,
        description: m.description,
        completed,
        // ⭐ Quick progress (until topic progress is added)
        progressPercent: completed ? 100 : 0,
      };
    });

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
    const modulesCompleted = progress.completedModules.length;

    // ✅ Achievements (replace badges)
    const achievementsEarned = modulesCompleted;

    const nextLevelXP = computeNextLevelXP(user.level || 1);

    // ===============================
    // RESPONSE
    // ===============================
    res.json({
      user,
      modules: modulesWithState,
      stats: {
        totalPoints,
        achievementsEarned,
        modulesCompleted,
        learningStreak,
      },
      nextLevelXP,
      recentActivity,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
