const Module = require("../models/module");
const Progress = require("../models/progress");
const User = require("../models/User");

/* ===============================
   GET MODULES WITH STATUS + PROGRESS
================================ */
exports.getModulesWithStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const modules = await Module.find().lean();
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({ userId });
    }

    const result = modules.map((mod) => {
      const totalTopics = mod.topics.length;

     const completedTopics = progress.topics.filter(
  (t) =>
    String(t.moduleId) === String(mod._id) &&
    t.xpAwarded === true
).length;


      const percent =
        totalTopics === 0
          ? 0
          : Math.round((completedTopics / totalTopics) * 100);
let status = "not_started";

const hasStarted = progress.startedModules.some(
  (id) => String(id) === String(mod._id)
);

if (percent === 100) {
  status = "completed";
} else if (hasStarted) {
  status = "in_progress";
}


      return {
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        xp: totalTopics * 100,
        progress: percent,
        status,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   START MODULE
================================ */
exports.startModule = async (req, res) => {
  const { moduleId } = req.body;
  const userId = req.user._id;

  let progress = await Progress.findOne({ userId });
  if (!progress) progress = await Progress.create({ userId });

  if (!progress.startedModules.includes(moduleId)) {
    progress.startedModules.push(moduleId);
    await progress.save();
  }

  res.json({ message: "Module started" });
};

/* ===============================
   COMPLETE TOPIC (XP ONLY ONCE)
================================ */
exports.completeTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.body;
    const userId = req.user._id;

    const module = await Module.findById(moduleId);
    const user = await User.findById(userId);
    if (!module || !user) {
      return res.status(404).json({ message: "Not found" });
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    // 🔥 MARK MODULE STARTED
    if (!progress.startedModules.includes(moduleId)) {
      progress.startedModules.push(moduleId);
    }

    let topicProgress = progress.topics.find(
      (t) => String(t.moduleId) === String(moduleId) && t.topicIndex === topicIndex
    );

    if (!topicProgress) {
      topicProgress = {
        moduleId,
        topicIndex,
        videoCompleted: true,
        quizCompleted: true,
        codingCompleted: true,
        xpAwarded: false,
      };
      progress.topics.push(topicProgress);
    }

    // 🔒 XP ONLY ONCE
    if (!topicProgress.xpAwarded) {
      const earnedXP = module.topics[topicIndex]?.xp || 0;
      user.xp += earnedXP;
      user.level = Math.floor(user.xp / 100) + 1;
      topicProgress.xpAwarded = true;
    }

    // 🔥 CHECK MODULE COMPLETION
    const completedTopics = progress.topics.filter(
      (t) => String(t.moduleId) === String(moduleId) && t.xpAwarded
    ).length;

    if (completedTopics === module.topics.length) {
      if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
      }
    }

    await user.save();
    await progress.save();

    return res.json({
      success: true,
      user: { xp: user.xp, level: user.level },
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ===============================
   GET MODULE TOPICS WITH STATUS
   (AUTHORITATIVE UNLOCK LOGIC)
================================ */


/* ===============================
   GET MODULE TOPICS WITH STATUS
================================ */
exports.getModuleTopicsWithStatus = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;

    const module = await Module.findById(moduleId).lean();
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    // Map progress by topic index
    const progressMap = {};
    progress.topics
      .filter((t) => String(t.moduleId) === String(moduleId))
      .forEach((t) => {
        progressMap[t.topicIndex] = t;
      });

    let completedCount = 0;

    const topics = module.topics.map((topic, index) => {
      const p = progressMap[index];

      const isCompleted = p?.xpAwarded === true;


      if (isCompleted) completedCount++;

      let status = "locked";

if (isCompleted) {
  status = "completed";
} else if (index === 0) {
  status = "active";
} else {
  const prev = progressMap[index - 1];
  if (prev?.xpAwarded === true) {
    status = "active";
  }
}


      return {
        index,
        title: topic.title,
        xp: topic.xp,
        status,
      };
    });

    const progressPercent =
      module.topics.length === 0
        ? 0
        : Math.round((completedCount / module.topics.length) * 100);

    res.set("Cache-Control", "no-store"); // 🔥 IMPORTANT
    res.json({
      moduleTitle: module.title,
      progressPercent,
      topics,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   GET STARTED MODULES
================================ */
exports.getStartedModules = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId });
    if (!progress) return res.json([]);

    const modules = await Module.find({
      _id: { $in: progress.startedModules },
    });

    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};






exports.completeVideo = async (req, res) => {
  const { moduleId, topicIndex } = req.body;
  const userId = req.user._id;

  let progress = await Progress.findOne({ userId });
  if (!progress) progress = await Progress.create({ userId });

  let topicProgress = progress.topics.find(
    t => String(t.moduleId) === String(moduleId) && t.topicIndex === topicIndex
  );

  if (!topicProgress) {
    topicProgress = {
      moduleId,
      topicIndex,
      videoCompleted: true,
      quizCompleted: false,
      codingCompleted: false,
      xpAwarded: false,
    };
    progress.topics.push(topicProgress);
  } else {
    topicProgress.videoCompleted = true;
  }

  await progress.save();
  res.json({ success: true });
};






exports.completeQuiz = async (req, res) => {
  const { moduleId, topicIndex } = req.body;
  const userId = req.user._id;

  let progress = await Progress.findOne({ userId });
  if (!progress) progress = await Progress.create({ userId });

  let topicProgress = progress.topics.find(
    t => String(t.moduleId) === String(moduleId) && t.topicIndex === topicIndex
  );

  if (!topicProgress) {
    topicProgress = {
      moduleId,
      topicIndex,
      videoCompleted: false,
      quizCompleted: true,
      codingCompleted: false,
      xpAwarded: false,
    };
    progress.topics.push(topicProgress);
  } else {
    topicProgress.quizCompleted = true;
  }

  await progress.save();
  res.json({ success: true });
};
