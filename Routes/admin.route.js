// const { isAdminAuthenticated } = require("../middleware/authStatus")
// const admincontroller = require("../controllers/adminController")
// const express = require("express")

// router.route("/Admin/createAdmin").get(controller.createAdmin)
// router.route("/Admin/deleteAdmin/:id").get(controller.deleteAdmin)

// router.route("/Admin/getAllAdmins").get(controller.getAllAdmins)

// router.route("/Admin/getAdminById/:id").get(controller.getAdminById)

// router.route("/Admin/createTenAdmins").get(controller.createTenAdmins)
// router.route("/Admin/updateAdmin/:id").get(controller.updateAdmin)
// module.exports = router

/**
 * /Admin/createAdmin -> createAdmin
 * /Admin/getAllAdmins -> getAllAdmins
 * /Admin/getAllAdmins/:id -> getAdminById
 * /Admin/updateAdmin -> updateAdmin
 * /Admin/deleteAdmin/:id -> deleteAdmin
//  */
// module.exports = router
// =======
const controller = require("../Controllers/admin.controller")
const express = require("express")
const router = express.Router()
router.route("/Admin/createAdmin").get((req, res) => {
  controller.createAdmin(req, res)
})
router.route("/Admin/deleteAdmin/:id").get((req, res) => {
  controller.deleteAdmin(req, res)
})

router.route("/Admin/getAllAdmins").get((req, res) => {
  controller.getAllAdmins(req, res)
})
router.route("/Admin/getAdminById/:id").get((req, res) => {
  controller.getAdminById(req, res)
})

router.route("/Admin/createTenAdmins").get((req, res) => {
  console.log("pak")
  controller.createTenAdmins(req, res)
})

router.route("/Admin/updateAdmin").get((req, res) => {
  controller.updateAdmin(req, res)
})
module.exports = router
// >>>>>>> d91bd4654c12395c6de7d368322
