const User = require("../models/User");
const Module = require("../models/module");
const Progress = require("../models/progress");

exports.getEmployeeMonitoring = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).lean();
    const totalModules = await Module.countDocuments();

    const result = [];

    for (const emp of employees) {
      const progress = await Progress.findOne({ userId: emp._id }).lean();

      const completedModules =
        progress?.completedModules?.length || 0;

      const xp =
        progress?.topics?.reduce(
          (sum, t) => (t.xpAwarded ? sum + 10 : sum), // adjust XP if needed
          0
        ) || 0;

      const progressPercent =
        totalModules === 0
          ? 0
          : Math.round((completedModules / totalModules) * 100);

      result.push({
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        xp,
        completedModules,
        totalModules,
        progressPercent,
      });
    }

    res.json({ employees: result });
  } catch (err) {
    console.error("Employee monitoring error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
