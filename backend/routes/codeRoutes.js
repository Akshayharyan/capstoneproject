const express = require("express");
const router = express.Router();
const { runCode, gradeCode, validateCode, getSupportedLanguages } = require("../controllers/codeExecutionController");

// Execute code with test cases
router.post("/run", runCode);

// Grade submission (validate + execute)
router.post("/grade", gradeCode);

// Validate code only
router.post("/validate", validateCode);

// Get supported languages
router.get("/languages", getSupportedLanguages);

module.exports = router;
