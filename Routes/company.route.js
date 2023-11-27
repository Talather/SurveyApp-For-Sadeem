const { isCompanyAuthenticated } = require("../middleware/authStatus");
const controller = require("../controllers/company.controller");
const express = require("express");
const router = express.Router();
router.route("/Company/createCompany").get(controller.createCompany);
router.route("/Company/deleteCompany/:id").get(controller.deleteCompany);

router.route("/Company/getAllCompanies").get(controller.getAllCompanies);

router.route("/Company/getCompanyById/:id").get(controller.getCompanyById);

router.route("/Company/createTenCompanies").get(controller.createTenCompanies);
router.route("/Company/updateCompany").get(controller.updateCompany);
module.exports = router;
