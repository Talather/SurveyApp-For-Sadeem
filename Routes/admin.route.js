const router = require("express").Router()
const AuthService = require("../Middleware/authStatus")
const controller = require("../controllers/adminController")

const express = require("express")

router.route("/Admin/viewTenAdmins").get((req, res) => {
  controller.paginationPerPage(req, res)
})

router.route("/Admin/searchAdmin").get((req, res) => {
  controller.searchAdmin(req, res)
})

router.route("/Admin/createAdmin").get((req, res) => {
  controller.addAdmin(req, res)
})
router.route("/Admin/deleteAdmin").get((req, res) => {
  controller.deleteAdmin(req, res)
})

router.route("/Admin/allAdmins").get((req, res) => {
  controller.findAllAdmins(req, res)
})

module.exports = router
