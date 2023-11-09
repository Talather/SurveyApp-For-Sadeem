const authRouter = require("express").Router();
const userController = require("./../controllers/user.controller");
const { authMiddleware } = require("./../middleware/authStatus");
authRouter.post("/registerUser", userController.registerUser);
authRouter.post("/login", userController.loginUser);
authRouter.get("/logout", userController.logout);

// authRouter.get("/changePassword" , authMiddleware , userController.changePassword);s
module.exports = authRouter;
