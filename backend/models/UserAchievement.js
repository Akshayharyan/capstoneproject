const mongoose = require("mongoose");

const UserAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔥 THIS LINE IS CRITICAL
module.exports =
  mongoose.models.UserAchievement ||
  mongoose.model("UserAchievement", UserAchievementSchema);
