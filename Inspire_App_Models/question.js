const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
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
  questionAnswers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubcategoryQuestion",
  },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  updatedate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Question", QuestionSchema)
