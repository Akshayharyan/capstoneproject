const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getModulesWithStatus,
  startModule,
  getStartedModules,
} = require("../controllers/moduleProgressController");

router.get("/modules/status", protect, getModulesWithStatus);
router.post("/modules/start", protect, startModule);
router.get("/dashboard/started-modules", protect, getStartedModules);

module.exports = router;
