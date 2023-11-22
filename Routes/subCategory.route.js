const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/subCategory.controller")
const express = require("express")
const router = express.Router()
router
  .route("/subCategory/createTenSubCategories")
  .get( controller.createTensubCategories)

router
  .route("/subCategory/viewTenSubCategories/:page")
  .get( controller.paginationPerPage)

router
  .route("/subCategory/searchSubCategory/:keyword")
  .get( controller.searchsubCategory)

router
  .route("/subCategory/createSubCategory")
  .get( controller.addsubCategory)
router
  .route("/subCategory/deleteSubCategory")
  .get(controller.deletesubCategory)

router
  .route("/subCategory/allSubCategories")
  .get( controller.findAllsubCategories)

router
  .route("/subCategory/getDetails/:id")
  .get( controller.getsubCategoryDetailsById)

router
  .route("/subCategory/getDetailsbyName")
  .get( controller.getsubCategoryDetails)

router
  .route("/subCategory/updateSubCategory/:id")
  .post( controller.updatesubCategoryProfile)

module.exports = router