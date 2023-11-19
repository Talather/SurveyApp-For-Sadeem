const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler")
const catchAsync = require("./catchAsync")

exports.authMiddleware = (req, res, next) => {
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

//the isAdminAuthenticated() function code checks both the access token and refresh token of the user. It first checks if the access token is provided in the request headers or cookies. If it is, it verifies the token using the secret key. If the token is valid, it checks if the user's role is "admin". If it is, it allows the user to proceed to the next middleware function. Otherwise, it returns an error message.
//If the access token is not provided, it checks if the refresh token is provided in the request headers or cookies. If it is, it verifies the refresh token using the secret key. If the refresh token is valid, it generates a new access token and sends it to the client. It also sends the refresh token back to the client.
//If neither the access token nor the refresh token is provided, it returns an error message.
exports.isAdminAuthenticated = (req, res, next) => {
  console.log("middleware executed")
  const accessToken =
    req.header("x-access-token") || req.cookies["x-access-token"]
  // const accessToken = req.headers['authorization'];
  if (accessToken) {
    console.log("accessToken is provided")
  }
  // const refreshToken =
  //   req.header("x-refresh-token") || req.cookies["x-refresh-token"]
  // if (refreshToken) {
  //   console.log("refreshToken is provided")
  // }
  const secretKey = "Survey"

  // if (!accessToken && !refreshToken) {
  if (!accessToken) console.log("access denied.no access token is provided")
  return res.status(401).send("Access Denied. No token provided.")
}

try {
  req.user = jwt.verify(accessToken, secretKey)

  console.log("access token verified")

  if (req.user.role !== "admin") {
    return res.status(401).send("Access denied")
  }
  next()
} catch (error) {
  //   if (!refreshToken) {
  //     console.log("oo lala")
  //     return res.status(401).send("Access Denied. No refresh token provided.")
  //   }

  //   try {
  //     const decoded = jwt.verify(refreshToken, secretKey)
  //     const payload = {
  //       _id: decoded._id,
  //       name: decoded.name,
  //       email: decoded.email,
  //       role: decoded.role,
  //       ref: "AT101010",
  //     }
  //     const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" })

  //     res
  //       .cookie("x-access-token", accessToken, {
  //         httpOnly: true,
  //         maxAge: 365 * 24 * 60 * 60 * 1000,
  //       })
  //       .header("x-access-token", accessToken)
  //       .header("x-refresh-token", refreshToken)
  //       .send(decoded)
  //   } catch (error) {
  return res.status(400).send("Invalid Token.")
  //   }
}

exports.isEmployeeAuthenticated = (req, res, next) => {
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

    if (req.user.role !== "admin") {
      return res.status(401).send("Access denied")
    }
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
