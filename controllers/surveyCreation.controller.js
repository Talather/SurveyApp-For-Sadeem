const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Survey = require("./../inspireAppModels/survey")
const http = require("http")
const Question = require("./../inspireAppModels/question")
const Answer = require("./../inspireAppModels/answer")
const val = require("ajv")

// create survey
exports.createSurvey = catchAsync(async (req, res, next) => {
  const { name, description, questions } = req.body
  const surveyExist = await Survey.findOne({ name })

  if (surveyExist) {
    return next(new ErrorHandler("Survey Already Placed", 400))
  }

  // this data should come from frontend
  // survey name : "Survey for animals"
  // description : "How should Animals Survive ? "
  // questions : [{ name : "question1" , description : "" , answers: [] }]
  // answers : [{name : "answer1" ,  description : ""}]

  let questionIds = []

  for (let question of questions) {
    let answerIds = []

    for (let answer of question.answers) {
      let answerId = await Answer.create({
        name: answer.name,
        description: answer.description,
        score: answer.score,
      })
      answerIds.push(answerId.id)
    }

    let questionId = await Question.create({
      name: question.name,
      description: question.description,
      questionAnswers: answerIds,
    })
    questionIds.push(questionId.id)
  }

  let survey = await Survey.create({
    name: name,
    description: description,
    surveyQuestions: questionIds,
  })
  console.log(survey)

  res.status(200).json({
    success: true,
    message: "Survey created Successfully",
    survey,
  })
})
