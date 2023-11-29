const mongoose = require("mongoose");
// const adminModel = require("./Administrator");
// const answermodels = require("./answer");
// const categoryModels = require("./Category");
// const companymodels = require("./Company");
// const completedSurveysmodels = require("./completedsurvey");
// const employeemodels = require("./employee");
// const questionmodels = require("./question");
// const responsemodels = require("./response");
// const subcategoriesmodels = require("./subcategory");
// const surveymodels = require("./survey");
// const surveyinvitationsmodels = require("./surveyinvitation");
// const CompanyModels = require("./Company");
// const TopicModels = require("./topic");
// const userModel = require("./user");
async function connectdb() {
  await mongoose.connect("mongodb://localhost:27017/Survey-App");

  console.log("db connected");
}
module.exports = connectdb;
// connectdb()
