# Migration Guide: Upgrading to Enhanced Grader System

## Overview

This guide helps you migrate existing code from the old grader system to the new enhanced multi-language grader system.

---

## Before vs After

### Old System

```javascript
// Could only grade JavaScript
const runInSandbox = require("../utils/sandboxRunner");

const result = runInSandbox(userCode, testCases);
```

### New System

```javascript
// Supports multiple languages
const graderSystem = require("../graders");

const result = await graderSystem.executeCode(userCode, {
  language: "javascript",
  testCases: testCases
});
```

---

## Migration Steps

### Step 1: Update Imports

**Before:**
```javascript
const runInSandbox = require("../utils/sandboxRunner");
```

**After:**
```javascript
const graderSystem = require("../graders");
// Or import specific functions:
const { executeCode, gradeSubmission, validateCode } = require("../graders");
```

---

### Step 2: Update Controller Usage

**Before:**
```javascript
exports.runCode = (req, res) => {
  try {
    const { userCode, testCases } = req.body;
    const result = runInSandbox(userCode, testCases);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

**After:**
```javascript
exports.runCode = async (req, res) => {
  try {
    const { userCode, testCases, language } = req.body;
    
    const result = await graderSystem.executeCode(userCode, {
      language: language || "javascript",
      testCases: testCases,
      options: { timeout: 5000 }
    });
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

### Step 3: Update API Calls from Frontend

**Before:**
```javascript
// Frontend
const response = await fetch('/api/code/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userCode: code,
    testCases: tests
  })
});
```

**After:**
```javascript
// Frontend (specify language)
const response = await fetch('/api/code/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    language: 'javascript',  // NEW: Required
    userCode: code,
    testCases: tests
  })
});
```

---

## New Methods

### Method 1: Execute Code (Basic)

```javascript
// Executes code and runs test cases
const result = await graderSystem.executeCode(code, {
  language: "javascript",
  testCases: [
    { input: 5, output: 10 }
  ]
});
```

**Returns:**
```json
{
  "total": 1,
  "passed": 1,
  "success": true,
  "results": [...]
}
```

---

### Method 2: Grade Submission (With Validation)

```javascript
// Validates rules AND executes tests
const result = await graderSystem.gradeSubmission(code, {
  language: "javascript",
  testCases: [{ input: 5, output: 10 }],
  rules: {
    requiredFunctions: ["solution"],
    forbidden: ["eval"]
  }
});
```

**Returns:**
```json
{
  "passed": true,
  "validation": { "valid": true, "errors": [] },
  "execution": { "total": 1, "passed": 1, "success": true, "results": [...] },
  "message": "All tests passed (1/1)"
}
```

---

### Method 3: Validate Code Only

```javascript
// Validates without executing
const result = graderSystem.validateCode(code, {
  language: "javascript",
  rules: {
    requiredFunctions: ["solution"],
    forbidden: ["eval", "Function"]
  }
});
```

**Returns:**
```json
{
  "valid": true,
  "errors": []
}
```

---

## Language Updates

### JavaScript (Enhanced)

**Old behavior (limited):**
- Only looked for `solution()` function
- Didn't support arbitrary code

**New behavior:**
- Auto-detects function, module, or script mode
- Tries: `solution()`, `solve()`, `test()`
- Falls back to `module.exports`
- Falls back to last `console.log()` output

---

### Python (Now Supported)

**Before:** Only validation, no execution

**After:** Full execution support
```javascript
const result = await graderSystem.executeCode(pythonCode, {
  language: "python",
  testCases: [{ input: 5, output: 10 }]
});
```

---

### HTML (Improved)

**Before:** Simple string matching

**After:** DOM structure validation with Cheerio
```javascript
const result = graderSystem.validateCode(htmlCode, {
  language: "html",
  rules: {
    requiredTags: ["form", "input"],
    forbiddenTags: ["script"],
    textIncludes: ["Submit"]
  }
});
```

---

## Breaking Changes

### Change 1: Async/Await Required

**Old:** Synchronous
```javascript
const result = runInSandbox(code, testCases);
```

**New:** Async (especially for Python)
```javascript
const result = await graderSystem.executeCode(code, { ... });
```

---

### Change 2: Language Parameter Required

**Old:** Assumed JavaScript
```javascript
runInSandbox(code, testCases);
```

**New:** Must specify language
```javascript
await graderSystem.executeCode(code, {
  language: "javascript",  // REQUIRED
  testCases: testCases
});
```

---

### Change 3: Test Case Structure

**Old (same):**
```javascript
[
  { input: 5, output: 10 },
  { input: 3, output: 6 }
]
```

**New (same interface, enhanced results):**
```javascript
[
  { input: 5, output: 10 },
  { input: 3, output: 6 }
]
// Now also returns: logs, error messages, etc.
```

---

## Common Refactoring Patterns

### Pattern 1: Simple Validation

**Before:**
```javascript
const errors = [];
if (!code.includes("solution")) {
  errors.push("Missing solution function");
}
```

**After:**
```javascript
const validation = graderSystem.validateCode(code, {
  language: "javascript",
  rules: { requiredFunctions: ["solution"] }
});
if (!validation.valid) {
  const errors = validation.errors;
}
```

---

### Pattern 2: Test Execution

**Before:**
```javascript
const result = runInSandbox(code, testCases);
if (result.success) {
  // All tests passed
}
```

**After:**
```javascript
const result = await graderSystem.executeCode(code, {
  language: "javascript",
  testCases: testCases
});
if (result.success) {
  // All tests passed
}
```

---

### Pattern 3: Complex Grading

**Before:**
```javascript
// Check rules manually, then run tests
if (!code.includes("function solution")) {
  return { passed: false };
}
const result = runInSandbox(code, testCases);
```

**After:**
```javascript
// All in one call
const result = await graderSystem.gradeSubmission(code, {
  language: "javascript",
  testCases: testCases,
  rules: { requiredFunctions: ["solution"] }
});
```

---

## Configuration Updates

### Environment Variables

Add these to your `.env`:
```bash
# Paths to Python
PYTHON_PATH=python
PYTHON3_PATH=python3

# Timeouts (milliseconds)
JS_TIMEOUT=5000
PYTHON_TIMEOUT=5000

# Subprocess buffer
MAX_BUFFER=10485760
```

---

### Dependencies

Install required package (if not already present):
```bash
npm install vm2
```

Verify Python is installed:
```bash
python --version
# or
python3 --version
```

---

## Gradual Migration Strategy

### Phase 1: Add New Endpoints
- Keep old `/api/code/run` working
- Add new endpoints alongside
- Update internal calls to use new system

### Phase 2: Update Controllers
- Update `codeExecutionController.js` (✓ Done)
- Update routes (✓ Done)
- Maintain backward compatibility

### Phase 3: Update Frontend
- Update API calls to include `language` parameter
- Handle new response format
- Add language selector UI

### Phase 4: Deprecate Old System
- Remove old `sandboxRunner.js` usage
- Update documentation
- Archive old code

---

## Troubleshooting

### Issue: "Cannot find module 'vm2'"

**Solution:**
```bash
cd backend
npm install vm2
```

---

### Issue: Python execution not working

**Solution:**
1. Check Python is installed:
   ```bash
   python --version
   ```
2. Add to PATH if needed
3. Test directly:
   ```bash
   node -e "const g = require('./graders'); g.executeCode('print(2*5)', {language:'python', testCases:[{input:null,output:10}]}).then(r => console.log(r))"
   ```

---

### Issue: Timeout errors in async functions

**Solution:** Handle async properly in controllers:
```javascript
// ✓ Correct
exports.runCode = async (req, res) => {
  const result = await graderSystem.executeCode(...);
}

// ✗ Wrong (missing async/await)
exports.runCode = (req, res) => {
  const result = graderSystem.executeCode(...);
}
```

---

## API Endpoint Updates

### Old Endpoint
```
POST /api/code/run
Body: { userCode, testCases }
Response: { total, passed, success, results }
```

### New Endpoints

**Execute (replaces old):**
```
POST /api/code/run
Body: { language, userCode, testCases, options }
Response: { total, passed, success, results }
```

**Grade (new):**
```
POST /api/code/grade
Body: { language, userCode, testCases, rules, timeout }
Response: { passed, validation, execution, message }
```

**Validate (new):**
```
POST /api/code/validate
Body: { language, userCode, rules }
Response: { valid, errors }
```

**Languages (new):**
```
GET /api/code/languages
Response: { supported: [...], count: ... }
```

---

## Testing Your Migration

### Test 1: JavaScript Still Works
```javascript
const code = "function solution(n) { return n * 2; }";
const result = await executeCode(code, {
  language: "js",
  testCases: [{ input: 5, output: 10 }]
});
assert(result.success === true);
```

### Test 2: New Language Works
```javascript
const code = "def solution(n):\n  return n * 2";
const result = await executeCode(code, {
  language: "python",
  testCases: [{ input: 5, output: 10 }]
});
assert(result.success === true);
```

### Test 3: Validation Works
```javascript
const result = validateCode(badCode, {
  language: "javascript",
  rules: { requiredFunctions: ["solution"] }
});
assert(result.valid === false);
assert(result.errors.length > 0);
```

---

## Rollback Plan

If issues arise, you can quickly revert:

```bash
# Restore old files
git checkout backend/graders/jsEvaluator.js
git checkout backend/utils/sandboxRunner.js
git checkout backend/controllers/codeExecutionController.js
git checkout backend/routes/codeRoutes.js

# Restart server
npm restart
```

---

## Support & Resources

- **Documentation**: [GRADER_SYSTEM.md](./GRADER_SYSTEM.md)
- **Examples**: [EXAMPLES.js](./EXAMPLES.js)
- **Source**: Check individual evaluators in `graders/`
- **Issues**: Report bugs with language, code, and expected vs actual output

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Languages | JavaScript only | JS, Python, HTML, CSS + more |
| Async | No (synchronous) | Yes (async/await) |
| Validation | Manual | Built-in `validateCode()` |
| Grading | Execute only | Validate + Execute |
| Error Handling | Basic | Detailed per test |
| Timeout | Fixed | Configurable |
| Rules | None | Comprehensive |
| Output Modes | Function only | Function, Script, Module |
| Test Format | Same | Same + better feedback |
| Performance | Good | Same |

**Migration Time:** 1-2 hours for full integration
