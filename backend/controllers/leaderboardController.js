const User = require("../models/User");
const Progress = require("../models/progress");
const Activity = require("../models/activity");

const clampLimit = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return 50;
  return Math.min(parsed, 100);
};

exports.getLeaderboard = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit);

    const users = await User.find({ role: "employee" })
      .select("name avatar xp level badges createdAt")
      .sort({ xp: -1, level: -1, createdAt: 1 })
      .limit(limit)
      .lean();

    const userIds = users.map((user) => user._id);

    const progressDocs = await Progress.find({ userId: { $in: userIds } })
      .select("userId completedModules")
      .lean();

    const progressMap = new Map(
      progressDocs.map((doc) => [doc.userId.toString(), doc])
    );

    let activityMap = new Map();

    if (userIds.length) {
      const latestActivity = await Activity.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$userId",
            lastActivity: { $first: "$createdAt" },
          },
        },
      ]);

      activityMap = new Map(
        latestActivity.map((entry) => [entry._id.toString(), entry.lastActivity])
      );
    }

    const leaderboard = users.map((user, index) => {
      const progress = progressMap.get(user._id.toString());
      const lastActive = activityMap.get(user._id.toString());

      return {
        id: user._id,
        rank: index + 1,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp || 0,
        level: user.level || 1,
        badges: Array.isArray(user.badges) ? user.badges.length : Number(user.badges) || 0,
        modulesCompleted: progress?.completedModules?.length || 0,
        joinedAt: user.createdAt,
        lastActive,
      };
    });

    res.json({ total: leaderboard.length, leaderboard });
  } catch (error) {
    console.error("Leaderboard fetch failed:", error);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};
