const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");

/**
 * Unlock achievements linked to a completed module
 * Rule: ONE achievement per module
 */
const unlockModuleAchievements = async (userId, moduleId) => {
  // Find active module achievement
  const achievement = await Achievement.findOne({
    moduleId,
    type: "MODULE_COMPLETE",
    isActive: true,
  });

  if (!achievement) return;

  // Check if already unlocked
  const alreadyUnlocked = await UserAchievement.findOne({
    userId,
    achievementId: achievement._id,
  });

  if (alreadyUnlocked) return;

  // Unlock
  await UserAchievement.create({
    userId,
    achievementId: achievement._id,
  });
};

module.exports = { unlockModuleAchievements };
