const express = require("express");
const cookieParser = require("cookie-parser");

const path = require("path");

const app = express();

app.use(express.json()); //middleware parses incoming JSON requests and makes the parsed JSON data available on the req.body object.
app.use(express.urlencoded({ extended: true })); //parsed request body data is made available on the req.body object.
app.use(cookieParser());

// import routes
const topicRoutes = require("./routes/topic.route");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
// const { isAuthenticate } = require("./middleware/authStatus")
app.use("/", userRoutes);
app.use("/", topicRoutes);
app.use("/", adminRoutes);

module.exports = app;
