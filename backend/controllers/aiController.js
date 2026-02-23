const Module = require("../models/module");

/* ======================================================
   GENERATE + SAVE TEST CASES (SMART FALLBACK)
====================================================== */

exports.generateAndSaveTestCases = async (req, res) => {
  try {
    const { moduleId, topicIndex, taskIndex } = req.params;

    const module = await Module.findById(moduleId);
    if (!module)
      return res.status(404).json({ success: false, message: "Module not found" });

    const task = module.topics[Number(topicIndex)]?.tasks[Number(taskIndex)];
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    const prompt = task.codingPrompt || "";

    let testCases = [];

    /* ===== SMART RULE BASED GENERATION ===== */

    if (prompt.toLowerCase().includes("factorial")) {
      testCases = [
        { input: 1, output: 1 },
        { input: 2, output: 2 },
        { input: 5, output: 120 },
        { input: 7, output: 5040 },
        { input: 10, output: 3628800 },
      ];
    }

    else if (prompt.toLowerCase().includes("sum")) {
      testCases = [
        { input: [1, 2], output: 3 },
        { input: [5, 7], output: 12 },
        { input: [10, 20], output: 30 },
      ];
    }

    else {
      testCases = [
        { input: 1, output: null },
        { input: 2, output: null },
      ];
    }

    /* ===== SAVE TO MONGODB ===== */

    task.testCases = testCases;
    await module.save();

    res.json({
      success: true,
      testCases,
    });

  } catch (err) {
    console.error("Testcase error:", err);
    res.status(500).json({ success: false, message: "Generation failed" });
  }
};