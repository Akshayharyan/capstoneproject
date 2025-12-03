const User = require("../models/user");

// GET logged-in user's profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE profile (gender for now)
exports.updateUser = async (req, res) => {
  try {
    const { gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { gender },
      { new: true }
    ).lean();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
