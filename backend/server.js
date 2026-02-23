require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");

// ===============================
// INIT
// ===============================
const app = express();
connectDB();

// ===============================
// DEBUG (optional)
// ===============================
console.log("ENV LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

// ===============================
// IMPORT ROUTES
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
const judgeRoutes = require("./routes/judgeRoutes");
const bossRoutes = require("./routes/bossRoutes");
const codeRoutes = require("./routes/codeRoutes");
const aiRoutes = require("./routes/aiRoutes");

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

// Serve boss images statically
app.use(
  "/bosses",
  express.static(path.join(__dirname, "../frontend/public/bosses"))
);

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

app.use("/api/grader", graderRoutes);        // ✅ ONLY ONCE
app.use("/api/code", codeRoutes);            // sandbox engine
app.use("/api/ai", aiRoutes);

app.use("/api/achievements", achievementRoutes);
app.use("/api/judge", judgeRoutes);

app.use("/api/bosses", bossRoutes);
app.use("/api/boss", bossBattleRoutes);
app.use("/api/boss", bossChallengeRoutes);

app.use("/api", moduleProgressRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("API running");
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});