const catchAsync = require("../middleware/catchAsync")
const Survey = require("../Models/survey")
const Question = require("../Models/question")
const AnswerModel = require("../Models/answer")
const response = require("../Models/response")
const completedSurvey = require("../Models/completedSurvey")
exports.fillSurvey = catchAsync(async (req, res, next) => {
  const { surveyId } = req.body
  const survey = Survey.findById(surveyId)
  const questions = Question.find({ survey: surveyId })
  let Answers = []
  questions.forEach(async (question) => {
    const answer = await AnswerModel.find(
      { question: question._id }.then(Answers.push(answer))
    )
  })
  res.status(200).json({
    message: "survey presented to user",
    survey: survey,
    questions: questions,
    answers: Answers,
  })
})
// flat_list = []
// for sublist in data:
//     for item in sublist:
//         flat_list.append(item)
exports.completeSurveyAction = catchAsync(async (req, res, next) => {
  const { answersResponded, surveyId, employeeId, surveyName } = req.body
  //answersResponded is the array of answer ids

  const completedSurvey = await completedSurvey.create({
    name: `Completion of ${surveyName} survey`,
    survey: surveyId,
    employee: employeeId,
  })
  await completedSurvey.populate(["survey", "employee"])

  answersResponded.forEach(async (answerId) => {
    const response = await Response.create({
      name: "Response",
      completedSurvey: completedSurvey._id,
      answer: answerId,
    })
    await response.populate("answer")
  })
  res
    .status(200)
    .json({ message: "survey submitted successfully", completedSurvey })
})
