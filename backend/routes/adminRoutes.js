const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const { getAllUsers, assignModule } = require("../controllers/adminController");

// GET ALL USERS
router.get("/users", protect, verifyAdmin, getAllUsers);

// ASSIGN MODULE
router.post("/assign", protect, verifyAdmin, assignModule);

module.exports = router;
