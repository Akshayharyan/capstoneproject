const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },
    certificateId: {
      type: String,
      unique: true,
      required: true
    },
    moduleTitle: {
      type: String,
      required: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    earnedXp: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", CertificateSchema);
