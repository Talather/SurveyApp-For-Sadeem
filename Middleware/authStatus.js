//this function will check access token
exports.login = (req, res, next) => {
  console.log("middleware executed")
  console.log("delete fucntion middleware")
  const accessToken =
    req.header("x-access-token") || req.cookies["x-access-token"]
  if (accessToken) {
    console.log("accessToken is provided")
  }

  const secretKey = "Survey"

  if (!accessToken) {
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
    res.status(401).send("No access Token provided")
  }
}

//Api fuction to handle Refresh Token Request
exports.refresh = (req, res) => {
  const refreshToken =
    req.header("x-refresh-token") || req.cookies["x-refresh-token"]
  if (refreshToken) {
    console.log("refreshToken is provided")
  }
  if (!refreshToken) {
    console.log("refresh token is not provided")
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
