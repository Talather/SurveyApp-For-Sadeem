const mongoose = require("mongoose")

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  designation: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: false,
  },
  employeeCompletedSurveys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "completedSurveys",
    },
  ],
  employeeSurveyInvitations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurveyInvitation",
    },
  ],

  nameOfSubsidiary: {
    type: String,
    default: "",
  },
  region: {
    type: String,
    default: "",
  },
  segment: {
    type: String,
    default: "",
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

const employeeModels = mongoose.model("Employee", EmployeeSchema)
module.exports = employeeModels
