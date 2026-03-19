const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Python Warrior
    description: { type: String },
    icon: { type: String, default: "🏆" },

    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    type: {
      type: String,
      enum: ["MODULE_COMPLETE", "XP", "STREAK", "CUSTOM"],
      required: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },

    targetValue: Number, // XP / streak target

    rewardXp: {
      type: Number,
      default: 0,
    },

    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    theme: {
      type: String,
      default: "indigo",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // trainer
      required: false,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Achievement ||
  mongoose.model("Achievement", AchievementSchema);

