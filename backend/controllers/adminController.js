import User from "../models/User.js";
import Module from "../models/module.js";
import Assignment from "../models/Assignment.js";

/* =========================
   GET ALL USERS (UNCHANGED)
   ========================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error fetching users" });
  }
};

/* =========================
   ASSIGN MODULE (UNCHANGED)
   ========================= */
export const assignModule = async (req, res) => {
  try {
    const { trainer, module } = req.body;

    if (!trainer || !module)
      return res.status(400).json({ message: "Missing trainer or module" });

    const userExists = await User.findById(trainer);
    if (!userExists)
      return res.status(404).json({ message: "Trainer not found" });

    const moduleExists = await Module.findById(module);
    if (!moduleExists)
      return res.status(404).json({ message: "Module not found" });

    const alreadyAssigned = await Assignment.findOne({ trainer, module });
    if (alreadyAssigned)
      return res
        .status(409)
        .json({ message: "Module already assigned to this trainer" });

    await Assignment.create({
      trainer,
      module,
      assignedBy: req.user._id,
    });

    // Convert employee → trainer automatically
    await User.findByIdAndUpdate(trainer, { role: "trainer" });

    res.json({ success: true, message: "Module assigned successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning module" });
  }
};


    
/* =========================
   ADMIN ANALYTICS (NEW)
   ========================= */
export const getAnalytics = async (req, res) => {
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
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
