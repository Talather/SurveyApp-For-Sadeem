const app = require("./app")
const connectDatabase = require("./Models/connect")
const PORT = process.env.PORT || 4000

connectDatabase()

const server = app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`)
})
