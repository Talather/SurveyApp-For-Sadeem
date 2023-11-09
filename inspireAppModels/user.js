const mongoose = require("mongoose")

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
    required: false,
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: false,
  },
  employeeRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
  },
  adminRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("User", userSchema)
