const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    require: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  surveyQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  surveyCompletedSurveys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "completedSurveys",
    },
  ],
  surveyInvitations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurveyInvitation",
    },
  ],
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

const SurveyModel = mongoose.model("Survey", surveySchema);
module.exports = SurveyModel;
