const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMe, updateUser, updateAccount } = require("../controllers/userController");

// GET logged-in user profile
router.get("/me", protect, getMe);

// Update gender (or simple profile fields)
router.put("/update", protect, updateUser);

// Update role + password
router.put("/account", protect, updateAccount);

module.exports = router;
