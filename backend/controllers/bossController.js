const Boss = require("../models/Boss");
const BossBattle = require("../models/BossBattle");
const Module = require("../models/module");
const { runJS } = require("../services/jsRunner");

const {
  generateChallenge,
  processTurn,
  initializeBattle
} = require("../services/battleEngine");

/* =========================================
   START OR RESUME BATTLE
========================================= */
const startBattle = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    const boss = await Boss.findOne({ moduleId });
    if (!boss) {
      return res.status(404).json({ message: "Boss not found" });
    }

    let battle = await BossBattle.findOne({
      userId,
      moduleId,
      status: "active"
    });

    if (!battle) {
      const initialState = initializeBattle(boss, userId);

      battle = await BossBattle.create({
        ...initialState,
        bossMaxHp: boss.maxHp
      });
    }

    res.json({ success: true, battle });

  } catch (err) {
    console.error("Start battle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   GET CURRENT BATTLE STATE
========================================= */
const getBattleState = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;

    const battle = await BossBattle.findOne({
      userId,
      moduleId,
      status: "active"
    });

    if (!battle) {
      return res.status(404).json({ message: "No active battle" });
    }

    res.json({ success: true, battle });

  } catch (err) {
    console.error("Get battle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   GENERATE NEW CHALLENGE
========================================= */
const generateTurnChallenge = async (req, res) => {
  try {
    const { moduleId, isSpecial } = req.body;
    const userId = req.user._id;

    const battle = await BossBattle.findOne({
      userId,
      moduleId,
      status: "active"
    });

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const boss = await Boss.findById(battle.bossId);
    const module = await Module.findById(moduleId);

    const moduleTasks = module.topics.flatMap(t => t.tasks);

    const challenge = await generateChallenge(
      boss,
      moduleTasks,
      battle.phase,
      isSpecial
    );

    battle.currentChallenge = challenge;
    battle.specialActive = isSpecial;

    await battle.save();

    res.json({ success: true, challenge });

  } catch (err) {
    console.error("Generate challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   PROCESS PLAYER ATTACK
========================================= */
const attackBoss = async (req, res) => {
  try {
    const { moduleId, code } = req.body;
    const userId = req.user._id;

    const battle = await BossBattle.findOne({
      userId,
      moduleId,
      status: "active"
    });

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const boss = await Boss.findById(battle.bossId);
    const challenge = battle.currentChallenge;

    if (!challenge) {
      return res.status(400).json({ message: "No challenge active" });
    }

    let testCases = [];

    /* ================= QUIZ ================= */
    if (challenge.type === "quiz") {
      const correct = challenge.content.quiz.correctIndex;
      const passed = Number(code) === correct;

      const results = [{ pass: passed }];

      const updatedBattle = await processTurn({
        battle,
        boss,
        moduleTasks: [],
        graderResults: results,
        isSpecial: battle.specialActive
      });

      updatedBattle.currentChallenge = null;
      updatedBattle.specialActive = false;

      await updatedBattle.save();

      return res.json({ success: true, battle: updatedBattle });
    }

    /* ================= CODING / BUGFIX ================= */
    if (challenge.type === "coding") {
      testCases = challenge.content?.coding?.testCases || [];
    }

    if (challenge.type === "bugfix") {
      testCases = challenge.content?.bugfix?.testCases || [];
    }

    if (testCases.length === 0) {
      return res.status(400).json({ message: "No test cases found" });
    }

    const result = await runJS(code, testCases);

    if (result.error) {
      return res.json({ success: false, message: result.error });
    }

    const results = testCases.map((tc, i) => ({
      pass: String(tc.output) === String(result.output[i])
    }));

    const updatedBattle = await processTurn({
      battle,
      boss,
      moduleTasks: [],
      graderResults: results,
      isSpecial: battle.specialActive
    });

    updatedBattle.currentChallenge = null;
    updatedBattle.specialActive = false;

    await updatedBattle.save();

    res.json({
      success: true,
      battle: updatedBattle,
      results
    });

  } catch (err) {
    console.error("Attack error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   RETRY BATTLE
========================================= */
const retryBattle = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user._id;

    await BossBattle.deleteMany({
      userId,
      moduleId
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Retry battle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   EXPORT PROPERLY (CRITICAL FIX)
========================================= */
module.exports = {
  startBattle,
  getBattleState,
  generateTurnChallenge,
  attackBoss,
  retryBattle
};