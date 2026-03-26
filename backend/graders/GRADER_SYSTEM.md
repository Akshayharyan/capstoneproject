# Enhanced Multi-Language Grader System

## Overview

The improved grader system now supports multiple programming languages with powerful code execution and validation capabilities.

### Supported Languages

- **JavaScript (js, javascript)** - Full execution, function & script modes
- **Python (py, python)** - Full execution with process isolation
- **HTML (html)** - Structure validation & tag checking
- **CSS (css)** - Style validation & rule checking
- **Future Support**: C, C++, Java, SQL (placeholders ready)

---

## JavaScript Evaluator

### Features

1. **Multiple Execution Modes** (Auto-detected):
   - **Function Mode**: `function solution(input) { return output; }`
   - **Named Functions**: `solve()`, `test()` 
   - **Module Mode**: `module.exports = function(input) { ... }`
   - **Script Mode**: Any arbitrary JavaScript code
   - **Console Output**: Uses last `console.log()` as fallback output

2. **Advanced Code Validation**:
   - Syntax checking
   - Required functions/variables detection
   - Forbidden keywords blocking
   - Pattern matching for code requirements

3. **Safe Execution**:
   - VM2 sandboxing (no access to host system)
   - 5-second timeout per test case
   - Console interception
   - Error isolation per test

### Usage

```javascript
// Import the grader system
const graderSystem = require("./graders");

// Example 1: Execute code with test cases
const jsCode = `
  function solution(n) {
    return n * 2;
  }
`;

const testCases = [
  { input: 5, output: 10 },
  { input: 3, output: 6 }
];

const result = await graderSystem.executeCode(jsCode, {
  language: "javascript",
  testCases: testCases
});

// Example 2: Grade with validation
const result = await graderSystem.gradeSubmission(jsCode, {
  language: "js",
  testCases: testCases,
  rules: {
    requiredFunctions: ["solution"],
    forbidden: ["eval", "Function"],
    requiredPatterns: ["return"]
  }
});

// Example 3: Validate only (no execution)
const validation = graderSystem.validateCode(jsCode, {
  language: "javascript",
  rules: {
    requiredFunctions: ["solution"],
    forbidden: ["while"] // e.g., must use recursion
  }
});
```

### Response Format

```json
{
  "total": 2,
  "passed": 2,
  "success": true,
  "results": [
    {
      "input": 5,
      "expected": 10,
      "received": 10,
      "success": true,
      "logs": []
    },
    {
      "input": 3,
      "expected": 6,
      "received": 6,
      "success": true,
      "logs": []
    }
  ],
  "error": null
}
```

### JavaScript Validation Rules

```javascript
const rules = {
  // Required functions must exist
  requiredFunctions: ["solution", "helper"],
  
  // Regex patterns that code must match
  requiredPatterns: [
    "for\\s*\\(",     // must use for loop
    "Array\\.map",    // must use Array.map
    "Promise"         // must use promises
  ],
  
  // Forbidden keywords/patterns
  forbidden: [
    "eval",           // no eval()
    "Function",       // no Function constructor
    "while",          // no while loops (enforces for loops)
    "innerHTML"       // no innerHTML manipulation
  ]
};
```

---

## Python Evaluator

### Features

1. **Process Isolation**: Runs in separate Python process for security
2. **Multiple Execution Modes**:
   - Function mode: `def solution(input): return output`
   - Named functions: `solve()`, `test()`
   - Script mode: Any arbitrary Python code
3. **Flexible Input/Output**: Supports various data types
4. **Error Handling**: Clear error messages with stderr captured

### Usage

```python
# Example: Grade Python submission
python_code = """
def solution(n):
    return n * 2
"""

result = await graderSystem.gradeSubmission(python_code, {
  language: "python",
  testCases: [
    { input: 5, output: 10 },
    { input: 3, output: 6 }
  ],
  rules: {
    requiredFunctions: ["solution"]
  },
  timeout: 5000
});
```

### Python Validation Rules

