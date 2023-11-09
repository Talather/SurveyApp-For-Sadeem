const mongoose = require("mongoose")
const adminModel = require("./administrator")
const answermodels = require("./answer")
const categoryModels = require("./category")
const companymodels = require("./company")
const completedSurveysmodels = require("./completedsurveys")
const employeemodels = require("./employee")
const questionmodels = require("./question")
const responsemodels = require("./response")
const subcategoriesmodels = require("./subcategories")
const surveymodels = require("./survey")
const surveyinvitationsmodels = require("./surveyinvitations")
const CompanyModels = require("./company")

async function connectdb() {
  await mongoose.connect("mongodb://localhost:27017/Survey-App")
  console.log("db connected")

  // await employeemodels.create({ name: "survey", company: y.id })
  // const k = await employeemodels
  //   .findById("65428e28ed23eb1be0f4a1ee")
  //   .populate({ path: "company" })
  console.log(k)
  console.log("marvel")
}

connectdb()
