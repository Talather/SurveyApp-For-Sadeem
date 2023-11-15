const { isAuthenticate } = require("../middleware/authStatus")
const controller = require("../controllers/topics.controller")
const express = require("express")
const router = express.Router()
router.route("/Topic/viewTenTopics").get(controller.paginationPerPage)

router.route("/Topic/searchTopic").get(isAuthenticate, controller.searchTopic)

router.route("/Topic/createTopic").get(isAuthenticate, controller.addTopic)
router.route("/Topic/deleteTopic").get(isAuthenticate, controller.deleteTopic)

router.route("/Topic/allTopics").get(isAuthenticate, controller.findAllTopics)

router
  .route("/Topic/getDetails/:id")
  .get(isAuthenticate, controller.getTopicDetailsById)

router
  .route("/Topic/getDetailsbyName")
  .get(isAuthenticate, controller.getTopicDetails)

module.exports = router
