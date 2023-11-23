// const { isAuthenticate } = require("../middleware/authStatus");
// const auth = require("../middleware/authStatus");
const controller = require("../controllers/adminController");
// const surveyController = require("../controllers/surveyCreation.controller");
const express = require("express");
// function logRequestURL(req, res, next) {
//   console.log("Request URL:", req.url)
//   next()
// }
const router = express.Router();

// router.post("/Admin/createSurvey", surveyController.createSurvey);

router
  .route("/Admin/viewAdminsPerPage/:page")
  .get( (req, res) => {
    controller.pagination(req,res);
  });

router
  .route("/Admin/searchAdmin/:keyword")
  .get( (req, res) => {
    controller.searchAdmin(req,res);
  });

router
  .route("/Admin/createAdmin")
  .get( (req, res) => {
    controller.createAdmin(req,res);
  });
router
  .route("/Admin/deleteAdmin")
  .get( (req, res) => {
    controller.deleteAdmin(req,res);
  });

router.route("/Admin/allAdmins").get((req, res) => {
  controller.findAllAdmins(req,res);
});

router
  .route("/Admin/getDetails/:id")
  .get( (req, res) => {
    controller.getAdminDetailsById;
  });

router
  .route("/Admin/getDetailsbyName")
  .get( (req, res) => {
    controller.getAdminDetails(req,res);
  });
router
  .route("/Admin/updateAdmin/:id")
  .get( (req, res) => {
    controller.updateAdminProfile(req,res);
  });
router
  .route("/Admin/createTenAdmins")
  .get( (req, res) => {
    console.log("para");
    // controller.makeTenAdmins
    controller.createTenAdmins()
  }
  );
module.exports = router;
