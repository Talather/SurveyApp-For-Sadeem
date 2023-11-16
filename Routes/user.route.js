const userController = require("./../controllers/user.controller")
const { authMiddleware, isAuthenticate } = require("./../middleware/authStatus")
const express = require("express")
const router = express.Router()
router.post("/registerUser", userController.registerUser)
router.post("/login", userController.loginUser)

module.exports = router
