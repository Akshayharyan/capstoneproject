// backend/controllers/achievementController.js
console.log(
  "UserAchievement typeof:",
  typeof require("../models/UserAchievement")
);

const UserAchievement = require("../models/UserAchievement");
const Achievement = require("../models/Achievement");

/**
 * GET achievements of logged-in user
 * Returns all achievements with unlocked flag
 */
const getMyAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    // Achievements unlocked by user
    const unlocked = await UserAchievement.find({ userId })
      .populate("achievementId")
      .lean();

    const unlockedIds = unlocked.map(
      (u) => String(u.achievementId._id)
    );

    // All active achievements
    const allAchievements = await Achievement.find({
      isActive: true,
    }).lean();

    // Merge unlocked + locked
    const result = allAchievements.map((a) => ({
      _id: a._id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      type: a.type,
      moduleId: a.moduleId,
      unlocked: unlockedIds.includes(String(a._id)),
    }));

    res.json(result);
  } catch (err) {
    console.error("Get achievements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyAchievements, // ✅ THIS WAS MISSING / WRONG BEFORE
};
