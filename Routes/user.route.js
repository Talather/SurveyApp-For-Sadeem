const userController = require("./../controllers/user.controller")
const { authMiddleware, authenticate } = require("./../middleware/authStatus")
const express = require("express")
const router = express.Router()
router.post("/registerUser", userController.registerUser)
router.post("/login", userController.loginUser)
// router.get("/logout", userController.logout)

module.exports = router
