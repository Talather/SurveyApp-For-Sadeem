const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/category.controller")
const express = require("express")
const router = express.Router()
router
  .route("/Category/createTenCategorys")
  .get( controller.createTenCategorys)

router
  .route("/Category/viewTenCategorys")
  .get( controller.paginationPerPage)

router
  .route("/Category/searchCategory")
  .get( controller.searchCategory)

router
  .route("/Category/createCategory")
  .get( controller.addCategory)
router
  .route("/Category/deleteCategory/")
  .get( controller.deleteCategory)

router
  .route("/Category/allCategorys")
  .get( controller.findAllCategorys)

router
  .route("/Category/getDetails/:id")
  .get( controller.getCategoryDetailsById)

router
  .route("/Category/getDetailsbyName")
  .get( controller.getCategoryDetails)

router
  .route("/Category/updateCategory/:id")
  .post( controller.updateCategoryProfile)

module.exports = router