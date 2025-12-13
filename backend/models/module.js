// backend/models/module.js
const mongoose = require("mongoose");

// ---------------- TASK SCHEMA ----------------
const TestCaseSchema = new mongoose.Schema({
  input: { type: String },
  output: { type: String },
});

const TaskSchema = new mongoose.Schema({
  type: { type: String, enum: ["quiz", "coding"], required: true },

  // quiz
  question: String,
  options: [String],
  correctAnswer: String, // store as string (option text) for simplicity

  // coding
  codingPrompt: String,
  starterCode: String,
  testCases: [TestCaseSchema],

  // generic
  xp: { type: Number, default: 0 },
});

// ---------------- LEVEL SCHEMA ----------------
const LevelSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  contentMarkdown: { type: String, default: "" }, // markdown content
  xp: { type: Number, default: 0 },

  // Tasks (multiple per level)
  tasks: [TaskSchema],
});

// ---------------- TOPIC SCHEMA ----------------
const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  levels: [LevelSchema],
});

// ---------------- MODULE SCHEMA ----------------
const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    topics: [TopicSchema],
  },
  { timestamps: true }
);

// avoid OverwriteModelError
module.exports = mongoose.models.Module || mongoose.model("Module", ModuleSchema);