```python
rules = {
    # Required functions must exist
    "requiredFunctions": ["solution", "helper"],
    
    # Regex patterns that code must match
    "requiredPatterns": [
        r"for\s+",          # must use for loop
        r"def\s+\w+",       # must define functions
        r"import\s+\w+"     # must import something
    ],
    
    # Forbidden keywords/patterns
    "forbidden": [
        "eval",             # no eval()
        "exec",             # no exec()
        "open",             # no file operations
        "__import__"        # no dynamic imports
    ]
}
```

---

## HTML & CSS Evaluators

### HTML Features

- Validate required HTML tags
- Check for forbidden elements
- Verify text content inclusion
- Structure validation

```javascript
const htmlCode = `
  <html>
    <head>
      <title>My Page</title>
    </head>
    <body>
      <h1>Hello World</h1>
    </body>
  </html>
`;

const result = graderSystem.validateCode(htmlCode, {
  language: "html",
  rules: {
    requiredTags: ["head", "body", "h1"],
    forbiddenTags: ["script", "style"],
    textIncludes: ["Hello", "World"]
  }
});
```

### CSS Features

- Validate required CSS properties
- Check for forbidden selectors/properties
- CSS syntax validation

```javascript
const cssCode = `
  body { background-color: white; }
  h1 { color: blue; font-size: 24px; }
`;

const result = graderSystem.validateCode(cssCode, {
  language: "css",
  rules: {
    mustContain: ["background-color", "color"],
    forbidden: ["!important", "inline"]
  }
});
```

---

## API Endpoints

### 1. Execute Code

**POST** `/api/code/run`

Execute code and run test cases.

```json
{
  "language": "javascript",
  "userCode": "function solution(n) { return n * 2; }",
  "testCases": [
    { "input": 5, "output": 10 },
    { "input": 3, "output": 6 }
  ],
  "options": { "timeout": 5000 }
}
```

**Response:**
```json
{
  "total": 2,
  "passed": 2,
  "success": true,
  "results": [...]
}
```

---

### 2. Grade Submission

**POST** `/api/code/grade`

Validate code against rules AND execute test cases.

```json
{
  "language": "javascript",
  "userCode": "function solution(n) { return n * 2; }",
  "testCases": [
    { "input": 5, "output": 10 }
  ],
  "rules": {
    "requiredFunctions": ["solution"],
    "forbidden": ["eval"]
  },
  "timeout": 5000
}
```

**Response:**
```json
{
  "passed": true,
  "validation": {
    "valid": true,
    "errors": []
  },
  "execution": {
    "total": 1,
    "passed": 1,
    "success": true,
    "results": [...]
  },
  "message": "All tests passed (1/1)"
}
```

---

### 3. Validate Code

**POST** `/api/code/validate`

Check code syntax and rules without executing tests.

```json
{
  "language": "javascript",
  "userCode": "function solution(n) { return n * 2; }",
  "rules": {
    "requiredFunctions": ["solution"],
    "forbidden": ["eval", "Function"]
  }
}
```

**Response:**
```json
{
  "valid": true,
  "errors": []
}
```

---

### 4. Get Supported Languages

**GET** `/api/code/languages`

```json
{
  "supported": ["javascript", "python", "html", "css"],
  "count": 4
}
```

---

## Advanced Examples

### Example 1: Complete JS Workflow

```javascript
// Training module for learning array methods
const task = {
  language: "javascript",
  
  description: "Implement a function that doubles all numbers in an array",
  
  testCases: [
    { input: [1, 2, 3], output: [2, 4, 6] },
    { input: [], output: [] },
    { input: [5], output: [10] }
  ],
  
  rules: {
    // Student must use Array.map()
    requiredPatterns: [".map\\s*\\("],
    
    // Can't use for loops (enforce functional programming)
    forbidden: ["for\\s*\\("],
    
    // Must define a solution function
    requiredFunctions: ["solution"]
  }
};

const studentCode = `
const solution = (arr) => arr.map(x => x * 2);
`;

const result = await graderSystem.gradeSubmission(studentCode, task);
// Result: { passed: true, validation: {...}, execution: {...} }
```

