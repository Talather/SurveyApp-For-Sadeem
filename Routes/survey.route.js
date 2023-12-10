const controller = require("../controllers/survey.controller")

const express = require("express")
const router = express.Router()
router.route("/Survey/createSurvey").get(controller.createSurvey)
router.route("/Survey/deleteSurvey/:id").get(controller.deleteSurvey)

router.route("/Survey/getAllSurveys").get(controller.getAllSurveys)

router.route("/Survey/getSurveyById/:id").get(controller.getSurveyById)

router.route("/Survey/createTenSurveys").get(controller.createTenSurveys)
router.route("/Survey/updateSurvey/:id").get(controller.updateSurvey)
module.exports = router
