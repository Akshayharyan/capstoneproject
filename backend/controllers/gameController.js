const GameSession = require("../models/GameSession");
const Module = require("../models/module");
const Certificate = require("../models/Certificate");
const Progress = require("../models/progress");
const crypto = require("crypto");

/* =========================================
   UTILITY: Extract MCQs from module
========================================= */
const extractMCQsFromModule = (module, count = 20) => {
  const mcqs = [];

  module.topics.forEach((topic) => {
    if (topic.tasks) {
      topic.tasks.forEach((task) => {
        if (task.type === "quiz" && task.content.quiz) {
          mcqs.push({
            taskId: task._id,
            question: task.content.quiz.question,
            options: task.content.quiz.options,
            correctIndex: task.content.quiz.correctIndex,
            topicTitle: topic.title,
            xp: task.xp || 20,
          });
        }
      });
    }
  });

  if (mcqs.length === 0) {
    throw new Error("No MCQ questions found in this module");
  }

  // If we have enough questions, return a random unique subset.
  if (mcqs.length >= count) {
    const shuffled = [...mcqs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // If question pool is smaller than requested count,
  // keep sampling randomly (with repeats) until count is filled.
  const selected = [];
  for (let i = 0; i < count; i += 1) {
    const randomIndex = Math.floor(Math.random() * mcqs.length);
    selected.push(mcqs[randomIndex]);
  }

  return selected;
};

/* =========================================
   START GAME (Pick 15-20 MCQs)
========================================= */
exports.startGame = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    // Get module
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    // Extract MCQs (15-20 random from module)
    const mcqs = extractMCQsFromModule(module, 20); // Get 20 random MCQs

    // Check if active session exists
    let session = await GameSession.findOne({
      userId,
      moduleId,
      status: "active",
    });

    if (session) {
      // Return existing active session
      const firstUnanswered = session.questionsAsked[session.currentQuestionIndex];
      return res.json({
        success: true,
        sessionId: session._id,
        message: "Resuming existing game",
        gameState: {
          totalQuestions: session.totalQuestions,
          livesRemaining: session.livesRemaining,
          currentQuestionIndex: session.currentQuestionIndex,
          score: session.score,
          currentQuestion: firstUnanswered,
        },
      });
    }

    // Create new game session
    session = await GameSession.create({
      userId,
      moduleId,
      totalQuestions: mcqs.length,
      livesAtStart: 3,
      livesRemaining: 3,
      questionsAsked: mcqs.map((mcq) => ({
        taskId: mcq.taskId,
        question: mcq.question,
        options: mcq.options,
        correctIndex: mcq.correctIndex,
      })),
    });

    const firstQuestion = session.questionsAsked[0];

    res.json({
      success: true,
      sessionId: session._id,
      message: "Game started",
      gameState: {
        totalQuestions: session.totalQuestions,
        livesRemaining: session.livesRemaining,
        currentQuestionIndex: 0,
        score: 0,
        currentQuestion: firstQuestion,
      },
    });
  } catch (err) {
    console.error("Start game error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/* =========================================
   SUBMIT ANSWER
========================================= */
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, answerIndex } = req.body;
    const userId = req.user._id;

    if (answerIndex === undefined || answerIndex < 0 || answerIndex > 3) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid answer index" });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Game session not found" });
    }

    // Verify user
    if (String(session.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Check if game is still active
    if (session.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Game is not active",
        gameState: {
          status: session.status,
          won: session.won,
        },
      });
    }

    const currentQuestion = session.questionsAsked[session.currentQuestionIndex];

    // Validate answer
    const isCorrect = answerIndex === currentQuestion.correctIndex;

    // Update question record
    currentQuestion.userAnswerIndex = answerIndex;
    currentQuestion.isCorrect = isCorrect;
    currentQuestion.answeredAt = new Date();

    if (isCorrect) {
      currentQuestion.points = 10;
      session.correctAnswers += 1;
      session.score += 10;
    } else {
      // Wrong answer: lose 1 life
      session.livesRemaining -= 1;
    }

    // Calculate accuracy
    session.accuracy = Math.round(
      (session.correctAnswers / (session.currentQuestionIndex + 1)) * 100
    );

    // Move to next question
    const isLastQuestion =
      session.currentQuestionIndex >= session.totalQuestions - 1;
    const outOfLives = session.livesRemaining <= 0;

    if (isLastQuestion || outOfLives) {
      // End game: running out of lives is always a failure, even on last question.
      const hasWon = isLastQuestion && !outOfLives;
      session.status = hasWon ? "completed" : "failed";
      session.won = hasWon;
      session.endedAt = new Date();
      session.totalTimeSeconds = Math.floor(
        (session.endedAt - session.startedAt) / 1000
      );

      // Create certificate if won
      if (session.won) {
        const certificateCode = `CERT-${Date.now()}-${crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase()}`;

        const certificate = await Certificate.create({
          userId,
          moduleId: session.moduleId,
          certificateId: certificateCode,
          moduleTitle: (await Module.findById(session.moduleId)).title,
          earnedXp: session.score,
        });

        session.certificateId = certificate._id;

        // Mark module as completed in progress
        let progress = await Progress.findOne({ userId });
        if (!progress) {
          progress = await Progress.create({ userId });
        }

        if (!progress.completedModules.includes(session.moduleId)) {
          progress.completedModules.push(session.moduleId);
          await progress.save();
        }
      }

      await session.save();

      return res.json({
        success: true,
        answerCorrect: isCorrect,
        gameEnded: true,
        status: session.status,
        gameState: {
          totalQuestions: session.totalQuestions,
          correctAnswers: session.correctAnswers,
          accuracy: session.accuracy,
          score: session.score,
          won: session.won,
          certificateId: session.certificateId,
          timeSpent: session.totalTimeSeconds,
        },
      });
    }

    // Continue to next question
    session.currentQuestionIndex += 1;
    await session.save();

    const nextQuestion = session.questionsAsked[session.currentQuestionIndex];

    res.json({
      success: true,
      answerCorrect: isCorrect,
      gameEnded: false,
      gameState: {
        currentQuestionIndex: session.currentQuestionIndex,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        accuracy: session.accuracy,
        score: session.score,
        livesRemaining: session.livesRemaining,
        currentQuestion: nextQuestion,
      },
    });
  } catch (err) {
    console.error("Submit answer error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   GET GAME STATE
========================================= */
exports.getGameState = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Game session not found" });
    }

    if (String(session.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const currentQuestion = session.questionsAsked[session.currentQuestionIndex];

    res.json({
      success: true,
      gameState: {
        status: session.status,
        currentQuestionIndex: session.currentQuestionIndex,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        accuracy: session.accuracy,
        score: session.score,
        livesRemaining: session.livesRemaining,
        currentQuestion,
        won: session.won,
      },
    });
  } catch (err) {
    console.error("Get game state error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   GET GAME RESULTS
========================================= */
exports.getResults = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await GameSession.findById(sessionId).populate(
      "certificateId"
    );
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Game session not found" });
    }

    if (String(session.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const module = await Module.findById(session.moduleId);

    res.json({
      success: true,
      results: {
        moduleName: module.title,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        accuracy: session.accuracy,
        score: session.score,
        livesRemaining: session.livesRemaining,
        won: session.won,
        status: session.status,
        timeSpent: session.totalTimeSeconds,
        certificate: session.certificateId,
        questionsBreakdown: session.questionsAsked.map((q) => ({
          question: q.question,
          userAnswerIndex: q.userAnswerIndex,
          correctIndex: q.correctIndex,
          isCorrect: q.isCorrect,
          points: q.points,
        })),
      },
    });
  } catch (err) {
    console.error("Get results error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   RETRY GAME
========================================= */
exports.retryGame = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    // Delete active session if exists
    await GameSession.findOneAndDelete({
      userId,
      moduleId,
      status: "active",
    });

    // Start new game
    const module = await Module.findById(moduleId);
    const mcqs = extractMCQsFromModule(module, 20);

    const newSession = await GameSession.create({
      userId,
      moduleId,
      totalQuestions: mcqs.length,
      questionsAsked: mcqs.map((mcq) => ({
        taskId: mcq.taskId,
        question: mcq.question,
        options: mcq.options,
        correctIndex: mcq.correctIndex,
      })),
    });

    res.json({
      success: true,
      sessionId: newSession._id,
      message: "Game restarted",
      gameState: {
        totalQuestions: newSession.totalQuestions,
        livesRemaining: newSession.livesRemaining,
        currentQuestionIndex: 0,
        score: 0,
        currentQuestion: newSession.questionsAsked[0],
      },
    });
  } catch (err) {
    console.error("Retry game error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
