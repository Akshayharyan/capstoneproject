const jsEvaluator = require("./jsEvaluator");
const pythonEvaluator = require("./pythonEvaluator");
const htmlEvaluator = require("./htmlEvaluator");
const cssEvaluator = require("./cssEvaluator");

/**
 * Registry of all available language evaluators
 */
const evaluators = {
  js: jsEvaluator,
  javascript: jsEvaluator,
  python: pythonEvaluator,
  py: pythonEvaluator,
  html: htmlEvaluator,
  css: cssEvaluator,
  c: null, // Placeholder for future C support
  cpp: null,
  'c++': null,
  java: null,
  sql: null
};

/**
 * Main grading function
 * Routes to appropriate language evaluator
 */
async function gradeSubmission(code, task) {
  if (!task || !task.language) {
    return {
      passed: false,
      error: "Language not specified",
      message: "Task must include 'language' field"
    };
  }

  const language = task.language.toLowerCase().trim();
  const evaluator = evaluators[language];

  if (!evaluator) {
    return {
      passed: false,
      error: `No grader for language: ${language}`,
      message: `Supported languages: ${Object.keys(evaluators).filter(k => evaluators[k]).join(", ")}`
    };
  }

  try {
    // Use validation + execution for languages that support it
    if (task.testCases && evaluator.evaluate) {
      if (language === "python" || language === "py") {
        // Python evaluator is async
        return await evaluator.evaluate(code, task);
      } else {
        // JavaScript evaluators are sync
        return evaluator.evaluate(code, task);
      }
    } else if (evaluator.evaluate) {
      // Fallback to evaluate method
      return evaluator.evaluate(code, task.rules || {});
    } else {
      return {
        passed: false,
        error: `Evaluator for ${language} does not support this task type`
      };
    }
  } catch (err) {
    console.error(`Error grading ${language} submission:`, err);
    return {
      passed: false,
      error: err.message || "Unknown grading error",
      message: "Grading failed due to internal error"
    };
  }
}

/**
 * Execute code with test cases
 * (Used by codeExecutionController for running user code)
 */
async function executeCode(code, task) {
  if (!task || !task.language) {
    return {
      success: false,
      error: "Language not specified"
    };
  }

  const language = task.language.toLowerCase().trim();
  const evaluator = evaluators[language];

  if (!evaluator || !evaluator.execute) {
    return {
      success: false,
      error: `No executor for language: ${language}`
    };
  }

  try {
    const testCases = task.testCases || [];
    
    if (language === "python" || language === "py") {
      return await evaluator.execute(code, testCases, task.options || {});
    } else {
      return evaluator.execute(code, testCases, task.options || {});
    }
  } catch (err) {
    console.error(`Error executing ${language} code:`, err);
    return {
      success: false,
      error: err.message || "Execution failed",
      results: []
    };
  }
}

/**
 * Validate code without running tests
 */
function validateCode(code, task) {
  if (!task || !task.language) {
    return {
      valid: false,
      errors: ["Language not specified"]
    };
  }

  const language = task.language.toLowerCase().trim();
  const evaluator = evaluators[language];

  if (!evaluator || !evaluator.validate) {
    return {
      valid: false,
      errors: [`No validator for language: ${language}`]
    };
  }

  try {
    return evaluator.validate(code, task.rules || {});
  } catch (err) {
    console.error(`Error validating ${language} code:`, err);
    return {
      valid: false,
      errors: [err.message || "Validation failed"]
    };
  }
}

/**
 * Get list of supported languages
 */
function getSupportedLanguages() {
  return Object.keys(evaluators)
    .filter(lang => evaluators[lang] !== null)
    .reduce((acc, lang) => {
      if (!acc.includes(lang)) {
        acc.push(lang);
      }
      return acc;
    }, []);
}

module.exports = gradeSubmission;
module.exports.gradeSubmission = gradeSubmission;
module.exports.executeCode = executeCode;
module.exports.validateCode = validateCode;
module.exports.getSupportedLanguages = getSupportedLanguages;
module.exports.evaluators = evaluators;
