const mongoose = require("mongoose");

/* ================================
   CODING TEST CASE
================================ */
const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  hidden: {
    type: Boolean,
    default: false,
  },
});

/* ================================
   TASK CONTENT (BY TYPE)
================================ */

/* ---- QUIZ ---- */
const QuizContentSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    validate: v => v.length === 4,
  },
  correctIndex: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
});

/* ---- CODING ---- */
const CodingContentSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  starterCode: String,
  language: { type: String, default: "javascript" },
  testCases: [TestCaseSchema],
});

/* ---- BUG FIX ---- */
const BugFixContentSchema = new mongoose.Schema({
  buggyCode: { type: String, required: true },
  hint: String,
  testCases: [TestCaseSchema]   // 🔥 REQUIRED
});

/* ================================
   TASK (CLEAN & SAFE)
================================ */
const TaskSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quiz", "coding", "bugfix"],
    required: true,
  },

  title: { type: String, required: true },

  content: {
    quiz: QuizContentSchema,
    coding: CodingContentSchema,
    bugfix: BugFixContentSchema,
  },

  xp: { type: Number, default: 20 },
});

/* ================================
   TOPIC
================================ */
const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: String,
  xp: { type: Number, default: 100 },

  tasks: [TaskSchema],
});

/* ================================
   MODULE
================================ */
const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: String,

    boss: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boss",
      default: null,
    },

    topics: [TopicSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Module ||
  mongoose.model("Module", ModuleSchema);