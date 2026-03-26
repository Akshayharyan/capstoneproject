/**
 * GRADER SYSTEM - USAGE EXAMPLES
 * 
 * This file demonstrates how to use the enhanced multi-language grader system
 * with various languages and use cases.
 */

// ============================================================================
// JAVASCRIPT EXAMPLES
// ============================================================================

const graderSystem = require("./graders");

/**
 * Example 1: Basic Function Solution
 */
async function example1_basicJSFunction() {
  const code = `
    function solution(n) {
      return n * 2;
    }
  `;

  const testCases = [
    { input: 5, output: 10 },
    { input: 3, output: 6 },
    { input: 0, output: 0 }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "javascript",
    testCases: testCases
  });

  console.log(result);
  /*
  {
    total: 3,
    passed: 3,
    success: true,
    results: [
      { input: 5, expected: 10, received: 10, success: true, logs: [] },
      { input: 3, expected: 6, received: 6, success: true, logs: [] },
      { input: 0, expected: 0, received: 0, success: true, logs: [] }
    ],
    error: null
  }
  */
}

/**
 * Example 2: Grade with Validation Rules
 */
async function example2_jsWithRules() {
  const code = `
    const solution = (arr) => arr.map(x => x * 2);
  `;

  const task = {
    language: "javascript",
    testCases: [
      { input: [1, 2, 3], output: [2, 4, 6] },
      { input: [], output: [] }
    ],
    rules: {
      // Must use Array.map
      requiredPatterns: ["\\.map\\s*\\("],
      // Cannot use for loop
      forbidden: ["for\\s*\\("],
      // Must define a function
      requiredFunctions: ["solution"]
    }
  };

  const result = await graderSystem.gradeSubmission(code, task);
  console.log(result);
  /*
  {
    passed: true,
    validation: { valid: true, errors: [] },
    execution: {
      total: 2,
      passed: 2,
      success: true,
      results: [...]
    },
    message: "All tests passed (2/2)"
  }
  */
}

/**
 * Example 3: Script Mode (No Function Required)
 */
async function example3_scriptMode() {
  const code = `
    const numbers = [1, 2, 3, 4, 5];
    const sum = numbers.reduce((a, b) => a + b, 0);
    console.log(sum);
  `;

  const testCases = [
    { input: null, output: 15 }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "js",
    testCases: testCases
  });

  console.log(result);
  // Output from console.log is captured as result
}

/**
 * Example 4: Arrow Function Solution
 */
async function example4_arrowFunction() {
  const code = `
    const solution = (str) => str.toUpperCase();
  `;

  const testCases = [
    { input: "hello", output: "HELLO" },
    { input: "world", output: "WORLD" }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "javascript",
    testCases: testCases
  });

  console.log(result);
}

/**
 * Example 5: Complex Logic with Multiple Functions
 */
async function example5_complexLogic() {
  const code = `
    function isPrime(n) {
      if (n <= 1) return false;
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    }

    function solution(n) {
      return isPrime(n);
    }
  `;

  const testCases = [
    { input: 2, output: true },
    { input: 4, output: false },
    { input: 17, output: true },
    { input: 1, output: false }
  ];

  const result = await graderSystem.gradeSubmission(code, {
    language: "js",
    testCases: testCases,
    rules: {
      requiredFunctions: ["isPrime", "solution"],
      requiredPatterns: ["for\\s*\\("]
    }
  });

  console.log(result);
}

// ============================================================================
// PYTHON EXAMPLES
// ============================================================================

/**
 * Example 6: Basic Python Function
 */
async function example6_pythonBasic() {
  const code = `
def solution(n):
    return n * 2
  `;

  const testCases = [
    { input: 5, output: 10 },
    { input: 3, output: 6 }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "python",
    testCases: testCases
  });

  console.log(result);
}

/**
 * Example 7: Python with List Comprehension
 */
