const Assignment = require("../models/Assignment");
const Module = require("../models/module");

exports.getAssignedModules = async (req, res) => {
  try {
    const traineeId = req.user._id;

    const assignments = await Assignment.find({ trainee: traineeId })
      .populate("module", "title description topics");

    const formatted = assignments.map((a) => ({
      assignmentId: a._id,
      moduleId: a.module._id,
      title: a.module.title,
      description: a.module.description,
      topicsCount: a.module.topics?.length || 0,
      createdAt: a.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetching assigned modules failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
