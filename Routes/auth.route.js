const authController = require("./../Controllers/auth.controller");
const authmiddleware = require("../middleware/authStatus");
const express = require("express");
const router = express.Router();
router.post("/Auth/register", authController.register);
router.post("/Auth/login", authmiddleware.login);
router.post("/Auth/refresh", authmiddleware.refresh);
module.exports = router;
