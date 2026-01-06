// backend/models/module.js
const mongoose = require("mongoose");

/* ================================
   TEST CASE SCHEMA (Coding)
================================ */
const TestCaseSchema = new mongoose.Schema({
  input: { type: String },
  output: { type: String },
});

/* ================================
   TASK SCHEMA (Quiz / Coding)
================================ */
const TaskSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quiz", "coding"],
    required: true,
  },

  /* ---------- QUIZ ---------- */
  question: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: String }, // store option text

  /* ---------- CODING ---------- */
  codingPrompt: { type: String },
  starterCode: { type: String },
  testCases: [TestCaseSchema],

  /* ---------- COMMON ---------- */
  xp: { type: Number, default: 10 },
});

/* ================================
   TOPIC SCHEMA (VIDEO-FIRST)
================================ */
const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },

  /* 🎥 VIDEO CONTENT */
  videoUrl: {
    type: String,
    required: true, // YouTube / Vimeo / S3 URL
  },
  videoDuration: {
    type: String, // e.g. "12:45"
  },

  /* 🧠 QUIZ + 💻 CODING (AFTER VIDEO) */
  tasks: [TaskSchema],

  /* ⭐ TOTAL XP FOR TOPIC */
  xp: {
    type: Number,
    default: 100,
  },
});

/* ================================
   MODULE SCHEMA
================================ */
const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    /* 📚 TOPICS */
    topics: [TopicSchema],
  },
  { timestamps: true }
);

/* ================================
   EXPORT (SAFE FOR HOT RELOAD)
================================ */
module.exports =
  mongoose.models.Module ||
  mongoose.model("Module", ModuleSchema);
