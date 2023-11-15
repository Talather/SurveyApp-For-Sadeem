const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler")
const catchAsync = require("./catchAsync")

exports.authMiddleware = (req, res, next) => {
  // if (!getEnv("REQUIRES_AUTH")) return next();
  const token = req.header("x-access-token") || req.cookies["x-access-token"]
  if (!token) return res.status(401).send("Access denied. No token provided.")
  console.log(token)

  try {
    req.user = jwt.verify(token, "Survey")
    console.log(req.user.role)
    if (req.user.role !== "admin") {
      return res.status(401).send("Access denied")
    }
    next()
  } catch (ex) {
    if (ex.message === JWT_ERRORS.expired)
      return res.status(400).send("Jwt Token is Expired")

    res.status(400).send("Invalid token.")
  }
}

exports.isAuthenticate = (req, res, next) => {
  console.log("middleware executed")
  console.log("delete fucntion middleware")
  const accessToken =
    req.header("x-access-token") || req.cookies["x-access-token"]
  // const accessToken = req.headers['authorization'];
  if (accessToken) {
    console.log("accessToken is provided")
  }
  const refreshToken =
    req.header("x-refresh-token") || req.cookies["x-refresh-token"]
  if (refreshToken) {
    console.log("refreshToken is provided")
  }
  const secretKey = "Survey"

  if (!accessToken && !refreshToken) {
    console.log("access denied")
    return res.status(401).send("Access Denied. No token provided.")
  }

  try {
    req.user = jwt.verify(accessToken, secretKey)

    console.log("access token verified")

    // if (req.user.role !== "admin") {
    //   return res.status(401).send("Access denied")
    // }
    next()
  } catch (error) {
    if (!refreshToken) {
      console.log("oo lala")
      return res.status(401).send("Access Denied. No refresh token provided.")
    }

    try {
      const decoded = jwt.verify(refreshToken, secretKey)
      const payload = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        ref: "AT101010",
      }
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" })

      res
        .cookie("x-access-token", accessToken, {
          httpOnly: true,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        })
        .header("x-access-token", accessToken)
        .header("x-refresh-token", refreshToken)
        .send(decoded)
    } catch (error) {
      return res.status(400).send("Invalid Token.")
    }
  }
}
