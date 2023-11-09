const express = require("express");
const cookieParser = require("cookie-parser");

const path = require("path");

const app = express();

app.use(express.json()); //middleware parses incoming JSON requests and makes the parsed JSON data available on the req.body object.
app.use(express.urlencoded({ extended: true })); //parsed request body data is made available on the req.body object.
app.use(cookieParser());

// import routes
const userRoutes = require("./routes/user.route");
app.use("/", userRoutes);
// middleware fucntions
// app.use("/api/v1", post) //request towards /api/v1 will be processed by the middleware functions i.e Post
module.exports = app;
