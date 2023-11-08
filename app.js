const express = require("express")
const cookieParser = require("cookie-parser")

const path = require("path")

const app = express()

app.use(express.json()) //middleware parses incoming JSON requests and makes the parsed JSON data available on the req.body object.
app.use(express.urlencoded({ extended: true })) //parsed request body data is made available on the req.body object.
app.use(cookieParser()) //parsed cookie data from incoming request and made available on the req.cookies object.
app.use("/public", express.static("public")) //Checks the Accept header of the incoming request. If the Accept header indicates that the client can accept static files, the middleware serves the requested file from the specified directory.

// if (process.env.NODE_ENV != "production") {
//   require("dotenv").config({ path: "backend/config/config.env" })
// }

// import routes
const post = require("./routes/postRoute")

// middleware fucntions
app.use("/api/v1", post) //request towards /api/v1 will be processed by the middleware functions i.e Post
