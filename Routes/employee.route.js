const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/employee.controller")
const express = require("express")
const router = express.Router()

router
  .route("/Employee/createTenEmployees")
  .get( controller.createTenEmployees)

router
  .route("/Employee/viewTenEmployees/:page")
  .get( controller.paginationPerPage)

router
  .route("/Employee/searchEmployee/:keyword")
  .get( controller.searchEmployee)

router
  .route("/Employee/createEmployee")
  .get( controller.addEmployee)
router
  .route("/Employee/deleteEmployee")
  .get(controller.deleteEmployee)

router
  .route("/Employee/allEmployees")
  .get( controller.findAllEmployees)

router
  .route("/Employee/getDetails/:id")
  .get( controller.getEmployeeDetailsById)

router
  .route("/Employee/getDetailsbyName")
  .get( controller.getEmployeeDetails)

router
  .route("/Employee/updateEmployee/:id")
  .post( controller.updateEmployeeProfile)

module.exports = router