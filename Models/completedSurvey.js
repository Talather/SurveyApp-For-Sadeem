const mongoose = require("mongoose")

const completedSurveysSchema = new mongoose.Schema({
  completedSurveyResponses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
    },
  ],
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
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model("completedSurveys", completedSurveysSchema)
