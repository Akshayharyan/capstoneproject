const htmlEvaluator = require("./htmlEvaluator");

const evaluators = {
  html: htmlEvaluator,
};

function gradeSubmission(code, task) {
  const evaluator = evaluators[task.language];

  if (!evaluator) {
    return {
      passed: false,
      errors: [`No grader for language: ${task.language}`],
    };
  }

  return evaluator.evaluate(code, task.gradingRules || {});
}

module.exports = gradeSubmission;
