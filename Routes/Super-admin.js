const express = require("express")
import { loginUser } from "../Middleware/userAuth"
const { isSuperAdminAuthenticated } = require("../Middleware/authStatus")

const router = express()

router.route("/Super-Admin/Login").post(loginUser)

router.route("/Super-Admin/Home").get(isSuperAdminAuthenticated, superAdmin) // This route will be protected by the isAuthenticated middleware function,and the other one is controller function  to creta new.

router
  .route("/Super-Admin/viewAllAdmins")
  .get(isSuperAdminAuthenticated, viewAllAdmins)

router
  .route("/Super-Admin/createAdmin")
  .get(isSuperAdminAuthenticated, newAdmin)

router
  .route("/Super-Admin/deleteAdmin")
  .get(isSuperAdminAuthenticated, removeAdmin)

module.exports = router
