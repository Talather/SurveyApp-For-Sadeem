const mongoose = require("mongoose")

const SurveyInvitationSchema = new mongoose.Schema({
  completed: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  name: {
    type: String,
    default: "",
  },
  otp: {
    type: Number,
    required: false,
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "survey",
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
})
const surveyInvitation = mongoose.model(
  "SurveyInvitation",
  SurveyInvitationSchema
)
module.exports = surveyInvitation
