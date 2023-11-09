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

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
  };
  const secret = "Survey";
  const options = { expiresIn: 365 * 24 * 60 * 60 * 1000 };
  return jwt.sign(payload, secret, options);
};

module.exports = mongoose.model("User", userSchema);
