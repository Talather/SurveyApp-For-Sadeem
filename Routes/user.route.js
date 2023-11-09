const authRouter = require("express").Router();
const userController = require("./../controllers/user.controller");
authRouter.get("/login", userController.loginUser);

module.exports = authRouter;
