const mongoose = require("mongoose");

const TopicProgressSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    topicIndex: {
      type: Number,
      required: true,
    },

    videoCompleted: {
      type: Boolean,
      default: false,
    },

    quizCompleted: {
      type: Boolean,
      default: false,
    },

    codingCompleted: {
      type: Boolean,
      default: false,
    },

    xpAwarded: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    startedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    topics: [TopicProgressSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
