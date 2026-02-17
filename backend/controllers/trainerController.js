const Module = require("../models/module");
const Assignment = require("../models/Assignment");
const Achievement = require("../models/Achievement");

console.log("Achievement model type:", typeof Achievement);

/* ======================================================
   1) GET ASSIGNED MODULES
====================================================== */
exports.getAssignedModules = async (req, res) => {
  try {
    const trainerId = req.user._id;

    const assignments = await Assignment.find({ trainer: trainerId })
      .populate("module", "title description topics boss");

    const formatted = assignments
      .filter(a => a.module)
      .map(a => ({
        assignmentId: a._id,
        moduleId: a.module._id,
        title: a.module.title,
        description: a.module.description,
        topicsCount: a.module.topics?.length || 0,
        boss: a.module.boss || null,
        createdAt: a.createdAt,
      }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetching assigned modules failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   2) GET SINGLE MODULE
====================================================== */
exports.getSingleModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId).populate("boss");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json(module);
  } catch (error) {
    console.error("Error fetching module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   3) ADD TOPIC
====================================================== */
exports.addTopic = async (req, res) => {
  try {
    const { title, videoUrl, xp } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        message: "Topic title and video URL are required",
      });
    }

    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const newTopic = {
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      xp: Number(xp) || 0,
      tasks: [],
    };

    module.topics.push(newTopic);
    await module.save();

    res.json({
      message: "Topic added successfully",
      module,
    });
  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   4) ADD TASK TO TOPIC
====================================================== */
exports.addTaskToTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;
    const payload = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const topic = module.topics[topicIndex];
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const task = {
      type: payload.type,
      xp: Number(payload.xp) || 0,
    };

    if (payload.type === "quiz") {
      task.question = payload.question || "";
      task.options = payload.options || [];
      task.correctAnswer = payload.correctAnswer || "";
    } 
    else if (payload.type === "coding") {
      task.codingPrompt = payload.codingPrompt || "";
      task.starterCode = payload.starterCode || "";
      task.testCases = Array.isArray(payload.testCases) ? payload.testCases : [];
      task.language = payload.language || "html";
      task.gradingRules = payload.gradingRules || {};
    } 
    else if (payload.type === "bugfix") {
      task.buggyCode = payload.buggyCode || "";
      task.expectedFix = payload.expectedFix || "";
      task.hint = payload.hint || "";
      task.language = payload.language || "js";
    }
    else {
      return res.status(400).json({ message: "Invalid task type" });
    }

    topic.tasks.push(task);
    await module.save();

    res.json({ message: "Task added", task });
  } catch (error) {
    console.error("Add task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   5) GET TASKS OF A TOPIC
====================================================== */
exports.getTopicTasks = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.json({ tasks: topic.tasks || [] });
  } catch (error) {
    console.error("Get topic tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   6) DELETE TASK
====================================================== */
exports.deleteTaskFromTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex, taskIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic || !topic.tasks[taskIndex]) {
      return res.status(404).json({ message: "Task not found" });
    }

    topic.tasks.splice(taskIndex, 1);
    await module.save();

    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   🏆 CREATE ACHIEVEMENT
====================================================== */
exports.createAchievement = async (req, res) => {
  try {
    const { title, description, icon, type, moduleId, targetValue } = req.body;

    const achievement = await Achievement.create({
      title,
      description,
      icon,
      type,
      moduleId,
      targetValue,
      createdBy: req.user._id,
    });

    res.json({ message: "Achievement created", achievement });
  } catch (err) {
    console.error("Create achievement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   🐲 ASSIGN BOSS TO MODULE (GAME SYSTEM)
====================================================== */
exports.assignBossToModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { bossId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    module.boss = bossId;
    await module.save();

    res.json({
      success: true,
      message: "Boss assigned successfully",
      module,
    });
  } catch (err) {
    console.error("Assign boss error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
d