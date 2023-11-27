// const mongoose = require('./mongoose');
const mongoose = require("mongoose")

const AnswerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  answerResponses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },

  description: String,
  isDeleted: {
    type: Boolean,
    defaults: false,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    required: false,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
})

const AnswerModel = mongoose.model("Answer", AnswerSchema)

module.exports = AnswerModel
