// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.get('/me', protect, (req, res) => {
  // req.user is populated by middleware
  res.json({
    message: `Welcome back, ${req.user.name}!`,
    user: req.user,
  });
});

module.exports = router;
