const express = require("express");
const cookieParser = require("cookie-parser");

const path = require("path");

const app = express();

app.use(express.json()); //middleware parses incoming JSON requests and makes the parsed JSON data available on the req.body object.
app.use(express.urlencoded({ extended: true })); //parsed request body data is made available on the req.body object.
app.use(cookieParser());

// import routes
// const topicRoutes = require("./Routes/topic.route");
const adminRoutes = require("./Routes/admin.route");
// const userRoutes = require("./routes/auth.route");
// const subCategoryRoutes = require("./Routes/subCategory.route");
const categoryRoutes = require("./Routes/category.route");
const companyRoutes = require("./Routes/company.route");
const EmployeeRoutes = require("./Routes/employee.route");
const surveyRoutes = require("./Routes/survey.route");
// app.use("/", userRoutes);
// app.use("/", topicRoutes);
app.use("/", adminRoutes);
// app.use("/", categoryRoutes);
// app.use("/", surveyRoutes);

// app.use("/",subCategoryRoutes)
app.use("/", companyRoutes);
app.use("/", EmployeeRoutes);
module.exports = app;
