const { isAuthenticate } = require("../middleware/authStatus")
const auth = require("../middleware/authStatus")
const controller = require("../controllers/adminController")
const surveyController = require("../controllers/surveyCreation.controller")
const express = require("express")
// function logRequestURL(req, res, next) {
//   console.log("Request URL:", req.url)
//   next()
// }
const router = express.Router()

// router.post("/Admin/createSurvey", surveyController.createSurvey);
// router.route("/Admin/createSurvey").get((req, res) => {
//   surveyController.createSurvey
// })

// router
//   .route("/Admin/viewTenAdmins")
//   .get(auth.isAdminAuthenticated, (req, res) => {
//     controller.paginationPerPage
//   })

// router
//   .route("/Admin/searchAdmin")
//   .get(auth.isAdminAuthenticated, (req, res) => {
//     controller.searchAdmin
//   })

// router
//   .route("/Admin/createAdmin")
//   .get(auth.isAdminAuthenticated, (req, res) => {
//     controller.addAdmin
//   })
// router
//   .route("/Admin/deleteAdmin")
//   .get(auth.isAdminAuthenticated, (req, res) => {
//     controller.deleteAdmin
//   })

// router.route("/Admin/allAdmins").get(auth.isAdminAuthenticated, (req, res) => {
//   controller.findAllAdmins
// })

// router
//   .route("/Admin/getDetails/:id")
//   .get(auth.isAdminAuthenticated, (req, res) => {
//     controller.getAdminDetailsById
//   })

// router
//   .route("/Admin/getDetailsbyName")
//   .get(auth.isAdminAuthenticated, (req, res) => {
//     controller.getAdminDetails
//   })

const { isAdminAuthenticated } = require("../middleware/authStatus")
const admincontroller = require("../controllers/adminController")
const express = require("express")

router.route("/Admin/createAdmin").get(controller.createAdmin)
router.route("/Admin/deleteAdmin/:id").get(controller.deleteAdmin)

router.route("/Admin/getAllAdmins").get(controller.getAllAdmins)

router.route("/Admin/getAdminById/:id").get(controller.getAdminById)

router.route("/Admin/createTenAdmins").get(controller.createTenAdmins)
router.route("/Admin/updateAdmin/:id").get(controller.updateAdmin)
module.exports = router

/**
 * /Admin/createAdmin -> createAdmin
 * /Admin/getAllAdmins -> getAllAdmins
 * /Admin/getAllAdmins/:id -> getAdminById
 * /Admin/updateAdmin -> updateAdmin
 * /Admin/deleteAdmin/:id -> deleteAdmin
 */
module.exports = router
