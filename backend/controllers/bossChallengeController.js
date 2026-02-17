const Module = require("../models/module");
const Progress = require("../models/progress");

/* ===============================
   🎯 GENERATE AI-LIKE CHALLENGE
=============================== */
exports.generateBossChallenge = async (req, res) => {
  try {
    const { moduleId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const pool = [];

    module.topics.forEach((topic, ti) => {
      topic.tasks.forEach((task, qi) => {
        pool.push({
          topicIndex: ti,
          taskIndex: qi,
          type: task.type,
          question: task.question,
          options: task.options,
          codingPrompt: task.codingPrompt,
          starterCode: task.starterCode,
          buggyCode: task.buggyCode,
          hint: task.hint,
        });
      });
    });

    if (!pool.length)
      return res.status(400).json({ message: "No challenges available" });

    const challenge = pool[Math.floor(Math.random() * pool.length)];

    res.json({
      ...challenge,
      generatedAt: Date.now(), // anti-cheat
    });

  } catch (err) {
    console.error("Generate challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ⚔ APPLY DAMAGE TO BOSS
=============================== */
exports.attackBoss = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId, topicIndex, taskIndex, answer } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const task = module.topics[topicIndex]?.tasks[taskIndex];
    if (!task) return res.status(404).json({ message: "Task not found" });

    let correct = false;
    let damage = 0;

    /* ===== QUIZ ===== */
    if (task.type === "quiz") {
      correct = task.correctAnswer === answer;
      damage = 50;
    }

    /* ===== BUG FIX ===== */
    if (task.type === "bugfix") {
      correct = answer.trim() === task.expectedFix.trim();
      damage = 80;
    }

    /* ===== CODING ===== */
    if (task.type === "coding") {
      // simple safe validation (later plug grader)
      correct = answer && answer.length > 15;
      damage = 120;
    }

    const progress = await Progress.findOne({ userId });
    if (!progress) return res.status(404).json({ message: "Progress not found" });

    const fight = progress.bossFights.find(
      f => String(f.moduleId) === String(moduleId)
    );

    if (!fight) return res.status(400).json({ message: "Boss fight not started" });

    /* ===== APPLY RESULTS ===== */
    if (correct) {
      fight.currentHp -= damage;

      if (fight.currentHp <= 0) {
        fight.currentHp = 0;
        fight.defeated = true;

        if (!progress.completedModules.includes(moduleId))
          progress.completedModules.push(moduleId);
      }
    }

    await progress.save();

    res.json({
      correct,
      damage: correct ? damage : 0,
      fight,
    });

  } catch (err) {
    console.error("Attack boss error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
