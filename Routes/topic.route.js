const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/topics.controller")
const express = require("express")
const router = express.Router()
router
  .route("/Topic/viewTenTopics")
  .get(isAdminAuthenticated, controller.paginationPerPage)

router
  .route("/Topic/searchTopic")
  .get(isAdminAuthenticated, controller.searchTopic)

router
  .route("/Topic/createTopic")
  .get(isAdminAuthenticated, controller.addTopic)
router
  .route("/Topic/deleteTopic")
  .get(isAdminAuthenticated, controller.deleteTopic)

router
  .route("/Topic/allTopics")
  .get(isAdminAuthenticated, controller.findAllTopics)

router
  .route("/Topic/getDetails/:id")
  .get(isAdminAuthenticated, controller.getTopicDetailsById)

router
  .route("/Topic/getDetailsbyName")
  .get(isAdminAuthenticated, controller.getTopicDetails)

router
  .route("/Topic/createTenTopics")
  .get( controller.createTenTopics)
module.exports = router