### Example 2: Python Math Problem

```javascript
const pythonTask = {
  language: "python",
  
  description: "Find the sum of squares of numbers 1 to n",
  
  testCases: [
    { input: 3, output: 14 },  // 1² + 2² + 3² = 14
    { input: 5, output: 55 },  // 1² + 2² + 3² + 4² + 5² = 55
  ],
  
  rules: {
    requiredFunctions: ["solution"],
    requiredPatterns: ["return"]
  },
  
  timeout: 3000
};

const pythonCode = `
def solution(n):
    return sum(i**2 for i in range(1, n+1))
`;

const result = await graderSystem.gradeSubmission(pythonCode, pythonTask);
```

### Example 3: HTML Structure Validation

```javascript
const htmlTask = {
  language: "html",
  
  description: "Create a valid HTML form",
  
  rules: {
    requiredTags: ["form", "input", "label", "button"],
    forbiddenTags: ["script"],
    textIncludes: ["Submit"]
  }
};

const htmlCode = `
<form>
  <label for="name">Name:</label>
  <input id="name" type="text" />
  <button type="submit">Submit</button>
</form>
`;

const result = graderSystem.validateCode(htmlCode, htmlTask);
```

---

## Error Handling

All evaluators return consistent error structures:

### Validation Error
```json
{
  "passed": false,
  "validation": {
    "valid": false,
    "errors": [
      "Function \"solution\" is required",
      "\"eval\" is not allowed"
    ]
  },
  "execution": null,
  "message": "Code validation failed"
}
```

### Execution Error
```json
{
  "total": 2,
  "passed": 0,
  "success": false,
  "results": [
    {
      "input": 5,
      "expected": 10,
      "error": "solution is not a function",
      "success": false
    }
  ],
  "error": "Execution failed"
}
```

### Language Not Supported
```json
{
  "passed": false,
  "error": "No grader for language: rust",
  "message": "Supported languages: javascript, python, html, css"
}
```

---

## Configuration

### Environment Variables

```bash
# Python timeout (milliseconds)
PYTHON_TIMEOUT=5000

# JavaScript timeout (milliseconds)
JS_TIMEOUT=5000

# Max buffer size for subprocess output
MAX_BUFFER=10485760  # 10MB
```

### Timeout Handling

- **JavaScript**: 5000ms per test case (VM2 timeout)
- **Python**: 5000ms per test case (subprocess timeout)
- **HTML/CSS**: No timeout (validation only)

---

## Security Considerations

1. **JavaScript Sandboxing (VM2)**
   - No access to file system
   - No access to network
   - No child process spawning
   - Restricted global scope

2. **Python Isolation**
   - Runs in separate process
   - No access to host files (except temp)
   - Subprocess output captured
   - Temp files cleaned up after execution

3. **General Safety**
   - All code executed with timeout
   - Errors isolated per test case
   - Console interception prevents obfuscation
   - Process limits enforced

---

## Performance Tips

1. **Batch Operations**: Send multiple test cases in one request
2. **Timeouts**: Set appropriate timeouts for language/complexity
3. **Caching**: Cache validation results when rules don't change
4. **Language Choice**: 
   - Use JS for quick feedback (sandboxed, faster)
   - Use Python for complex algorithms
   - Use HTML/CSS for structure validation only

---

## Troubleshooting

### "No output received" (Python)

**Solution**: Ensure Python is installed and in system PATH
```bash
python --version
```

### Timeout errors

**Solution**: Increase timeout in request
```json
{
  "timeout": 10000
}
```

### "Cannot find module 'vm2'"

**Solution**: Install required dependencies
```bash
npm install vm2
```

---

## Future Enhancements

- [ ] C/C++ support via GCC sandbox
- [ ] Java support with safe JVM
- [ ] SQL validation and testing
- [ ] Custom evaluators for domain-specific languages
- [ ] Real-time code stream evaluation
- [ ] Performance profiling and optimization checks
- [ ] Code coverage reporting
