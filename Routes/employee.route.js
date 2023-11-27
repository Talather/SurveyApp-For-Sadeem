const { isAdminAuthenticated } = require("../middleware/authStatus");
const controller = require("../Controllers/Employee.controller");
const express = require("express");
const router = express.Router();
router.route("/Employee/createTenEmployees").get(controller.createTenEmployees);

router.route("/Employee/createEmployee").get(controller.createEmployee);
router.route("/Employee/deleteEmployee/:id").get(controller.deleteEmployee);

router.route("/Employee/getAllEmployees").get(controller.getAllEmployees);

router.route("/Employee/getEmployee/:id").get(controller.getEmployeeById);

router.route("/Employee/updateEmployee").post(controller.updateEmployee);

module.exports = router;
