const Module = require("../models/module");
const { runJS } = require("../services/jsRunner");

exports.gradeCode = async (req, res) => {
  try {
    const { moduleId, topicIndex, taskIndex, code } = req.body;

    const module = await Module.findById(moduleId);
    if (!module)
      return res.json({ success: false, message: "Module not found" });

    const task = module?.topics?.[topicIndex]?.tasks?.[taskIndex];
    if (!task)
      return res.json({ success: false, message: "Task not found" });

    let testCases = [];

    if (task.type === "coding") {
      testCases = task.content?.coding?.testCases || [];
    }

    if (task.type === "bugfix") {
      testCases = task.content?.bugfix?.testCases || [];
    }

    if (testCases.length === 0)
      return res.json({
        success: false,
        message: "No test cases found"
      });

    const result = await runJS(code, testCases);

    if (result.error)
      return res.json({
        success: false,
        message: result.error
      });

    const results = testCases.map((tc, i) => ({
      input: tc.input,
      expected: String(tc.output),
      actual: String(result.output[i]),
      pass: String(tc.output) === String(result.output[i])
    }));

    const allPassed = results.every(r => r.pass);

    res.json({
      success: allPassed,
      results,
      message: allPassed ? "All tests passed" : "Tests failed"
    });

  } catch (err) {
    console.error("Grader error:", err);
    res.status(500).json({
      success: false,
      message: "Grading failed"
    });
  }
};