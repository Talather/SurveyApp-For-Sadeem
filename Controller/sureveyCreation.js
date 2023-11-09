const catchAsync = require("../Middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const survey = require("../Inspire_App_Models/survey")
const http = require("http")
const Survey = require("../Inspire_App_Models/survey")
const Question = require("../Inspire_App_Models/question")
const Answer = require("../Inspire_App_Models/answer")
const Questions = require("../Inspire_App_Models/question")
const Ajv = require("ajv")

// create survey
exports.createSurvey = catchAsync(async (req, res, next) => {
  const { name, description } = JSON.parse(req.body)
  const questions = JSON.parse(req.body.questions)
  const answers = JSON.parse(req.body.answers)
  const QuestionNode = [{}]
  for (const i in questions) {
    QuestionNode[key] = []
  }
  const surveyExist = await Order.findOne({ paymentInfo })

  if (surveyExist) {
    return next(new ErrorHandler("Survey Already Placed", 400))
  }

  //To validate the parsed version of data
  const questionSchema = {
    name: { type: "string", required: false },
    description: [{ type: "string", required: false }],
  }
  const isValid = Ajv.validate(questionSchema, parsedQuestion)
  if (!isValid) {
    return res.status(400).send("Invalid question format")
  }

  const surveyData = { name, description, questions, answers }
  const createdSurvey = await Survey.create(surveyData)
  //Create a Question Document for that survey document so that it could be refernced
  questionData = { survey: createdSurvey._id, questions }
  addQuestionDocument = await Questions.create(questionData)

  //Create a answer Document for that survey document so that it could be refernced
  addAnswerDocument = await Answer.create(answers)

  res.status(200).json({
    success: true,
    message: "Survey created Successfully",
  })
})
