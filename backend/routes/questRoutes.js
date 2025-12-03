// backend/routes/questRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { completeQuest } = require('../controllers/questController');

router.post('/complete', protect, completeQuest);

module.exports = router;
