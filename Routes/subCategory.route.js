const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/subCategory.controller")
const admincontroller = require("../controllers/adminController")
const express = require("express")
const router = express.Router()
router.route("/Subcategory/createSubcategory").get(controller.createSubcategory)
router
  .route("/Subcategory/deleteSubcategory/:id")
  .get(controller.deleteSubcategory)

router
  .route("/Subcategory/getAllSubcategories")
  .get(controller.getAllSubcategories)

router
  .route("/Subcategory/getSubcategoryById/:id")
  .get(controller.getSubcategoryById)

router
  .route("/Subcategory/createTenSubcategories")
  .get(controller.createTenSubcategories)
router.route("/Subcategory/updateSubcategory").get(controller.updateSubcategory)
module.exports = router
