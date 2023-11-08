const sendCookie = (t = {}, statusCode, res) => {
  const token = t.generateToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    t,
  })
}

module.exports = sendCookie
