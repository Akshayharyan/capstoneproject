// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');
const Activity = require('../models/activity');

router.get('/me', protect, getDashboard);

// 🔧 DIAGNOSTIC: Check ALL activities (no auth required - for debugging only)
router.get('/debug/all-activities', async (req, res) => {
  try {
    const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(50);
    console.log(`📊 DEBUG: Found ${activities.length} total activities in DB`);
    
    // Group by user
    const byUser = {};
    activities.forEach(a => {
      const userId = a.userId.toString();
      if (!byUser[userId]) byUser[userId] = [];
      byUser[userId].push(a);
    });

    res.json({
      totalActivities: activities.length,
      userCount: Object.keys(byUser).length,
      byUser: Object.entries(byUser).map(([userId, acts]) => ({
        userId,
        activityCount: acts.length,
        latestActivity: acts[0]?.createdAt,
        activities: acts.slice(0, 5).map(a => ({
          type: a.type,
          message: a.message,
          createdAt: a.createdAt,
        })),
      })),
    });
  } catch (err) {
    console.error("❌ Dashboard debug error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔧 DIAGNOSTIC: Check activities for current user (requires auth)
router.get('/debug/activities', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(10);
    console.log(`📊 DEBUG: Found ${activities.length} activities for user ${userId}`);
    activities.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.type} - ${a.createdAt}`);
    });
    res.json({
      userId,
      activityCount: activities.length,
      activities: activities.map(a => ({
        type: a.type,
        message: a.message,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error("❌ Dashboard debug error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔧 TEST: Create test activities for current user (for testing streak feature)
router.post('/debug/create-test-activities', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Create 7 activities for the last 7 days (to test 7-day streak)
    const activities = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i); // Go back i days
      date.setHours(12, 0, 0, 0);
      
      activities.push({
        userId,
        type: "quest_complete",
        message: `Test activity for day ${7 - i}`,
        icon: "check",
        createdAt: date,
      });
    }
    
    await Activity.insertMany(activities);
    
    console.log(`✅ Created ${activities.length} test activities for user ${userId}`);
    console.log(`📊 Dates: ${activities.map(a => a.createdAt.toLocaleDateString()).join(", ")}`);
    
    res.json({
      message: `Created ${activities.length} test activities`,
      activities: activities.map(a => ({
        type: a.type,
        message: a.message,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error("❌ Test activity creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
