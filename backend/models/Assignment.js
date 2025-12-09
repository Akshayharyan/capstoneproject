import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // optional
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
