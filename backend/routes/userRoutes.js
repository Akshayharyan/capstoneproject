const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMe, updateUser } = require("../controllers/userController");

router.get("/me", protect, getMe);
router.put("/update", protect, updateUser);

module.exports = router;
