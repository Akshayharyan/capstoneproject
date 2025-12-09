const User = require("../models/User");
  // 🔥 FIXED
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("name email xp level badges gender role createdAt")
      .lean();

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).lean();
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password, role } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Account updated",
      user: user.toJSON(),
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
