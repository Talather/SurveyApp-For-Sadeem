const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  designation: {
    type: String,
    required: false,
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
    required: false,
  },
  region: {
    type: String,
    required: false,
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
});

const employeeModels = mongoose.model("Employee", EmployeeSchema);
module.exports = employeeModels;
