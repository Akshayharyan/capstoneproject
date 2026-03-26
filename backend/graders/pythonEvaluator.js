const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

/**
 * Execute Python code with test cases
 * (Executes in separate process for security)
 */
function executeCode(code, testCases, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Generate temporary file name
    const tempId = crypto.randomBytes(8).toString("hex");
    const tempFile = path.join(__dirname, `../temp_python_${tempId}.py`);

    // Wrap user code with test execution harness
    const wrappedCode = createPythonHarness(code, testCases);

    // Write wrapped code to temporary file
    fs.writeFileSync(tempFile, wrappedCode, "utf8");

    try {
      // Spawn Python process
      const pythonProcess = spawn("python", [tempFile], {
        timeout: timeout,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {}

        if (code !== 0) {
          reject({
            error: `Python execution failed with code ${code}`,
            stderr: stderr,
            stdout: stdout
          });
          return;
        }

        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject({
            error: "Failed to parse Python output",
            stderr: stderr,
            stdout: stdout
          });
        }
      });

      pythonProcess.on("error", (err) => {
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {}
        reject({
          error: `Python process error: ${err.message}`,
          stderr: stderr
        });
      });
    } catch (err) {
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {}
      reject({
        error: `Failed to start Python: ${err.message}`
      });
    }
  });
}

/**
 * Create Python harness to wrap user code and run tests
 */
function createPythonHarness(userCode, testCases) {
  const testCasesJson = JSON.stringify(testCases);
  
  return `
import json
import sys
from io import StringIO

# Capture all output
output_capture = StringIO()
original_stdout = sys.stdout
sys.stdout = output_capture

try:
    # User code execution
    ${indentCode(userCode, 4)}
    
    # Results collection
    results = []
    test_cases = ${testCasesJson}
    
    for test_case in test_cases:
        try:
            test_input = test_case.get('input')
            expected = test_case.get('output')
            
            # Try to call solution function if exists
            if 'solution' in locals() and callable(solution):
                output = solution(test_input)
            elif 'solve' in locals() and callable(solve):
                output = solve(test_input)
            elif 'test' in locals() and callable(test):
                output = test(test_input)
            else:
                # Execute as script - re-run user code for each test
                output = None
                exec_globals = {}
                exec("""
${indentCode(userCode, 16)}
output = locals().get('result') or locals().get('output')
                """, exec_globals)
                output = exec_globals.get('output')
            
            success = str(output).strip() == str(expected).strip()
            results.append({
                'input': test_input,
                'expected': expected,
                'received': output,
                'success': success,
                'logs': []
            })
        except Exception as e:
            results.append({
                'input': test_case.get('input'),
                'expected': test_case.get('output'),
                'error': str(e),
                'success': False,
                'logs': []
            })
    
    passed = sum(1 for r in results if r.get('success'))
    output_result = {
        'total': len(test_cases),
        'passed': passed,
        'success': passed == len(test_cases),
        'results': results,
        'error': None
    }
except Exception as e:
    output_result = {
        'total': len(test_cases) if 'test_cases' in locals() else 0,
        'passed': 0,
        'success': False,
        'results': [],
        'error': f"Execution error: {str(e)}"
    }
finally:
    sys.stdout = original_stdout
    print(json.dumps(output_result))
`;
}

/**
 * Indent code for embedding in Python strings
 */
function indentCode(code, spaces) {
  const indent = " ".repeat(spaces);
  return code
    .split("\n")
    .map(line => {
      if (line.trim() === "") return "";
      return indent + line;
    })
    .join("\n");
}

/**
 * Validate Python code
 */
exports.validate = (code, rules = {}) => {
  const errors = [];

  // Check for required functions
  if (rules.requiredFunctions) {
    rules.requiredFunctions.forEach(fn => {
      if (!new RegExp(`def\\s+${fn}\\s*\\(`).test(code)) {
        errors.push(`Function "${fn}" is required`);
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

  // Check for forbidden keywords
  if (rules.forbidden) {
    rules.forbidden.forEach(keyword => {
      if (code.includes(keyword)) {
        errors.push(`"${keyword}" is not allowed`);
      }
    });
  }

  // Basic syntax check by trying to compile
  try {
    // Run basic Python compile check via subprocess
    // For now, we'll skip this to avoid subprocess overhead
  } catch (err) {
    errors.push(`Syntax error: ${err.message}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Evaluate Python submission
 */
exports.evaluate = async (code, task = {}) => {
  // First validate
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
  try {
    const testCases = task.testCases || [];
    const execution = await executeCode(code, testCases, task.timeout || 5000);

    return {
      passed: execution.success,
      validation: validation,
      execution: execution,
      message: execution.success
        ? `All tests passed (${execution.passed}/${execution.total})`
        : `${execution.passed}/${execution.total} tests passed`
    };
  } catch (err) {
    return {
      passed: false,
      validation: validation,
      execution: null,
      error: err.error || "Execution failed",
      message: "Execution error"
    };
  }
};

/**
 * Execute code with test cases
 */
exports.execute = (code, testCases = [], options = {}) => {
  return executeCode(code, testCases, options.timeout || 5000);
};

module.exports.executeCode = executeCode;
module.exports.createPythonHarness = createPythonHarness;
