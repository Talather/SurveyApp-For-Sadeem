const { isSubcategoryAuthenticated } = require("../middleware/authStatus");
const controller = require("../Controllers/subcategory.controller");
const express = require("express");
const router = express.Router();
router
  .route("/Subcategory/createSubcategory")
  .get(controller.createSubcategory);
router
  .route("/Subcategory/deleteSubcategory/:id")
  .get(controller.deleteSubcategory);

router
  .route("/Subcategory/getAllSubcategories")
  .get(controller.getAllSubcategories);
router
  .route("/Subcategory/getSubcategoryById/:id")
  .get(controller.getSubcategoryById);

router
  .route("/Subcategory/createTenSubcategories")
  .get(controller.createTenSubcategorys);
router
  .route("/Subcategory/updateSubcategory")
  .get(controller.updateSubcategory);
module.exports = router;
