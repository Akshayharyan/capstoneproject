const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public",
    },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: { type: [String], default: [] },

    gender: { type: String, enum: ["male", "female"], default: "male" },

    // 🔥 This is what admin access depends on
  role: {
  type: String,
  enum: ["admin", "trainer", "employee"], // 🔥 future-ready
  default: "employee",
},

  },
  { timestamps: true }
);

// Hash password on save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Remove password when returning JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
