const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  completedLevels: [
    {
      moduleId: mongoose.Schema.Types.ObjectId,
      topicIndex: Number,
      levelNumber: Number,
      xpEarned: Number,
      completedAt: { type: Date, default: Date.now }
    }
  ],

  startedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    }
  ]
});

module.exports =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
