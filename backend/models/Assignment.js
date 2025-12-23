const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // optional
}, { timestamps: true });

module.exports = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
