const catchAsync = require("../middleware/catchAsync")
// const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")
const UserModel = require("../Models/user")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const speakeasy = require("speakeasy")

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.user)
  const { email, password } = req.body
  // Find the user in the database.
  const user = await UserModel.findOne({ email })

  // If the user does not exist, throw an error.
  if (!user) {
    throw new Error("Invalid username or password.")
  }

  // Compare the user's password to the hashed password in the database.
  const isPasswordValid = await bcrypt.compare(password, user.password)

  // If the password is not valid, throw an error.
  if (!isPasswordValid) {
    return next(new ErrorHandler("Email or Password doesn't match", 401))
  }
  const token = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  res
    .cookie("x-access-token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    }) // maxAge expire after 1 hour
    .header("x-access-token", token)
    .header("x-refresh-token", refreshToken)
    .header("access-control-expose-headers", "x-access-token")
    .send(_.pick(user, ["name", "email", "role", "_id"]))
})

exports.register = catchAsync(async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  let user = await UserModel.findOne({ email: email })
  if (user) return res.status(400).send("User already registered.")

  user = new UserModel(_.pick(req.body, ["name", "email", "password", "role"]))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  await user.save()

  const token = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  res
    .header("x-access-token", token)
    .header("x-refresh-token", refreshToken)
    .header("access-control-expose-headers", "x-access-token")
    .status(201)
    .send(_.pick(user, ["_id", "name", "email", "role"]))
})

exports.employeeAuth = catchAsync(async (req, res) => {
  const userToken = req.body.otp // Assuming OTP is sent in the request body

  if (!userToken) {
    return res.status(400).json({ message: "Missing OTP" })
  }
  const secret = "your_secret_key"
  const verified = speakeasy.totp.verify({
    secret: secret,
    token: userToken,
    encoding: "base32", // Adjust based on your encoding preference
    window: 1, //window refers to the allowed time window for verifying the user-provided TOTP code. It specifies how many time steps before and after the current time step Speakeasy should check for valid codes.
  })

  if (verified) {
    const token = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    res
      .cookie("x-access-token", token, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      }) // maxAge expire after 30 mins
      .header("x-access-token", token)
      .header("x-refresh-token", refreshToken)
      .header("access-control-expose-headers", "x-access-token")
      .send(_.pick(user, ["name", "email", "role", "_id"]))
    next() // Authorized, move to next middleware
  } else {
    return res.status(400).json({ message: "Bad Request" })
  }
})
