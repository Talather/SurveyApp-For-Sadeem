const mongoose = require("mongoose")

const SubcategorySchema = new mongoose.Schema({
  category: 
    { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category"
   }
  ,
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
  subcategoryQuestion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  updateDate: {
    type: Date,
    default: Date.now,
  },
})


const subCategoryModel = mongoose.model("Subcategory", SubcategorySchema)

module.exports = subCategoryModel