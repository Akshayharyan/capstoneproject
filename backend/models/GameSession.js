const mongoose = require("mongoose");

/* ================================
   GAME SESSION (15-20 MCQ Run)
================================ */
const GameSessionSchema = new mongoose.Schema(
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

    // Game Configuration
    totalQuestions: { type: Number, required: true }, // 15-20
    livesAtStart: { type: Number, default: 3 },

    // Game State
    status: {
      type: String,
      enum: ["active", "completed", "failed"],
      default: "active",
    },

    currentQuestionIndex: { type: Number, default: 0 },
    livesRemaining: { type: Number, default: 3 },
    score: { type: Number, default: 0 },

    questionsAsked: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        taskId: mongoose.Schema.Types.ObjectId,
        question: String,
        options: [String],
        correctIndex: Number,
        userAnswerIndex: { type: Number, default: -1 }, // -1 = not answered
        isCorrect: { type: Boolean, default: false },
        answeredAt: { type: Date, default: null },
        points: { type: Number, default: 0 }, // 10 points per correct
      },
    ],

    // Results
    correctAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // percentage
    totalScore: { type: Number, default: 0 },
    won: { type: Boolean, default: false },

    // Timeline
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    totalTimeSeconds: { type: Number, default: 0 },

    // Certificate
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.GameSession ||
  mongoose.model("GameSession", GameSessionSchema);
