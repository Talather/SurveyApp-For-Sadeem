const router = require("express").Router()
const AuthService = require("../Middleware/userAuth")

// Employee login route.
router.post("/employee/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const Login = await AuthService.loginUser(email, password, req)

    res.status(200).json({ token })
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
})

// Employee logout route.
router.post("/employee/logout", async (req, res) => {
  const { token } = req.headers

  try {
    await AuthService.logoutUser(token)

    res.status(200).json({ message: "Logged out successfully." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
