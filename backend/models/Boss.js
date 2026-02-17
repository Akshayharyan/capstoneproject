const mongoose = require("mongoose");

const BossSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  hp: { type: Number, required: true },
  xpReward: { type: Number, required: true },
  difficulty: { type: String, required: true },
});

module.exports =
  mongoose.models.Boss ||
  mongoose.model("Boss", BossSchema);
