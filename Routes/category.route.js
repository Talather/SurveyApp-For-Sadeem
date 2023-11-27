const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/category.controller")
const express = require("express")
const router = express.Router()
router.route("/Category/createCategory").get(controller.createCategory)
router.route("/Category/deleteCategory/:id").get(controller.deleteCategory)

router.route("/Category/getAllCategorys").get(controller.getAllCategorys)

router.route("/Category/getCategoryById/:id").get(controller.getCategoryById)

router.route("/Category/createTenCategorys").get(controller.createTenCategorys)
router.route("/Category/updateCategory/:id").get(controller.updateCategory)
module.exports = router
