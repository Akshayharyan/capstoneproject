// backend/models/module.js
const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  xp: { type: Number, default: 10 },
  order: { type: Number, default: 0 },
}, { _id: true });

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  xp: { type: Number, default: 0 }, // optional module-level xp or bonus
  quests: [questSchema],
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
