const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/employee.controller")
const admincontroller = require("../controllers/adminController")
const express = require("express")
const router = express.Router()
router.route("/Employee/createEmployee").get(controller.createEmployee)
router.route("/Employee/deleteEmployee/:id").get(controller.deleteEmployee)

router.route("/Employee/getAllEmployees").get(controller.getAllEmployees)

router.route("/Employee/getEmployeeById/:id").get(controller.getEmployeeById)

router.route("/Employee/createTenEmployees").get(controller.createTenEmployees)
router.route("/Employee/updateEmployee").get(controller.updateEmployee)
module.exports = router

/**
 * /Employee/createEmployee -> createEmployee
 * /Employee/getAllEmployees -> getAllEmployees
 * /Employee/getAllEmployees/:id -> getEmployeeById
 * /Employee/updateEmployee -> updateEmployee
 * /Employee/deleteEmployee/:id -> deleteEmployee
 */
