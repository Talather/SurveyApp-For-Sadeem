const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
<<<<<<< HEAD:inspireAppModels/subcategory.js
  category: 
    { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category"
   }
  ,
=======
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
>>>>>>> d91bd4654c12395c6de7d3683224d31376af55cb:Models/subcategory.js
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
    required: true,
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
});

<<<<<<< HEAD:inspireAppModels/subcategory.js

const subCategoryModel = mongoose.model("Subcategory", SubcategorySchema)

module.exports = subCategoryModel
=======
const subCategoryModel = mongoose.model("Subcategory", SubcategorySchema);

module.exports = subCategoryModel;
>>>>>>> d91bd4654c12395c6de7d3683224d31376af55cb:Models/subcategory.js
