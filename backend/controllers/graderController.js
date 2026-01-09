const Module = require("../models/module");
const Progress = require("../models/progress");

/* ======================================================
   📌 AUTO GRADER – CODING TASK (HTML ONLY)
====================================================== */
exports.gradeCodingTask = async (req, res) => {
  try {
    const { moduleId, topicIndex, taskIndex, code } = req.body;
    const userId = req.user._id;

    /* ===============================
       BASIC VALIDATION
    ============================== */
    if (!code || code.trim().length === 0) {
      return res.json({
        success: false,
        message: "Code cannot be empty",
      });
    }

    if (
      moduleId === undefined ||
      topicIndex === undefined ||
      taskIndex === undefined
    ) {
      return res.json({
        success: false,
        message: "Invalid grading request",
      });
    }

    /* ===============================
       FETCH MODULE / TOPIC / TASK
    ============================== */
    const module = await Module.findById(moduleId).lean();
    if (!module) {
      return res.json({
        success: false,
        message: "Module not found",
      });
    }

    const topic = module.topics?.[Number(topicIndex)];
    if (!topic) {
      return res.json({
        success: false,
        message: "Topic not found",
      });
    }

    const task = topic.tasks?.[Number(taskIndex)];
    if (!task || task.type !== "coding") {
      return res.json({
        success: false,
        message: "Invalid coding task",
      });
    }

    /* ===============================
       HTML VALIDATION (STATIC ANALYSIS)
    ============================== */
    const normalized = code
      .toLowerCase()
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const hasH1 =
      /<h1[^>]*>\s*welcome to html\s*<\/h1>/.test(normalized);

    const hasP =
      /<p[^>]*>\s*this is my first web page\s*<\/p>/.test(normalized);

    if (!hasH1 || !hasP) {
      return res.json({
        success: false,
        message:
          "❌ Invalid HTML. Required:\n<h1>Welcome to HTML</h1>\n<p>This is my first web page</p>",
      });
    }

    /* ===============================
       MARK CODING COMPLETED (NO XP)
    ============================== */
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    let topicProgress = progress.topics.find(
      (t) =>
        String(t.moduleId) === String(moduleId) &&
        t.topicIndex === Number(topicIndex)
    );

    if (!topicProgress) {
      progress.topics.push({
        moduleId,
        topicIndex: Number(topicIndex),
        videoCompleted: false,
        quizCompleted: false,
        codingCompleted: true,
        xpAwarded: false,
      });
    } else {
      topicProgress.codingCompleted = true;
    }

    await progress.save();

    /* ===============================
       SUCCESS
    ============================== */
    return res.json({
      success: true,
      message: "HTML structure is correct 🎉",
    });
  } catch (err) {
    console.error("Grader error:", err);
    return res.status(500).json({
      success: false,
      message: "Grading failed",
    });
  }
};
