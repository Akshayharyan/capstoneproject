const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  taskType: { type: String, enum: ["quiz", "coding"], required: true },
  xp: { type: Number, default: 10 },
});

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  levels: [LevelSchema],
});

const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    topics: [TopicSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
