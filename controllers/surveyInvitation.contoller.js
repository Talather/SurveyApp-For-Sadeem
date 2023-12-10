const catchAsync = require("../middleware/catchAsync")
const ErrorHandler = require("../utils/errorHandler")
const speakeasy = require("speakeasy")
const sgMail = require("@sendgrid/mail")
const surveyInvitation = require("../Models/surveyInvitation")
const Employee = require("../Models/employee")
const Admin = require("../Models/Administrator")
const Survey = require("../Models/survey")

exports.generateOtp = catchAsync((req, res, next) => {
  //sample code to generate otp
  // const otpi = otp.generate(6, {
  //   digits: true,
  //   alphaUpper: false,
  //   alphaLower: true,
  //   specialChars: false,
  // })
  // console.log(otpi) // e.g., 452813

  // Generate an OTP based on the secret and current time
  const secret = "your_secret_key"
  const token = speakeasy.totp({
    secret: secret,
    encoding: "base32", // Ensure the encoding matches the encoding used when generating the secret
  })

  return token
})

exports.sendMail = catchAsync(
  async (
    adminEmail,
    employeeEmail,
    otp,
    surveyId,
    employeeId,
    req,
    res,
    next
  ) => {
    const body =
      "Dear [Employee Name],We are conducting an employee survey to gather valuable feedback about your experience at [Company Name]. Your participation is crucial in helping us identify areas for improvement and ensure we are fostering a positive and productive work environment for everyone.To ensure the confidentiality and anonymity of your responses, we have partnered with a third-party survey provider. You will receive a unique One-Time Password (OTP) via SMS to your registered mobile number to access the survey. Please keep this OTP confidential."
    const structure = {
      to: adminEmail,
      from: employeeEmail,
      subject: "Employee Survey - Your Feedback Matters!",
      html: `<strong>${body}</strong><form action="https://fillSurvey.com" method="get" style="display: none;">
  <input type="hidden" name="surveyId" value=${surveyId}>
  <input type="hidden" name="employeeId" value=${employeeId}>
  <button type="submit">Click here to take the survey</button>
</form><strong>otp:${otp}</strong>`,
    }

    try {
      otp = generteOtp()
      await sgMail.send(otp, structure)
      console.log("Test email sent successfully")
    } catch (error) {
      console.error("Error sending test email")
      console.error(error)
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }
)

exports.shareSurvey = catchAsync(async (req, res, next) => {
  const { surveyId, AdminId } = req.body
  const { employeeIds } = req.body //arrof of employee ids
  const survey = Survey.findById(surveyId)
  let singleEmployee = []

  employeeIds.forEach(async (employeeId) => {
    const employee = await Employee.findById(employeeId).then((employee) => {
      singleEmployee.push(employee)
    })
  })
  const admin = Admin.findById(AdminId)
  for (let employee in singleEmployees) {
    const otp = this.generateOtp
    surveyInvitation.create({
      name: `${survey.name}Invitation`,
      survey: survey._id,
      employee: employee._id,
      otp: otp,
      completed: false,
      sentBy: AdminId,
    })
    this.sendMail(
      employee.email,
      admin.email,
      admin._id,
      survey._id,
      employee._id,
      otp
    )
  }
})
