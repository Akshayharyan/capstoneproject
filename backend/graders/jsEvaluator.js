const { VM } = require("vm2");

/**
 * Execute JavaScript code with support for multiple modes:
 * - Function mode: solution(input) => output
 * - Module mode: module.exports = { testFn() {} }
 * - Script mode: Any arbitrary JS code
 */
function executeCode(code, testCases, executionMode = "auto") {
  const results = [];
  let passed = 0;
  let executionError = null;

  for (let testCase of testCases) {
    try {
      const result = runSingleTest(code, testCase, executionMode);
      
      const success =
        String(result.output).trim() === String(testCase.output).trim();

      if (success) passed++;

      results.push({
        input: testCase.input,
        expected: testCase.output,
        received: result.output,
        success,
        logs: result.logs
      });
    } catch (err) {
      results.push({
        input: testCase.input,
        expected: testCase.output,
        error: err.message,
        success: false,
        logs: []
      });
    }
  }

  return {
    total: testCases.length,
    passed,
    success: passed === testCases.length,
    results,
    error: executionError
  };
}

function runSingleTest(userCode, testCase, mode = "auto") {
  const vm = new VM({
    timeout: 5000,
    sandbox: {
      console: createConsoleProxy(),
      global: {},
      Buffer: Buffer,
      setTimeout: undefined,
      setInterval: undefined,
      setImmediate: undefined
    }
  });

  const consoleLogs = [];
  const consoleProxy = createConsoleProxy(consoleLogs);

  const sandbox = {
    console: consoleProxy,
    global: {},
    Buffer: Buffer,
    input: testCase.input,
    INPUT: testCase.input,
    testInput: testCase.input,
    setTimeout: undefined,
    setInterval: undefined
  };

  const wrappedCode = `
    // Initialize module object at the start
    const module = { exports: {} };
    const exports = module.exports;
    let __result = undefined;
    let __output = undefined;
    const __consoleLogs = [];
    
    // User code execution
    try {
      ${userCode}
    } catch (e) {
      throw new Error("User code error: " + e.message);
    }

    // Output determination logic (priority order)
    if (typeof __result !== "undefined") {
      __output = __result;
    } else if (typeof solution === "function") {
      __output = solution(${JSON.stringify(testCase.input)});
    } else if (typeof solve === "function") {
      __output = solve(${JSON.stringify(testCase.input)});
    } else if (typeof test === "function") {
      __output = test(${JSON.stringify(testCase.input)});
    } else if (typeof module !== "undefined" && typeof module.exports === "function") {
      __output = module.exports(${JSON.stringify(testCase.input)});
    } else if (typeof module !== "undefined" && module.exports && typeof module.exports === "object") {
      if (typeof module.exports.solution === "function") {
        __output = module.exports.solution(${JSON.stringify(testCase.input)});
      } else if (typeof module.exports.solve === "function") {
        __output = module.exports.solve(${JSON.stringify(testCase.input)});
      } else if (typeof module.exports.test === "function") {
        __output = module.exports.test(${JSON.stringify(testCase.input)});
      }
    }

    // Return the result
    __output;
  `;

  try {
    const moduleObj = { exports: {} };
    
    const sandbox2 = {
      console: consoleProxy,
      Buffer: Buffer,
      module: moduleObj,
      exports: moduleObj.exports,
      input: testCase.input,
      INPUT: testCase.input,
      testInput: testCase.input
    };

    const vm2 = new VM({
      timeout: 5000,
      sandbox: sandbox2
    });

    const output = vm2.run(wrappedCode);

    return {
      output: output,
      logs: consoleLogs
    };
  } catch (err) {
    throw new Error(`Execution failed: ${err.message}`);
  }
}

function createConsoleWrapper() {
  return `
    const __originalConsole = console;
    const __consoleLogs = [];
    
    const console = {
      log: function(...args) {
        const formatted = args
          .map(arg => {
            if (typeof arg === "string") return arg;
            if (typeof arg === "object") {
              try { return JSON.stringify(arg); }
              catch (e) { return String(arg); }
            }
            return String(arg);
          })
          .join(" ");
        __consoleLogs.push(formatted);
        return formatted;
      },
      error: function(...args) { return console.log(...args); },
      warn: function(...args) { return console.log(...args); },
      info: function(...args) { return console.log(...args); },
      debug: function(...args) { return console.log(...args); }
    };
  `;
}

function createConsoleProxy(logs = []) {
  return {
    log: function(...args) {
      const formatted = args
        .map(arg => {
          if (typeof arg === "string") return arg;
          if (typeof arg === "object") {
            try { return JSON.stringify(arg); }
            catch (e) { return String(arg); }
          }
          return String(arg);
        })
        .join(" ");
      logs.push(formatted);
      return formatted;
    },
    error: function(...args) { return this.log(...args); },
    warn: function(...args) { return this.log(...args); },
    info: function(...args) { return this.log(...args); },
    debug: function(...args) { return this.log(...args); }
  };
}

/**
 * Validate JavaScript code against rules (syntax, required patterns, etc.)
 */
exports.validate = (code, rules = {}) => {
  const errors = [];

  // Check for required functions/variables
  if (rules.requiredFunctions) {
    rules.requiredFunctions.forEach(fn => {
      const fnRegex = new RegExp(`function\\s+${fn}\\s*\\(|const\\s+${fn}\\s*=|let\\s+${fn}\\s*=`);
      if (!fnRegex.test(code)) {
        errors.push(`Function or variable "${fn}" is required`);
      }
    });
  }

  // Check for required patterns
  if (rules.requiredPatterns) {
    rules.requiredPatterns.forEach(pattern => {
      if (!new RegExp(pattern).test(code)) {
        errors.push(`Code must match pattern: ${pattern}`);
      }
    });
  }

  // Check for forbidden keywords/patterns
  if (rules.forbidden) {
    rules.forbidden.forEach(keyword => {
      if (code.includes(keyword)) {
        errors.push(`"${keyword}" is not allowed`);
      }
    });
  }

  // Check syntax validity
  try {
    new Function(code);
  } catch (err) {
    errors.push(`Syntax error: ${err.message}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Grade submission by validating rules and executing test cases
 */
exports.evaluate = (code, task = {}) => {
  // First validate the code
  const validation = exports.validate(code, task.rules || {});
  
  if (!validation.valid) {
    return {
      passed: false,
      validation: validation,
      execution: null,
      message: "Code validation failed"
    };
  }

  // Execute test cases
  const testCases = task.testCases || [];
  const execution = executeCode(code, testCases, task.executionMode || "auto");

  return {
    passed: execution.success,
    validation: validation,
    execution: execution,
    message: execution.success 
      ? `All tests passed (${execution.passed}/${execution.total})`
      : `${execution.passed}/${execution.total} tests passed`
  };
};

/**
 * Execute code with test cases (used by codeExecutionController)
 */
exports.execute = (code, testCases = [], options = {}) => {
  return executeCode(code, testCases, options.mode || "auto");
};

module.exports.executeCode = executeCode;
module.exports.runSingleTest = runSingleTest;
