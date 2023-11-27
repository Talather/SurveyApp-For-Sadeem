const { isAdminAuthenticated } = require("../middleware/authStatus");
const controller = require("../Controllers/category.controller");
const express = require("express");
const router = express.Router();
router
  .route("/Category/createTenCategories")
  .get(controller.createTenCategories);

router.route("/Category/createCategory").get(controller.createCategory);
router.route("/Category/deleteCategory/:id").get(controller.deleteCategory);

router.route("/Category/getAllCategories").get(controller.getAllCategories);

router.route("/Category/getCategory/:id").get(controller.getCategoryById);

router.route("/Category/updateCategory").post(controller.updateCategory);

module.exports = router;
