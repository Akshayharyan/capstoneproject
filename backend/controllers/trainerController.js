const Module = require("../models/module");
const Assignment = require("../models/Assignment");

/* ======================================================
   1) Get assigned modules (NULL-SAFE)
====================================================== */
exports.getAssignedModules = async (req, res) => {
  try {
    const trainerId = req.user._id;

    const assignments = await Assignment.find({ trainer: trainerId })
      .populate("module", "title description topics");

    const formatted = assignments
      .filter(a => a.module)
      .map(a => ({
        assignmentId: a._id,
        moduleId: a.module._id,
        title: a.module.title,
        description: a.module.description,
        topicsCount: a.module.topics?.length || 0,
        createdAt: a.createdAt,
      }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetching assigned modules failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   2) Get single module
====================================================== */
exports.getSingleModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
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

    console.log("📥 Adding topic:", newTopic);

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
   4) ADD TASK TO TOPIC (QUIZ / CODING)
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
      task.testCases = Array.isArray(payload.testCases)
        ? payload.testCases
        : [];

      // 🔥 NEW (SAFE ADDITIONS)
      task.language = payload.language || "html";
      task.gradingRules = payload.gradingRules || {};
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
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const topic = module.topics[topicIndex];
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({ tasks: topic.tasks || [] });
  } catch (error) {
    console.error("Get topic tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   6) DELETE TASK FROM TOPIC
====================================================== */
exports.deleteTaskFromTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex, taskIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

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
