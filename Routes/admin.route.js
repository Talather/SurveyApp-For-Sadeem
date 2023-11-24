// const { isAuthenticate } = require("../middleware/authStatus");
// const auth = require("../middleware/authStatus");
const controller = require("../Controllers/adminController");
// const surveyController = require("../controllers/surveyCreation.controller");
const express = require("express");
// function logRequestURL(req, res, next) {
//   console.log("Request URL:", req.url)
//   next()
// }
const router = express.Router();

// router.post("/Admin/createSurvey", surveyController.createSurvey);

router.route("/Admin/createAdmin").get((req, res) => {
  controller.createAdmin(req, res);
});
router.route("/Admin/deleteAdmin/:id").get((req, res) => {
  controller.deleteAdmin(req, res);
});

router.route("/Admin/getAllAdmins").get((req, res) => {
  controller.getAllAdmins(req, res);
});

router.route("/Admin/getAdmin/:id").get((req, res) => {
  controller.getAdminById;
});

router.route("/Admin/updateAdmin").get((req, res) => {
  controller.updateAdmin(req, res);
});
router.route("/Admin/createTenAdmins").get((req, res) => {
  controller.createTenAdmins();
});
module.exports = router;
