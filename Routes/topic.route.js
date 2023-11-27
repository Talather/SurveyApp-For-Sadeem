const { isAdminAuthenticated } = require("../middleware/authStatus")
const controller = require("../controllers/topics.controller")
const admincontroller = require("../controllers/adminController")
const express = require("express")
const router = express.Router()
router.route("/Topic/createTopic").get(controller.createTopic)
router.route("/Topic/deleteTopic/:id").get(controller.deleteTopic)

router.route("/Topic/getAllTopics").get(controller.getAllTopics)

router.route("/Topic/getTopicById/:id").get(controller.getTopicById)

router.route("/Topic/createTenTopics").get(controller.createTenTopics)
router.route("/Topic/updateTopic").get(controller.updateTopic)
module.exports = router

/**
 * /Topic/createTopic -> createTopic
 * /Topic/getAllTopics -> getAllTopics
 * /Topic/getAllTopics/:id -> getTopicById
 * /Topic/updateTopic -> updateTopic
 * /Topic/deleteTopic/:id -> deleteTopic
 */
