require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Test model import
const TestUserModel = require("./models/User");
console.log("🧪 Testing model import =", TestUserModel);

const app = express();
connectDB();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const questRoutes = require("./routes/questRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");
const traineeRoutes = require("./routes/traineeRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");

// MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:3000",
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
app.use("/api/employee", employeeRoutes);
app.use("/api/trainee", traineeRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => res.send("API running"));

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
