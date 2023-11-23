const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/topics.controller")
const admincontroller = require("../controllers/adminController");
const express = require("express")
const router = express.Router()
router
  .route("/Topic/viewTopicsPerPage/:page")
  .get( controller.paginationPerPage)

router
  .route("/Topic/searchTopic/:keyword")
  .get( controller.searchTopic)

router
  .route("/Topic/createTopic")
  .get( controller.addTopic)
router
  .route("/Topic/deleteTopic")
  .get( controller.deleteTopic)

router
  .route("/Topic/allTopics")
  .get( controller.findAllTopics)

router
  .route("/Topic/getDetails/:id")
  .get(controller.getTopicDetailsById)

router
  .route("/Topic/getDetailsbyName")
  .get(controller.getTopicDetails)

router
  .route("/Topic/createTenTopics")
  .get(
     controller.createTenTopics,
    )
router
  .route("/Topic/updateTopics/:id")
  .get( controller.updateTopicProfile)
module.exports = router
