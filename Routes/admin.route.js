const AuthService = require("../middleware/authStatus")
const { isAuthenticate } = require("../middleware/authStatus")
const controller = require("../controllers/adminController")
const express = require("express")
function logRequestURL(req, res, next) {
  console.log("Request URL:", req.url)
  next()
}
const router = require("express").Router()

router
  .route("/Admin/viewTenAdmins")
  .get(isAuthenticate, controller.paginationPerPage)

router.route("/Admin/searchAdmin").get(isAuthenticate, controller.searchAdmin)

router.route("/Admin/createAdmin").get(isAuthenticate, controller.addAdmin)
router.route("/Admin/deleteAdmin").get(isAuthenticate, controller.deleteAdmin)

router.route("/Admin/allAdmins").get(isAuthenticate, controller.findAllAdmins)

router
  .route("/Admin/getDetails/:id")
  .get(isAuthenticate, controller.getAdminDetailsById)

router
  .route("/Admin/getDetailsbyName")
  .get(isAuthenticate, controller.getAdminDetails)

module.exports = router
