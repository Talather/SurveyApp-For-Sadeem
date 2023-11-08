const jwt = require("jsonwebtoken")
const admin = require("../Models/administrator")
const ErrorHandler = require("../utils/errorHandler")
const catchAsync = require("./catchAsync")

exports.isSuperAdminAuthenticated = catchAsync(async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    next(new ErrorHandler("Please Login to Access", 401))
    res.status(401).send("Not Authorized")
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRE)
  next()
})
