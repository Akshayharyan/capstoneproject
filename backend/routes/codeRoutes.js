const express = require("express");
const router = express.Router();
const { runCode } = require("../controllers/codeExecutionController");

router.post("/run", runCode);

module.exports = router;
