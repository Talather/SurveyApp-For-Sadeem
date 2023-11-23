const userController = require("./../controllers/user.controller")
const express = require("express")
const router = express.Router()
router.post("/register", userController.register)
router.post("/login", userController.loginUser)

module.exports = router

/**
 * /Auth/register
 * /Auth/login
 * /Auth/refresh
 */