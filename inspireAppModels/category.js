// Import mongoose library
var mongoose = require("mongoose")

// Define the schema
var category = new mongoose.Schema({
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
  },
  name: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  categoryQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  categorySubcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
})

// Compile the schema into a model
var categoryModel = mongoose.model("Category", category)

// Export the model
module.exports = categoryModel
