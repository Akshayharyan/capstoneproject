const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // NEW: modules user has started
  startedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    }
  ],

  completedQuests: [
    {
      moduleId: mongoose.Schema.Types.ObjectId,
      questId: mongoose.Schema.Types.ObjectId,
    },
  ],

  completedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
    }
  ],
});

module.exports = mongoose.model("Progress", ProgressSchema);
