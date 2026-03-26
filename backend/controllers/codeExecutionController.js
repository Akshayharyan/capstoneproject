const graderSystem = require("../graders");


/**
 * Execute code with test cases (Generic for all languages)
 * 
 * Request body:
 * {
 *   "language": "js|python|html|css",
 *   "userCode": "the user's code",
 *   "testCases": [
 *     { "input": "...", "output": "..." }
 *   ],
 *   "options": { "timeout": 5000 }
 * }
 */
exports.runCode = async (req, res) => {
  try {
    const { userCode, testCases, language, options } = req.body;

    // Validation
    if (!userCode) {
      return res.status(400).json({ message: "Missing userCode" });
    }

    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ message: "testCases must be an array" });
    }

    if (!language) {
      return res.status(400).json({ message: "language not specified" });
    }

    const task = {
      language: language.toLowerCase(),
      testCases: testCases,
      options: options || {}
    };

    // Execute code
    const result = await graderSystem.executeCode(userCode, task);

    res.json(result);

  } catch (err) {
    console.error("Code execution error:", err);
    res.status(500).json({
      message: "Execution failed",
      error: err.message
    });
  }
};

/**
 * Grade code submission with validation and test execution
 * 
 * Request body:
 * {
 *   "language": "js|python|html|css",
 *   "userCode": "the user's code",
 *   "testCases": [
 *     { "input": "...", "output": "..." }
 *   ],
 *   "rules": { "requiredFunctions": ["..."], "forbidden": ["..."] },
 *   "timeout": 5000
 * }
 */
exports.gradeCode = async (req, res) => {
  try {
    const { userCode, language, testCases, rules, timeout } = req.body;

    if (!userCode) {
      return res.status(400).json({ message: "Missing userCode" });
    }

    if (!language) {
      return res.status(400).json({ message: "language not specified" });
    }

    const task = {
      language: language.toLowerCase(),
      testCases: testCases || [],
      rules: rules || {},
      timeout: timeout || 5000
    };

    const result = await graderSystem.gradeSubmission(userCode, task);

    res.json(result);

  } catch (err) {
    console.error("Grading error:", err);
    res.status(500).json({
      message: "Grading failed",
      error: err.message
    });
  }
};

/**
 * Validate code without executing it
 * 
 * Request body:
 * {
 *   "language": "js|python|html|css",
 *   "userCode": "the user's code",
 *   "rules": { "requiredFunctions": ["..."], "forbidden": ["..."] }
 * }
 */
exports.validateCode = (req, res) => {
  try {
    const { userCode, language, rules } = req.body;

    if (!userCode) {
      return res.status(400).json({ message: "Missing userCode" });
    }

    if (!language) {
      return res.status(400).json({ message: "language not specified" });
    }

    const task = {
      language: language.toLowerCase(),
      rules: rules || {}
    };

    const result = graderSystem.validateCode(userCode, task);

    res.json(result);

  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({
      message: "Validation failed",
      error: err.message
    });
  }
};

/**
 * Get list of supported languages
 */
exports.getSupportedLanguages = (req, res) => {
  const languages = graderSystem.getSupportedLanguages();
  res.json({
    supported: languages,
    count: languages.length
  });
};
