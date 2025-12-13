const Module = require("../models/module");
const Assignment = require("../models/Assignment");

// 1) Get assigned modules (NULL-SAFE)
exports.getAssignedModules = async (req, res) => {
  try {
    const traineeId = req.user._id;

    const assignments = await Assignment.find({ trainee: traineeId })
      .populate("module", "title description topics");

    // Filter out broken assignments (module deleted or not populated)
    const formatted = assignments
      .filter(a => a.module) // 🔐 IMPORTANT FIX
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

// 2) Get single module
exports.getSingleModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  } catch (error) {
    console.error("Error fetching module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3) Add topic
exports.addTopic = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Topic title required" });

    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    module.topics.push({ title, levels: [] });
    await module.save();

    res.json({ message: "Topic added", module });
  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 4) Create level
exports.createLevel = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;
    const { title, contentMarkdown, content, xp } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const levelNumber = topic.levels.length + 1;

    const newLevel = {
      number: levelNumber,
      title: title || `Level ${levelNumber}`,
      contentMarkdown: contentMarkdown || content || "",
      xp: Number(xp) || 0,
      tasks: [],
    };

    topic.levels.push(newLevel);
    await module.save();

    res.json({
      message: "Level created",
      levelIndex: topic.levels.length - 1,
    });
  } catch (error) {
    console.error("Create level error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 5) Add task to level
exports.addTaskToLevel = async (req, res) => {
  try {
    const { moduleId, topicIndex, levelIndex } = req.params;
    const payload = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const level = topic.levels[levelIndex];
    if (!level) return res.status(404).json({ message: "Level not found" });

    const task = {
      type: payload.type,
      xp: Number(payload.xp) || 0,
    };

    if (payload.type === "quiz") {
      task.question = payload.question;
      task.options = payload.options || [];
      task.correctAnswer =
        typeof payload.correctAnswer === "number"
          ? task.options[payload.correctAnswer] || ""
          : payload.correctAnswer || "";
    } else if (payload.type === "coding") {
      task.codingPrompt = payload.codingPrompt || "";
      task.starterCode = payload.starterCode || "";
      task.testCases = Array.isArray(payload.testCases)
        ? payload.testCases
        : [];
    } else {
      return res.status(400).json({ message: "Invalid task type" });
    }

    level.tasks.push(task);
    await module.save();

    res.json({ message: "Task added", task });
  } catch (error) {
    console.error("Add task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 6) Get tasks of a level
exports.getLevelTasks = async (req, res) => {
  try {
    const { moduleId, topicIndex, levelIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const level = topic.levels[levelIndex];
    if (!level) return res.status(404).json({ message: "Level not found" });

    res.json({ tasks: level.tasks || [] });
  } catch (error) {
    console.error("Get level tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 7) Delete task
exports.deleteTaskFromLevel = async (req, res) => {
  try {
    const { moduleId, topicIndex, levelIndex, taskIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const level = topic.levels[levelIndex];
    if (!level || !level.tasks[taskIndex])
      return res.status(404).json({ message: "Task not found" });

    level.tasks.splice(taskIndex, 1);
    await module.save();

    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
