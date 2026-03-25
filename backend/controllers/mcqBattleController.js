const MCQBattle = require("../models/MCQBattle");
const Module = require("../models/module");
const Progress = require("../models/progress");

/* =========================================
   UTILITY: Extract all MCQ questions from module
========================================= */
const extractMCQsFromModule = (module, limit = 10) => {
  const mcqs = [];

  module.topics.forEach((topic) => {
    if (topic.tasks) {
      topic.tasks.forEach((task) => {
        if (task.type === "quiz" && task.content.quiz) {
          mcqs.push({
            _id: task._id,
            question: task.content.quiz.question,
            options: task.content.quiz.options,
            correctIndex: task.content.quiz.correctIndex,
            topicTitle: topic.title,
            xp: task.xp,
          });
        }
      });
    }
  });

  // Shuffle and limit
  const shuffled = mcqs.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
};

/* =========================================
   START MCQ BATTLE
========================================= */
exports.startMCQBattle = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    // Get module
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    // Verify gameType is mcq-battle
    if (module.gameType !== "mcq-battle") {
      return res.status(400).json({
        success: false,
        message: "This module does not use MCQ Battle mode",
      });
    }

    // Extract MCQs
    const mcqs = extractMCQsFromModule(
      module,
      module.mcqBattleConfig.questionsToUse
    );

    if (mcqs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No MCQ questions found in this module",
      });
    }

    // Check if active battle exists
    let battle = await MCQBattle.findOne({
      userId,
      moduleId,
      status: "active",
    });

    if (!battle) {
      // Create new battle
      battle = await MCQBattle.create({
        userId,
        moduleId,
        timeLimit: module.mcqBattleConfig.timeLimit,
        scoringThreshold: module.mcqBattleConfig.scoringThreshold,
        totalQuestions: mcqs.length,
        questionsAsked: mcqs.map((mcq) => ({
          questionId: mcq._id,
          question: mcq.question,
          options: mcq.options,
          correctIndex: mcq.correctIndex,
        })),
      });
    }

    res.json({
      success: true,
      battle: {
        battleId: battle._id,
        totalQuestions: battle.totalQuestions,
        timeLimit: battle.timeLimit,
        currentQuestionIndex: battle.currentQuestionIndex,
        currentQuestion: battle.questionsAsked[0],
        startedAt: battle.startedAt,
      },
    });
  } catch (err) {
    console.error("Start MCQ battle error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   GET CURRENT BATTLE STATE
========================================= */
exports.getBattleState = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;

    const battle = await MCQBattle.findOne({
      userId,
      moduleId,
      status: "active",
    });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "No active MCQ battle",
      });
    }

    const currentQuestion = battle.questionsAsked[battle.currentQuestionIndex];
    const elapsedTime = Math.floor(
      (Date.now() - battle.startedAt.getTime()) / 1000
    );

    res.json({
      success: true,
      battle: {
        battleId: battle._id,
        status: battle.status,
        currentQuestionIndex: battle.currentQuestionIndex,
        totalQuestions: battle.totalQuestions,
        currentQuestion,
        correctAnswers: battle.correctAnswers,
        totalScore: battle.totalScore,
        elapsedTime,
        timeLimit: battle.timeLimit,
        timeRemaining: battle.timeLimit - elapsedTime,
      },
    });
  } catch (err) {
    console.error("Get battle state error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   SUBMIT ANSWER
========================================= */
exports.submitAnswer = async (req, res) => {
  try {
    const { moduleId, answerIndex } = req.body;
    const userId = req.user._id;

    const battle = await MCQBattle.findOne({
      userId,
      moduleId,
      status: "active",
    });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "No active MCQ battle",
      });
    }

    const elapsedTime = Math.floor(
      (Date.now() - battle.startedAt.getTime()) / 1000
    );

    // Check if time's up
    if (elapsedTime > battle.timeLimit) {
      battle.status = "failed";
      battle.endedAt = new Date();
      await battle.save();
      return res.json({
        success: false,
        message: "Time's up!",
        battle,
      });
    }

    const currentQuestion = battle.questionsAsked[battle.currentQuestionIndex];

    // Mark answer
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    currentQuestion.userAnswerIndex = answerIndex;
    currentQuestion.isCorrect = isCorrect;
    currentQuestion.answeredAt = new Date();

    if (isCorrect) {
      battle.correctAnswers += 1;
      battle.totalScore += 10; // 10 points per correct answer
    }

    // Calculate accuracy
    battle.accuracy = Math.round(
      (battle.correctAnswers / (battle.currentQuestionIndex + 1)) * 100
    );

    // Move to next question
    battle.currentQuestionIndex += 1;

    // Check if all questions answered
    if (battle.currentQuestionIndex >= battle.totalQuestions) {
      battle.status = battle.accuracy >= battle.scoringThreshold ? "completed" : "failed";
      battle.won = battle.status === "completed";
      battle.endedAt = new Date();

      // Update progress if won
      if (battle.won) {
        let progress = await Progress.findOne({ userId });
        if (!progress) progress = await Progress.create({ userId });

        if (!progress.completedModules.includes(moduleId)) {
          progress.completedModules.push(moduleId);
          await progress.save();
        }
      }
    }

    await battle.save();

    const nextQuestion =
      battle.currentQuestionIndex < battle.totalQuestions
        ? battle.questionsAsked[battle.currentQuestionIndex]
        : null;

    res.json({
      success: true,
      answerCorrect: isCorrect,
      battle: {
        status: battle.status,
        currentQuestionIndex: battle.currentQuestionIndex,
        totalQuestions: battle.totalQuestions,
        correctAnswers: battle.correctAnswers,
        totalScore: battle.totalScore,
        accuracy: battle.accuracy,
        nextQuestion,
        won: battle.won,
        timeRemaining: battle.timeLimit - elapsedTime,
      },
    });
  } catch (err) {
    console.error("Submit answer error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   GET BATTLE RESULTS
========================================= */
exports.getBattleResults = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;

    const battle = await MCQBattle.findOne({
      userId,
      moduleId,
    }).sort({ createdAt: -1 });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "No battle history found",
      });
    }

    const totalTime = Math.floor(
      (battle.endedAt - battle.startedAt) / 1000
    );

    res.json({
      success: true,
      results: {
        battleId: battle._id,
        status: battle.status,
        won: battle.won,
        totalQuestions: battle.totalQuestions,
        correctAnswers: battle.correctAnswers,
        accuracy: battle.accuracy,
        totalScore: battle.totalScore,
        scoringThreshold: battle.scoringThreshold,
        totalTime,
        timeLimit: battle.timeLimit,
        questionsAsked: battle.questionsAsked,
      },
    });
  } catch (err) {
    console.error("Get results error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   RETRY BATTLE
========================================= */
exports.retryBattle = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    // Delete active battle if exists
    await MCQBattle.findOneAndDelete({
      userId,
      moduleId,
      status: "active",
    });

    // Start new battle
    const module = await Module.findById(moduleId);
    const mcqs = extractMCQsFromModule(
      module,
      module.mcqBattleConfig.questionsToUse
    );

    const newBattle = await MCQBattle.create({
      userId,
      moduleId,
      timeLimit: module.mcqBattleConfig.timeLimit,
      scoringThreshold: module.mcqBattleConfig.scoringThreshold,
      totalQuestions: mcqs.length,
      questionsAsked: mcqs.map((mcq) => ({
        questionId: mcq._id,
        question: mcq.question,
        options: mcq.options,
        correctIndex: mcq.correctIndex,
      })),
    });

    res.json({
      success: true,
      battle: {
        battleId: newBattle._id,
        totalQuestions: newBattle.totalQuestions,
        timeLimit: newBattle.timeLimit,
        currentQuestion: newBattle.questionsAsked[0],
      },
    });
  } catch (err) {
    console.error("Retry battle error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
