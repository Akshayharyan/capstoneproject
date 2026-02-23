const { runJavaScript } = require("../services/codeRunner");
const Module = require("../models/module");

exports.runCode = async (req, res) => {
  try {
    const { moduleId, topicIndex, taskIndex, code } = req.body;

    const module = await Module.findById(moduleId);
    const task =
      module.topics[topicIndex].tasks[taskIndex];

    const testCases = task.testCases;

    const results = await runJavaScript(code, testCases);

    if (results.error) {
      return res.json({ success: false, message: results.error });
    }

    const allPassed = results.every(r => r.pass);

    res.json({
      success: true,
      passed: allPassed,
      results,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Judge error" });
  }
};