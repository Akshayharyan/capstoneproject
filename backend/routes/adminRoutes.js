const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  getAllUsers,
  assignModule,
  getAnalytics, // 👈 added
} = require("../controllers/adminController");

// GET ALL USERS
router.get("/users", protect, verifyAdmin, getAllUsers);

// ASSIGN MODULE
router.post("/assign", protect, verifyAdmin, assignModule);

// 📊 ADMIN ANALYTICS (NEW)
router.get("/analytics", protect, verifyAdmin, getAnalytics);

module.exports = router;
