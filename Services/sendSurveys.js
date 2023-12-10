const sgMail = require("@sendgrid/mail")
const otp = require("otp-generator")

//sample code to generate otp
const otpi = otp.generate(6, {
  digits: true,
  alphaUpper: false,
  alphaLower: true,
  specialChars: false,
})
console.log(otpi) // e.g., 452813

//sample code for email
function getMessage() {
  const body =
    "Dear [Employee Name],We are conducting an employee survey to gather valuable feedback about your experience at [Company Name]. Your participation is crucial in helping us identify areas for improvement and ensure we are fostering a positive and productive work environment for everyone.To ensure the confidentiality and anonymity of your responses, we have partnered with a third-party survey provider. You will receive a unique One-Time Password (OTP) via SMS to your registered mobile number to access the survey. Please keep this OTP confidential."
  return {
    to: "you@domain.com",
    from: "verifiedemail@previousstep.com",
    subject: "Employee Survey - Your Feedback Matters!",
    text: body,
    html: `<strong>${body}</strong>`,
  }
}

async function sendEmail() {
  try {
    await sgMail.send(getMessage())
    console.log("Test email sent successfully")
  } catch (error) {
    console.error("Error sending test email")
    console.error(error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

;(async () => {
  console.log("Sending test email")
  await sendEmail()
})()
