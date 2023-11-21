const shareApi = require("@sendgrid/mail")
const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const Admin = require("../inspireAppModels/administrator")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const crypto = require("crypto")
const http = require("http")
const express = require("express")
const otp = require("otp-generator")
const Employee = require("../inspireAppModels/employee")
const surveyInvitations = require("../inspireAppModels/surveyInvitations")
const surveyInvitation = require("../inspireAppModels/surveyInvitations")
const SurveyModel = require("../inspireAppModels/survey")
const employee = require("../inspireAppModels/employee")
// Super Employee Search
exports.searchEmployee = catchAsync(async (req, res, next) => {
  const keyword = decodeURIComponent(req.query.keyword)
  if (keyword) {
    const searchedEmployees = await employee.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          company: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })

    res.status(200).json({
      success: true,
      searchedEmployees,
    })
  }
})

exports.shareSurvey = catchAsync(async (req, res, next) => {
  this.generateOTP()

  let adminId = req.body.admin_id
  // console.log('admin id:', adminId);
  let surveyId = req.body.survey_id
  // console.log('survey id:', surveyId);
  let userID = req.body.user_id
  // console.log('user ID:', userID);

  const admin = await Admin.findById(req.body.admin_id)
  const employee = await employee.findById(req.body.user_id)
  const survey = await SurveyModel.findById(surveyId)
  //Entire Email sending process
  let surveyUrl = `https://fillSurvey/${surveyId}/${userID}`
  sendGridMail.setApiKey(process.env.YOUR_SENDGRID_API_KEY)
  const message = {
    from: "Admin.email",
    to: "employee.email",
    subject: "survey for the user",
    text: `Your one-time passcode (OTP) is <b>${otp}</b>. Please click on the following link to perfrom your survey`,
    html: `<h1>Please click on the following link to complete the survey:</h1><a>${surveyUrl}</a>`,
  }
  sendGridMail.send(message, (error, info) => {
    if (error) {
      console.error("Error sending email:", error)
    } else {
      console.log("Email sent successfully:", info)
    }

    //Survey_Invitation document creation
    surveyInvitation.create({
      name: `${survey.name}invitation`,
      description: "",
      survey: surveyId,
      employee: userID,
      otp: this.otp,
      completed: false,
    })
  })
})

exports.generateOTP = catchAsync(async (req, res, next) => {
  const length = 6 // Generate a random string of digits
  const digits = crypto.randomBytes(length).toString("hex").substring(0, length)

  // Convert the digits to an integer
  const Otp = parseInt(digits, 16)
  // Generate an OTP with a length of 6 digits
  const otp = generateOTP(6)

  console.log(`Generated OTP: ${otp}`)
  return otp
})
