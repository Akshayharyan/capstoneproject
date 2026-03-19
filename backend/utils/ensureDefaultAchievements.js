const Achievement = require("../models/Achievement");
const defaultAchievements = require("./defaultAchievements");

const ensureDefaultAchievements = async (fallbackCreatorId) => {
  for (const preset of defaultAchievements) {
    const existing = await Achievement.findOne({ slug: preset.slug });
    if (!existing) {
      await Achievement.create({
        ...preset,
        createdBy: fallbackCreatorId,
        isActive: true,
      });
    }
  }
};

module.exports = { ensureDefaultAchievements };
