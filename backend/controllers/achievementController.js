const UserAchievement = require("../models/UserAchievement");
const Achievement = require("../models/Achievement");
const User = require("../models/User");
const { ensureDefaultAchievements } = require("../utils/ensureDefaultAchievements");

const autoUnlockXpAchievements = async (userId, currentXp, achievements) => {
  const xpAchievements = achievements.filter(
    (achievement) =>
      achievement.type === "XP" && Number(achievement.targetValue || 0) > 0
  );

  for (const achievement of xpAchievements) {
    if (currentXp >= Number(achievement.targetValue)) {
      await UserAchievement.updateOne(
        { userId, achievementId: achievement._id },
        {
          $setOnInsert: {
            userId,
            achievementId: achievement._id,
            unlockedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
  }
};

/**
 * GET achievements of logged-in user
 * Returns all achievements with unlocked flag
 */
const getMyAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    await ensureDefaultAchievements(userId);

    const user = await User.findById(userId).select("xp");
    const totalXp = Number(user?.xp || 0);

    const allAchievements = await Achievement.find({
      isActive: true,
    }).lean();

    await autoUnlockXpAchievements(userId, totalXp, allAchievements);

    const unlockedDocs = await UserAchievement.find({ userId })
      .select("achievementId")
      .lean();

    const unlockedIds = new Set(
      unlockedDocs.map((entry) => String(entry.achievementId))
    );

    const result = allAchievements.map((achievement) => {
      const unlocked = unlockedIds.has(String(achievement._id));
      const targetValue =
        achievement.type === "XP" ? Number(achievement.targetValue || 0) : 1;
      const progressValue =
        achievement.type === "XP"
          ? totalXp
          : unlocked
          ? 1
          : 0;

      return {
        _id: achievement._id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        type: achievement.type,
        moduleId: achievement.moduleId,
        targetValue,
        progressValue,
        rarity: achievement.rarity || "common",
        theme: achievement.theme || "indigo",
        unlocked,
        rewardXp: achievement.rewardXp || 0,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Get achievements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyAchievements, // ✅ THIS WAS MISSING / WRONG BEFORE
};
