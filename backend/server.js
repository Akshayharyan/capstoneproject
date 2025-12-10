require("dotenv").config();
const express = require("express");

const TestUserModel = require("./models/User");
console.log("🧪 Testing model import =", TestUserModel);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// ROUTES (CommonJS)
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const questRoutes = require("./routes/questRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");
const traineeRoutes = require("./routes/traineeRoutes");

// ⚠️ FIX — import admin routes using CommonJS, NOT import
const adminRoutes = require("./routes/adminRoutes.js");

const app = express();
connectDB();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quests", questRoutes);

app.use("/api/trainee", traineeRoutes);
app.use("/api/trainee", require("./routes/traineeRoutes"));


app.use("/api/modules", moduleRoutes);
app.use("/api/activity", activityRoutes);

// ⚠️ FIX — use adminRoutes ONCE
app.use("/api/admin", adminRoutes);

// API health check
app.get("/", (req, res) => res.send("API running"));

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
