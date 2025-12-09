const User = require("../models/User");             // ✔ CORRECT now
const Assignment = require("../models/Assignment"); // ✔ OK

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.assignModule = async (req, res) => {
  try {
    const { trainee, module } = req.body;
    if (!trainee || !module)
      return res.status(400).json({ message: "Missing trainee or module" });

    await Assignment.create({
      trainee,
      module,
      assignedBy: req.user._id,
    });

    res.json({ success: true, message: "Module assigned successfully" });
  } catch {
    res.status(500).json({ message: "Error assigning module" });
  }
};
