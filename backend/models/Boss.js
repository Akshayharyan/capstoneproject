const mongoose = require("mongoose");

const BossPhaseSchema = new mongoose.Schema({
  name: String,
  hpThresholdPercent: Number,
  bossDamageMultiplier: { type: Number, default: 1 },
  playerDamageMultiplier: { type: Number, default: 1 }
});

const BossSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    theme: { type: String, default: "corporate-ai" },

    image: String,

    maxHp: { type: Number, required: true },

    baseAttackPower: { type: Number, required: true },

    xpReward: { type: Number, default: 300 },

    phases: [BossPhaseSchema]
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Boss ||
  mongoose.model("Boss", BossSchema);