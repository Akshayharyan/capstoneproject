const mongoose = require("mongoose");

/* ===============================
   TOPIC PROGRESS
=============================== */
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

    videoCompleted: { type: Boolean, default: false },
    quizCompleted: { type: Boolean, default: false },
    codingCompleted: { type: Boolean, default: false },

    xpAwarded: { type: Boolean, default: false },
  },
  { _id: false }
);

/* ===============================
   BOSS FIGHT STATE
=============================== */
const BossFightSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    bossId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boss",
      required: true,
    },

    currentHp: Number,
    maxHp: Number,

    // 🧠 PLAYER
    playerHp: {
      type: Number,
      default: 300,
    },

    defeated: {
      type: Boolean,
      default: false,
    },

    failed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);


/* ===============================
   MAIN PROGRESS
=============================== */
const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    startedModules: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    ],

    completedModules: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    ],

    topics: [TopicProgressSchema],

    bossFights: [BossFightSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);
