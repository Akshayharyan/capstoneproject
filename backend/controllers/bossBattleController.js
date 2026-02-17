const Progress = require("../models/progress");
const Boss = require("../models/Boss");

/* ===============================
   START BOSS FIGHT
=============================== */
exports.startBossFight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId, bossId } = req.body;

    const boss = await Boss.findById(bossId);
    if (!boss) return res.status(404).json({ message: "Boss not found" });

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    let fight = progress.bossFights.find(
      f => String(f.moduleId) === String(moduleId)
    );

    // If already defeated → don't restart
    if (fight && fight.defeated) {
      return res.json(fight);
    }

    // If not exist → create
    if (!fight) {
      fight = {
        moduleId,
        bossId,
        currentHp: boss.hp,
        maxHp: boss.hp,
        defeated: false,
      };

      progress.bossFights.push(fight);
      await progress.save();
    }

    res.json(fight);
  } catch (err) {
    console.error("Start boss fight error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   APPLY DAMAGE
=============================== */
exports.damageBoss = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId, taskType, success } = req.body;o

    const progress = await Progress.findOne({ userId });
    const fight = progress.bossFights.find(
      f => String(f.moduleId) === String(moduleId)
    );

    if (!fight || fight.defeated)
      return res.json({ fight });

    // SUCCESS → DAMAGE BOSS
    if (success) {
      let damage = 0;
      if (taskType === "quiz") damage = 40;
      if (taskType === "bugfix") damage = 80;
      if (taskType === "coding") damage = 120;

      fight.currentHp -= damage;

      if (fight.currentHp <= 0) {
        fight.currentHp = 0;
        fight.defeated = true;

        if (!progress.completedModules.includes(moduleId))
          progress.completedModules.push(moduleId);
      }
    }

    // ❌ FAIL → BOSS ATTACK
    else {
      const bossDamage = 30 + Math.floor(Math.random() * 40);
      fight.playerHp -= bossDamage;

      if (fight.playerHp <= 0) {
        fight.playerHp = 0;
        fight.failed = true;
      }
    }

    await progress.save();
    res.json(fight);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