async function example7_pythonListComp() {
  const code = `
def solution(arr):
    return [x * 2 for x in arr]
  `;

  const testCases = [
    { input: [1, 2, 3], output: [2, 4, 6] },
    { input: [], output: [] }
  ];

  const result = await graderSystem.gradeSubmission(code, {
    language: "py",
    testCases: testCases,
    rules: {
      requiredFunctions: ["solution"],
      requiredPatterns: ["for\\s+\\w+\\s+in"]
    }
  });

  console.log(result);
}

/**
 * Example 8: Python Sum of Squares
 */
async function example8_pythonMath() {
  const code = `
def solution(n):
    return sum(i**2 for i in range(1, n+1))
  `;

  const testCases = [
    { input: 3, output: 14 },   // 1 + 4 + 9
    { input: 5, output: 55 },   // 1 + 4 + 9 + 16 + 25
    { input: 1, output: 1 }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "python",
    testCases: testCases
  });

  console.log(result);
}

/**
 * Example 9: Python Class Definition
 */
async function example9_pythonClass() {
  const code = `
class Calculator:
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

def solution(a, b):
    calc = Calculator()
    return calc.multiply(calc.add(a, 2), b)
  `;

  const testCases = [
    { input: [3, 4], output: 20 },  // (3+2) * 4 = 20
    { input: [1, 5], output: 15 }   // (1+2) * 5 = 15
  ];

  const result = await graderSystem.gradeSubmission(code, {
    language: "python",
    testCases: testCases,
    rules: {
      requiredFunctions: ["solution"],
      forbidden: ["eval", "exec"]
    }
  });

  console.log(result);
}

// ============================================================================
// HTML EXAMPLES
// ============================================================================

/**
 * Example 10: HTML Form Validation
 */
function example10_htmlForm() {
  const code = `
    <form id="myForm">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      
      <button type="submit">Sign Up</button>
    </form>
  `;

  const result = graderSystem.validateCode(code, {
    language: "html",
    rules: {
      requiredTags: ["form", "input", "label", "button"],
      forbiddenTags: ["script"],
      textIncludes: ["Username", "Email", "Sign Up"]
    }
  });

  console.log(result);
  /*
  {
    valid: true,
    errors: []
  }
  */
}

/**
 * Example 11: HTML Semantic Structure
 */
function example11_htmlSemantic() {
  const code = `
    <html>
      <head>
        <title>My Blog</title>
      </head>
      <body>
        <header>
          <h1>Welcome</h1>
        </header>
        <main>
          <article>
            <h2>Article Title</h2>
            <p>Article content...</p>
          </article>
        </main>
        <footer>
          <p>Copyright 2024</p>
        </footer>
      </body>
    </html>
  `;

  const result = graderSystem.validateCode(code, {
    language: "html",
    rules: {
      requiredTags: ["html", "head", "body", "header", "main", "article", "footer"],
      forbiddenTags: ["table", "div"],
      textIncludes: ["Copyright"]
    }
  });

  console.log(result);
}

// ============================================================================
// CSS EXAMPLES
// ============================================================================

/**
 * Example 12: CSS Layout Validation
 */
