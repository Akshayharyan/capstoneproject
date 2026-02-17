require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

// Test model import
const TestUserModel = require("./models/User");
console.log("🧪 Testing model import =", TestUserModel);
require("./models/Boss");
const app = express();
connectDB();

// ===============================
// ROUTES (EXISTING)
// ===============================
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const questRoutes = require("./routes/questRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const graderRoutes = require("./routes/graderRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const moduleProgressRoutes = require("./routes/moduleProgressRoutes");
const bossBattleRoutes = require("./routes/bossBattleRoutes");
const bossChallengeRoutes = require("./routes/bossChallengeRoutes");


// 🆕 NEW BOSS ROUTES
const bossRoutes = require("./routes/bossRoutes");

// ===============================
// MIDDLEWARE
// ===============================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// 🆕 Serve boss images statically
app.use("/bosses", express.static(path.join(__dirname, "../frontend/public/bosses")));

// ===============================
// REGISTER ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grader", graderRoutes);
app.use("/api/achievements", achievementRoutes);

// 🆕 REGISTER BOSS ROUTES

app.use("/api/bosses", bossRoutes);
app.use("/api/boss", bossBattleRoutes);
app.use("/api/boss", bossChallengeRoutes);


// 🆕 MODULE PROGRESS ROUTES
app.use("/api", moduleProgressRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => res.send("API running"));

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Server Error" });
});

// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
