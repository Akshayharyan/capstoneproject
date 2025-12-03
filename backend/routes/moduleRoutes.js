// backend/routes/moduleRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Module = require('../models/module');
const { getModuleQuests } = require("../controllers/moduleController");



// GET /api/modules -> return all modules
router.get("/:moduleId/quests", protect, getModuleQuests);
router.get('/', protect, async (req, res) => {
  try {
    const modules = await Module.find();
    res.json({ modules });
  } catch (err) {
    console.error('Module fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/modules/start -> add module to user's dashboard
router.post('/start', protect, async (req, res) => {
  const { moduleId } = req.body;
  if (!moduleId) return res.status(400).json({ message: 'moduleId required' });

  try {
    const Progress = require('../models/progress');

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        completedQuests: [],
        completedModules: [],
      });
    }

    // If module already started, ignore
    if (!progress.startedModules?.includes(moduleId)) {
      progress.startedModules = progress.startedModules || [];
      progress.startedModules.push(moduleId);
      await progress.save();
    }

    res.json({ message: 'Module started successfully' });
  } catch (err) {
    console.error('Start module error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