function example12_cssLayout() {
  const code = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  `;

  const result = graderSystem.validateCode(code, {
    language: "css",
    rules: {
      mustContain: [
        "box-sizing",
        "display:\\s*flex",
        "max-width",
        "margin: 0 auto"
      ],
      forbidden: ["!important"]
    }
  });

  console.log(result);
}

/**
 * Example 13: CSS Grid Validation
 */
function example13_cssGrid() {
  const code = `
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 2rem;
    }

    .grid-item {
      background-color: #f0f0f0;
      padding: 1rem;
      border-radius: 8px;
    }
  `;

  const result = graderSystem.validateCode(code, {
    language: "css",
    rules: {
      mustContain: [
        "display: grid",
        "grid-template-columns",
        "gap",
        "border-radius"
      ],
      forbidden: ["float"]
    }
  });

  console.log(result);
}

// ============================================================================
// ERROR HANDLING EXAMPLES
// ============================================================================

/**
 * Example 14: Validation Error
 */
async function example14_validationError() {
  const code = `
    // Missing return statement
    const solution = (n) => {
      const result = n * 2;
      // forgot to return!
    };
  `;

  const result = await graderSystem.gradeSubmission(code, {
    language: "js",
    testCases: [{ input: 5, output: 10 }],
    rules: {
      requiredPatterns: ["return"]
    }
  });

  console.log(result);
  /*
  {
    passed: false,
    validation: {
      valid: false,
      errors: ["Code must match pattern: return"]
    },
    execution: null,
    message: "Code validation failed"
  }
  */
}

/**
 * Example 15: Execution Error
 */
async function example15_executionError() {
  const code = `
    function solution(arr) {
      return arr.map(); // Wrong number of args!
    }
  `;

  const result = await graderSystem.executeCode(code, {
    language: "js",
    testCases: [{ input: [1, 2, 3], output: [2, 4, 6] }]
  });

  console.log(result);
  /*
  {
    total: 1,
    passed: 0,
    success: false,
    results: [{
      input: [1, 2, 3],
      expected: [2, 4, 6],
      received: [undefined, undefined, undefined],
      success: false,
      logs: []
    }],
    error: null
  }
  */
}

/**
 * Example 16: Syntax Error
 */
async function example16_syntaxError() {
  const code = `
    function solution(n) {
      return n * 2
      // Missing semicolon - will still work in JS
    }
  `;

  // JavaScript will parse this fine, but Python would fail
  const result = await graderSystem.executeCode(code, {
    language: "js",
    testCases: [{ input: 5, output: 10 }]
  });

  console.log(result);
}

/**
 * Example 17: Get Supported Languages
 */
function example17_getSupportedLanguages() {
  const languages = graderSystem.getSupportedLanguages();
  console.log(languages);
  // ['js', 'javascript', 'python', 'py', 'html', 'css']
}

// ============================================================================
// ADVANCED FILTERING EXAMPLES
// ============================================================================

/**
 * Example 18: Filter by Output Type
 */
async function example18_filterByType() {
  const code = `
    function solution(n) {
      return n.toString();
    }
  `;

  const testCases = [
    { input: 123, output: "123" },
    { input: 456, output: "456" }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "js",
    testCases: testCases
  });

  console.log(result);
  // String comparison handles type conversion
}

/**
 * Example 19: Nested Data Structures
 */
async function example19_nestedData() {
  const code = `
    function solution(obj) {
      return {
        ...obj,
        doubled: obj.value * 2
      };
    }
  `;

  const testCases = [
    { 
      input: { value: 5, name: "test" }, 
      output: { value: 5, name: "test", doubled: 10 }
    }
  ];

  const result = await graderSystem.executeCode(code, {
    language: "js",
    testCases: testCases
  });

  console.log(result);
}

// Export for testing
module.exports = {
  example1_basicJSFunction,
  example2_jsWithRules,
  example3_scriptMode,
  example4_arrowFunction,
  example5_complexLogic,
  example6_pythonBasic,
  example7_pythonListComp,
  example8_pythonMath,
  example9_pythonClass,
  example10_htmlForm,
  example11_htmlSemantic,
  example12_cssLayout,
  example13_cssGrid,
  example14_validationError,
  example15_executionError,
  example16_syntaxError,
  example17_getSupportedLanguages,
  example18_filterByType,
  example19_nestedData
};

// Run all examples
async function runAll() {
  console.log("=== Example 1: Basic JS Function ===");
  await example1_basicJSFunction();
  
  console.log("\n=== Example 2: JS with Rules ===");
  await example2_jsWithRules();
  
  // Add other examples as needed...
}

// Uncomment to run:
// runAll().catch(console.error);
