const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // "quest", "module", "badge", "level"
  message: { type: String, required: true },
  icon: { type: String, required: true }, // "check", "trophy", "medal", "rocket"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);
