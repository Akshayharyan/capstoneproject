const mongoose = require("mongoose");
const User = require("../models/User");
const Module = require("../models/module");
const Assignment = require("../models/Assignment");

/* =========================
   GET ALL USERS
========================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

/* =========================
   ASSIGN MODULE
========================= */
const assignModule = async (req, res) => {
  try {
    console.log("📩 Assign request body:", req.body);

    const { trainerId, moduleId } = req.body;

    // 1️⃣ Validate presence
    if (!trainerId || !moduleId) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "Missing trainer or module" });
    }

    // 2️⃣ Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(trainerId) ||
      !mongoose.Types.ObjectId.isValid(moduleId)
    ) {
      console.log("❌ Invalid ObjectId", { trainerId, moduleId });
      return res.status(400).json({ message: "Invalid trainer or module ID" });
    }

    // 3️⃣ Trainer exists
    const trainer = await User.findById(trainerId);
    if (!trainer) {
      console.log("❌ Trainer not found");
      return res.status(404).json({ message: "Trainer not found" });
    }

    // 4️⃣ Module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      console.log("❌ Module not found");
      return res.status(404).json({ message: "Module not found" });
    }

    // 5️⃣ Prevent duplicate
    const exists = await Assignment.findOne({
      trainer: trainerId,
      module: moduleId,
    });

    if (exists) {
      console.log("⚠️ Already assigned");
      return res.status(409).json({
        message: "Module already assigned to this trainer",
      });
    }

    // 6️⃣ Create assignment
    await Assignment.create({
      trainer: trainerId,
      module: moduleId,
      assignedBy: req.user._id,
    });

    // 7️⃣ Promote role
    if (trainer.role !== "trainer") {
      trainer.role = "trainer";
      await trainer.save();
    }

    console.log("✅ Module assigned successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("🔥 Assign module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADMIN ANALYTICS
========================= */
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalTrainers = await User.countDocuments({ role: "trainer" });
    const totalEmployees = await User.countDocuments({ role: "employee" });

    const totalModules = await Module.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    res.json({
      totalUsers,
      totalAdmins,
      totalTrainers,
      totalEmployees,
      totalModules,
      totalAssignments,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

module.exports = {
  getAllUsers,
  assignModule,
  getAnalytics,
};
