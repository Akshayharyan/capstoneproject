const mongoose = require("mongoose");

const BossChallengeSchema = new mongoose.Schema(
  {
    bossId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boss",
      required: true
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },

    phase: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["coding", "bugfix", "quiz"],
      required: true
    },

    difficulty: {
      type: Number,
      default: 1
    },

    weight: {
      type: Number,
      default: 1
    },

    content: {
      coding: {
        prompt: String,
        starterCode: String,
        testCases: [
          {
            input: String,
            output: String,
            hidden: Boolean
          }
        ]
      },

      bugfix: {
        buggyCode: String,
        hint: String,
        testCases: [
          {
            input: String,
            output: String,
            hidden: Boolean
          }
        ]
      },

      quiz: {
        question: String,
        options: [String],
        correctIndex: Number
      }
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.BossChallenge ||
  mongoose.model("BossChallenge", BossChallengeSchema);