// backend/controllers/questController.js
const User = require('../models/user');
const Module = require('../models/module');
const Progress = require('../models/progress');
const Activity = require('../models/activity');

// XP required to reach the next level
const computeNextLevelXP = (level) => level * (level + 1) * 50;

// POST /api/quests/complete
// body: { moduleId, questId }
exports.completeQuest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId, questId } = req.body;

    if (!moduleId || !questId) {
      return res.status(400).json({ message: "moduleId and questId are required" });
    }

    // Fetch module and quest
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const quest = module.quests.id(questId);
    if (!quest) return res.status(404).json({ message: "Quest not found" });

    // Get or create progress doc
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId, completedQuests: [], completedModules: [] });
    }

    // Prevent duplicate completion
    const alreadyCompleted = progress.completedQuests.some(
      (cq) =>
        String(cq.moduleId) === String(moduleId) &&
        String(cq.questId) === String(questId)
    );
    if (alreadyCompleted) {
      return res.status(200).json({ message: "Quest already completed" });
    }

    // Award XP for quest
    const xpEarned = quest.xp || 0;

    // Log quest completion
    await Activity.create({
      userId,
      type: "quest_complete",
      message: `Completed Quest: ${quest.title}`,
      icon: "check",
    });

    // Save quest completion
    progress.completedQuests.push({
      moduleId,
      questId,
      xpEarned,
    });
    await progress.save();

    // Load user for XP update
    const user = await User.findById(userId);
    user.xp = (user.xp || 0) + xpEarned;

    // Check if module completed
    const totalQuests = module.quests.length;
    const completedCount = progress.completedQuests.filter(
      (cq) => String(cq.moduleId) === String(moduleId)
    ).length;

    let moduleBonus = 0;
    if (completedCount >= totalQuests) {
      const alreadyModule = progress.completedModules.some(
        (m) => String(m) === String(moduleId)
      );

      if (!alreadyModule) {
        progress.completedModules.push(moduleId);
        await progress.save();

        // Bonus XP for module completion
        moduleBonus = module.xp || 0;
        user.xp += moduleBonus;

        // Log module completion
        await Activity.create({
          userId,
          type: "module_complete",
          message: `Completed Module: ${module.title}`,
          icon: "trophy",
        });
      }
    }

    // LEVEL UP LOGIC
    let leveled = false;
    while (user.xp >= computeNextLevelXP(user.level)) {
      user.level += 1;
      leveled = true;

      // Create level-up activity
      await Activity.create({
        userId,
        type: "level_up",
        message: `You reached Level ${user.level}!`,
        icon: "rocket",
      });
    }

    await user.save();

    return res.json({
      message: "Quest completed",
      xpEarned,
      moduleBonus,
      newXP: user.xp,
      level: user.level,
      leveled,
    });
  } catch (err) {
    console.error("Complete quest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
