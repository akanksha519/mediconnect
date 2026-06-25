const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true, minlength: 6 },
    role:         { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    phone:        { type: String },
    profileImage: { type: String },
    isActive:     { type: Boolean, default: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Use regular function, NOT arrow function — arrow functions break "this"
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);