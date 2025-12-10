import User from "../models/User.js";
import Module from "../models/module.js";
import Assignment from "../models/Assignment.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const assignModule = async (req, res) => {
  try {
    const { trainee, module, trainer } = req.body;
    if (!trainee || !module)
      return res.status(400).json({ message: "Missing trainee or module" });

    const userExists = await User.findById(trainee);
    if (!userExists)
      return res.status(404).json({ message: "Trainee not found" });

    const moduleExists = await Module.findById(module);
    if (!moduleExists)
      return res.status(404).json({ message: "Module not found" });

    const alreadyAssigned = await Assignment.findOne({ trainee, module });
    if (alreadyAssigned)
      return res.status(409).json({ message: "Module already assigned to this trainee" });

    await Assignment.create({
      trainee,
      module,
      assignedBy: req.user._id,
      trainer: trainer || null,
    });

    // 🔥 Convert employee → trainee automatically after assignment
    await User.findByIdAndUpdate(trainee, { role: "trainee" });

    res.json({ success: true, message: "Module assigned successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning module" });
  }
};
