const mongoose = require("mongoose");

/* ================================
   BOSS BATTLE SCHEMA
================================ */

const BossBattleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    /* ================================
       PLAYER STATE
    ================================= */

    playerHp: {
      type: Number,
      default: 100,
    },

    playerMaxHp: {
      type: Number,
      default: 100,
    },

    specialCooldown: {
      type: Number,
      default: 0,
    },

    /* ================================
       BOSS STATE
    ================================= */

    bossHp: {
      type: Number,
      required: true,
    },

    bossMaxHp: {
      type: Number,
      required: true,
    },

    phase: {
      type: Number,
      default: 1,
    },

    /* ================================
       BATTLE META
    ================================= */

    turnCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "victory", "defeat"],
      default: "active",
    },

    /* ================================
       CURRENT CHALLENGE STATE
       (Stored so refresh doesn't break fight)
    ================================= */

    currentChallenge: {
      type: Object,
      default: null,
    },

    specialActive: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.BossBattle ||
  mongoose.model("BossBattle", BossBattleSchema);