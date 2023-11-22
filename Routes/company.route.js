const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/company.controller")
const express = require("express")
const router = express.Router()
router
  .route("/Company/createTenCompanies")
  .get( controller.createTencompanies)

router
  .route("/Company/viewTenCompanies/:page")
  .get( controller.paginationPerPage)

router
  .route("/Company/searchCompany/:keyword")
  .get( controller.searchcompany)

router
  .route("/Company/createCompany")
  .get( controller.addcompany)
router
  .route("/Company/deleteCompany")
  .get(controller.deletecompany)

router
  .route("/Company/allCompanies")
  .get( controller.findAllcompanies)

router
  .route("/Company/getDetails/:id")
  .get( controller.getcompanyDetailsById)

router
  .route("/Company/getDetailsbyName")
  .get( controller.getcompanyDetails)

router
  .route("/Company/updatecompany/:id")
  .post( controller.updatecompanyProfile)

module.exports = router