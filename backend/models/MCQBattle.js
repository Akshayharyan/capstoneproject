const mongoose = require("mongoose");

/* ================================
   MCQ BATTLE
================================ */
const MCQBattleSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["active", "completed", "failed"],
      default: "active",
    },

    // Game Configuration
    timeLimit: { type: Number, required: true }, // in seconds
    scoringThreshold: { type: Number, required: true }, // % to win
    totalQuestions: { type: Number, required: true },

    // Game State
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    
    currentQuestionIndex: { type: Number, default: 0 },
    questionsAsked: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        question: String,
        options: [String],
        correctIndex: Number,
        userAnswerIndex: { type: Number, default: -1 }, // -1 = not answered yet
        isCorrect: { type: Boolean, default: false },
        answeredAt: { type: Date, default: null },
      },
    ],

    // Scoring
    correctAnswers: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // percentage

    // Result
    won: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.MCQBattle ||
  mongoose.model("MCQBattle", MCQBattleSchema);
