const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer",
  },
  completedSurvey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "completedSurveys",
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

module.exports = mongoose.model("Response", ResponseSchema);
