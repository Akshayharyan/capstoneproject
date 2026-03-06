const Boss = require("../models/Boss");
const BossChallenge = require("../models/BossChallenge");

/* =========================================
   CREATE BOSS (1 PER MODULE)
========================================= */
const createBoss = async (req, res) => {
  try {
    const {
      moduleId,
      name,
      theme,
      image,
      maxHp,
      baseAttackPower,
      xpReward,
      phases
    } = req.body;

    // Check if boss already exists for module
    const existing = await Boss.findOne({ moduleId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Boss already exists for this module"
      });
    }

    const boss = await Boss.create({
      moduleId,
      name,
      theme,
      image,
      maxHp,
      baseAttackPower,
      xpReward,
      phases
    });

    res.json({ success: true, boss });

  } catch (err) {
    console.error("Create boss error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   UPDATE BOSS
========================================= */
const updateBoss = async (req, res) => {
  try {
    const { bossId } = req.params;

    const updated = await Boss.findByIdAndUpdate(
      bossId,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Boss not found" });
    }

    res.json({ success: true, boss: updated });

  } catch (err) {
    console.error("Update boss error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   GET BOSS BY MODULE
========================================= */
const getBossByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const boss = await Boss.findOne({ moduleId });

    if (!boss) {
      return res.json({ success: true, boss: null });
    }

    res.json({ success: true, boss });

  } catch (err) {
    console.error("Get boss error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   ADD SIGNATURE CHALLENGE
========================================= */
const addSignatureChallenge = async (req, res) => {
  try {
    const { bossId } = req.params;

    const boss = await Boss.findById(bossId);
    if (!boss) {
      return res.status(404).json({ message: "Boss not found" });
    }

    const challenge = await BossChallenge.create({
      bossId,
      moduleId: boss.moduleId,
      ...req.body
    });

    res.json({ success: true, challenge });

  } catch (err) {
    console.error("Add challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   GET SIGNATURE CHALLENGES
========================================= */
const getSignatureChallenges = async (req, res) => {
  try {
    const { bossId } = req.params;

    const challenges = await BossChallenge.find({ bossId });

    res.json({ success: true, challenges });

  } catch (err) {
    console.error("Get challenges error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   DELETE SIGNATURE CHALLENGE
========================================= */
const deleteSignatureChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    await BossChallenge.findByIdAndDelete(challengeId);

    res.json({ success: true });

  } catch (err) {
    console.error("Delete challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBoss,
  updateBoss,
  getBossByModule,
  addSignatureChallenge,
  getSignatureChallenges,
  deleteSignatureChallenge
};