const runInSandbox = require("../utils/sandboxRunner");

exports.runCode = (req, res) => {
  try {
    const { userCode, testCases } = req.body;

    if (!userCode || !testCases) {
      return res.status(400).json({ message: "Missing data" });
    }

    const result = runInSandbox(userCode, testCases);

    res.json(result);

  } catch (err) {
    console.error("Sandbox execution error:", err);
    res.status(500).json({
      message: "Execution failed",
      error: err.message
    });
  }
};
