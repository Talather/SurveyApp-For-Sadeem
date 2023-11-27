const { isAdminAuthenticated } = require("../middleware/authStatus");
const controller = require("../Controllers/topic.controller");
const admincontroller = require("../Controllers/admin.controller");
const express = require("express");
const router = express.Router();
router.route("/Topic/createTopic").get(controller.createTopic);
router.route("/Topic/deleteTopic/:id").get(controller.deleteTopic);

router.route("/Topic/getAllTopics").get(controller.getAllTopics);

router.route("/Topic/getTopicById/:id").get(controller.getTopicById);

router.route("/Topic/createTenTopics").get(controller.createTenTopics);
router.route("/Topic/updateTopic/:id").get(controller.updateTopic);
module.exports = router;
