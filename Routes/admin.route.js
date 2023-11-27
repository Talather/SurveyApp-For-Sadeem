const controller = require("../Controllers/admin.controller");
const express = require("express");
const router = express.Router();
router.route("/Admin/createAdmin").get((req, res) => {
  controller.createAdmin(req, res);
});
router.route("/Admin/deleteAdmin/:id").get((req, res) => {
  controller.deleteAdmin(req, res);
});

router.route("/Admin/getAllAdmins").get((req, res) => {
  controller.getAllAdmins(req, res);
});
router.route("/Admin/getAdminById/:id").get((req, res) => {
  controller.getAdminById(req, res);
});

router.route("/Admin/createTenAdmins").get((req, res) => {
  console.log("pak");
  controller.createTenAdmins(req, res);
});

router.route("/Admin/updateAdmin").get((req, res) => {
  controller.updateAdmin(req, res);
});
module.exports = router;
