const { isAuthenticate } = require("../middleware/authStatus")
const auth = require("../middleware/authStatus")
const controller = require("../controllers/adminController")
const express = require("express")
// function logRequestURL(req, res, next) {
//   console.log("Request URL:", req.url)
//   next()
// }
const router = express.Router()

router
  .route("/Admin/viewTenAdmins")
  .get(auth.isAdminAuthenticated, (req, res) => {
    controller.paginationPerPage
  })

router
  .route("/Admin/searchAdmin")
  .get(auth.isAdminAuthenticated, (req, res) => {
    controller.searchAdmin
  })

router
  .route("/Admin/createAdmin")
  .get(auth.isAdminAuthenticated, (req, res) => {
    controller.addAdmin
  })
router
  .route("/Admin/deleteAdmin")
  .get(auth.isAdminAuthenticated, (req, res) => {
    controller.deleteAdmin
  })

router.route("/Admin/allAdmins").get(auth.isAdminAuthenticated, (req, res) => {
  controller.findAllAdmins
})

router
  .route("/Admin/getDetails/:id")
  .get(auth.isAdminAuthenticated, (req, res) => {
    controller.getAdminDetailsById
  })

router
  .route("/Admin/getDetailsbyName")
  .get(auth.isAdminAuthenticated, (req, res) => {
    controller.getAdminDetails
  })

module.exports = router
