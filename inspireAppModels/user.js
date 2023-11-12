const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  creationDate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "employee", "superAdmin"],
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    ref: "AT101010",
  };
  const secret = "Survey";
  // const options = { expiresIn: 365 * 24 * 60 * 60 * 1000 };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    ref: "RT101010",
  };
  const secret = "Survey";
  // const options = { expiresIn: 365 * 24 * 60 * 60 * 1000 };
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

module.exports = mongoose.model("User", userSchema);
