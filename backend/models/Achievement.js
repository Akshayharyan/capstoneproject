const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Python Warrior
    description: { type: String },
    icon: { type: String, default: "🏆" },

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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // trainer
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Achievement ||
  mongoose.model("Achievement", AchievementSchema);

