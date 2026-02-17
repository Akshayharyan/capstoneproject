const mongoose = require("mongoose");

/* ================================
   TEST CASE (CODING)
================================ */
const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

/* ================================
   TASK (QUIZ / CODING / BUG FIX)
================================ */
const TaskSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quiz", "coding", "bugfix"],
    required: true,
  },

  /* ---------- QUIZ ---------- */
  question: String,
  options: [String],
  correctAnswer: String,

  /* ---------- CODING ---------- */
  codingPrompt: String,
  starterCode: String,
  testCases: [TestCaseSchema],

  language: {
    type: String,
    default: "javascript",
  },

  gradingRules: {
    type: Object,
    default: {},
  },

  /* ---------- BUG FIX ---------- */
  buggyCode: String,
  expectedFix: String,
  hint: String,

  /* ---------- COMMON ---------- */
  xp: { type: Number, default: 20 },
});

/* ================================
   TOPIC
================================ */
const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },

  videoUrl: { type: String, required: true },
  videoDuration: String,

  tasks: [TaskSchema],

  xp: { type: Number, default: 100 },
});

/* ================================
   MODULE (GAME READY)
================================ */
const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // 🐲 BOSS ATTACHED TO MODULE
    boss: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boss",
      default: null, // keeps old modules safe
    },

    topics: [TopicSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Module ||
  mongoose.model("Module", ModuleSchema);
