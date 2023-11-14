const authRouter = require("express").Router()
const userController = require("./../controllers/user.controller")
const { authMiddleware, authenticate } = require("./../middleware/authStatus")
const uc = require("./../controllers/user.controller")
authRouter.post("/registerUser", userController.registerUser)
authRouter.post("/login", userController.loginUser)
// authRouter.get("/logout", userController.logout)

module.exports = authRouter
