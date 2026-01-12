const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Progress = require("../models/Progress");


// Helper: generate token with role
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ❌ DO NOT HASH HERE
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // ✅ RAW password
      role: "employee",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🟢 LOGIN HIT:", email, password);

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    console.log("🟢 USER FOUND:", !!user);

    if (!user) {
      console.log("🔴 NO USER");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🟢 PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

const freshUser = await User.findById(user._id).select("-password");

// 🔥 FETCH PROGRESS
const progress = await Progress.findOne({ userId: freshUser._id });

const enrichedUser = {
  ...freshUser.toObject(),
  completedModules: progress?.completedModules || [],
  startedModules: progress?.startedModules || [],
  topics: progress?.topics || [],
};

const token = generateToken(freshUser);

res.json({ user: enrichedUser, token });

  } catch (err) {
    console.error("🔴 LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
