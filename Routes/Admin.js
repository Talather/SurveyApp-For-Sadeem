const router = require("express").Router()
const AuthService = require("../Middleware/userAuth")

// Admin login route.
router.post("/Admin/login", async (req, res) => {
  const { email, password } = req.body
  const { token } = req.header

  try {
    const login = await AuthService.loginUser(email, password, req)
    res.status(200).json({ token })
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
})

// Admin logout route.
router.post("/Admin/logout", async (req, res) => {
  const { token } = req.headers

  try {
    await AuthService.logoutUser(token)

    res.status(200).json({ message: "Sucessfully Logged out" })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
})
