const Module = require("../models/module");
const Achievement = require("../models/Achievement");

/* ================= GET MODULES ================= */

exports.getAssignedModules = async (req, res) => {
  const modules = await Module.find().select("title description topics");

  res.json(
    modules.map(m => ({
      moduleId: m._id,
      title: m.title,
      description: m.description,
      topicsCount: m.topics.length
    }))
  );
};

/* ================= SINGLE MODULE ================= */

exports.getSingleModule = async (req, res) => {
  const module = await Module.findById(req.params.moduleId);
  if (!module) return res.status(404).json({ success: false });

  res.json({ success: true, module });
};

/* ================= ADD TOPIC ================= */

exports.addTopic = async (req, res) => {
  const module = await Module.findById(req.params.moduleId);

  module.topics.push({
    title: req.body.title,
    videoUrl: req.body.videoUrl,
    xp: req.body.xp || 100,
    tasks: []
  });

  await module.save();
  res.json({ success: true, module });
};

/* ================= ADD TASK ================= */

exports.addTaskToTopic = async (req, res) => {
  try {
    const { moduleId, topicIndex } = req.params;
    const {
      type,
      title,
      description,
      starterCode,
      buggyCode,
      options,
      correctOption
    } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ success: false });

    const topic = module.topics[topicIndex];
    if (!topic) return res.status(404).json({ success: false });

    let content = {};

    if (type === "coding") {
      content.coding = {
        prompt: description,
        starterCode: starterCode || "",
        testCases: []
      };
    }

    if (type === "quiz") {
      content.quiz = {
        question: description,
        options,
        correctIndex: correctOption
      };
    }

    if (type === "bugfix") {
      const buggy = buggyCode || starterCode;

      if (!buggy || !buggy.trim())
        return res.status(400).json({
          success: false,
          message: "Buggy code required"
        });

      content.bugfix = {
        buggyCode: buggy,
        hint: description,
        testCases: []   // ✅ IMPORTANT
      };
    }

    topic.tasks.push({
      type,
      title,
      content,
      xp: 10
    });

    await module.save();

    res.json({ success: true, tasks: topic.tasks });

  } catch (err) {
    console.error("Add task error:", err);
    res.status(500).json({ success: false });
  }
};

/* ================= GET TASKS ================= */

exports.getTopicTasks = async (req, res) => {
  const module = await Module.findById(req.params.moduleId);
  const topic = module?.topics[req.params.topicIndex];

  if (!topic) return res.status(404).json({ success: false });

  res.json({ success: true, tasks: topic.tasks });
};

/* ================= DELETE TASK ================= */

exports.deleteTaskFromTopic = async (req, res) => {
  const { moduleId, topicIndex, taskIndex } = req.params;

  const module = await Module.findById(moduleId);
  if (!module) return res.status(404).json({ success: false });

  module.topics[topicIndex].tasks.splice(taskIndex, 1);

  await module.save({ validateBeforeSave: false });

  res.json({ success: true });
};

/* ================= ADD TEST CASE ================= */

exports.addTestCase = async (req, res) => {
  const { moduleId, topicIndex, taskIndex } = req.params;
  const { input, output } = req.body;

  const module = await Module.findById(moduleId);
  const task = module?.topics?.[topicIndex]?.tasks?.[taskIndex];

  if (!task) return res.status(404).json({ success: false });

  if (task.type === "coding") {
    task.content.coding.testCases.push({ input, output });
  }

  if (task.type === "bugfix") {
    task.content.bugfix.testCases.push({ input, output });
  }

  await module.save();

  res.json({
    success: true,
    tasks: module.topics[topicIndex].tasks
  });
};

/* ================= UPDATE TEST CASE ================= */

exports.updateTestCase = async (req, res) => {
  const { moduleId, topicIndex, taskIndex, testCaseIndex } = req.params;
  const { input, output } = req.body;

  const module = await Module.findById(moduleId);
  const task = module?.topics?.[topicIndex]?.tasks?.[taskIndex];

  if (!task) return res.status(404).json({ success: false });

  let testCases = [];
  if (task.type === "coding") testCases = task.content.coding.testCases;
  if (task.type === "bugfix") testCases = task.content.bugfix.testCases;

  if (!testCases[testCaseIndex])
    return res.status(404).json({ success: false, message: "Test case not found" });

  testCases[testCaseIndex] = { input, output };

  await module.save();

  res.json({
    success: true,
    tasks: module.topics[topicIndex].tasks
  });
};

/* ================= DELETE TEST CASE ================= */

exports.deleteTestCase = async (req, res) => {
  const { moduleId, topicIndex, taskIndex, testCaseIndex } = req.params;

  const module = await Module.findById(moduleId);
  const task = module?.topics?.[topicIndex]?.tasks?.[taskIndex];

  if (!task) return res.status(404).json({ success: false });

  let testCases = [];
  if (task.type === "coding") testCases = task.content.coding.testCases;
  if (task.type === "bugfix") testCases = task.content.bugfix.testCases;

  if (!testCases[testCaseIndex])
    return res.status(404).json({ success: false, message: "Test case not found" });

  testCases.splice(testCaseIndex, 1);

  await module.save();

  res.json({
    success: true,
    tasks: module.topics[topicIndex].tasks
  });
};

/* ================= UPDATE TASK ================= */

exports.updateTaskInTopic = async (req, res) => {
  const { moduleId, topicIndex, taskIndex } = req.params;
  const { title, description, starterCode, options, correctOption } = req.body;

  const module = await Module.findById(moduleId);
  const task = module.topics[topicIndex].tasks[taskIndex];

  task.title = title;

  if (task.type === "coding") {
    task.content.coding.prompt = description;
    task.content.coding.starterCode = starterCode;
  }

  if (task.type === "quiz") {
    task.content.quiz.question = description;
    task.content.quiz.options = options;
    task.content.quiz.correctIndex = correctOption;
  }

  if (task.type === "bugfix") {
    task.content.bugfix.buggyCode = starterCode;
    task.content.bugfix.hint = description;
  }

  await module.save();

  res.json({
    success: true,
    tasks: module.topics[topicIndex].tasks
  });
};

/* ================= ACHIEVEMENT ================= */

exports.createAchievement = async (req, res) => {
  const achievement = await Achievement.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.json({ success: true, achievement });
};

/* ================= ASSIGN BOSS ================= */

exports.assignBossToModule = async (req, res) => {
  const module = await Module.findById(req.params.moduleId);
  module.boss = req.body.bossId;

  await module.save();
  res.json({ success: true, module });
};