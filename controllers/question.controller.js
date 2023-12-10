const catchAsync = require("../middleware/catchAsync")
const Question = require("../Models/question")
const mongoose = require("mongoose")
const answerController = require("./answer.controller")
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  let currentPage = 1
  let pageSize = 10
  let surveyId = ""
  var lookup = {
    $lookup: {
      from: "surveys",
      localField: "survey",
      foreignField: "_id",
      as: "survey",
    },
  }
  if (req.body.currentPage) {
    currentPage = req.body.currentPage
  }
  if (req.body.surveyId) {
    surveyId = req.body.surveyId
  }
  if (req.body.pageSize) {
    pageSize = req.body.pageSize
  } else if (pageSize === -1) {
    pageSize = 0
  }

  const count = {
    $count: "totalRecords",
  }

  const limit = {
    $limit: pageSize,
  }

  const match = {
    $match: {},
  }

  const skip = {
    $skip: (currentPage - 1) * pageSize,
  }

  if (req.body.surveyId) {
    match.$match.$and = [
      {
        "survey._id": {
          $eq: new mongoose.Types.ObjectId(surveyId),
        },
      },
    ]
  }

  const filter = [lookup, match, skip, limit]

  const list = await Question.aggregate(filter)
  let totalRecords = 0
  const countResult = await Question.aggregate([lookup, match, count])
  console.log(countResult)

  if (countResult[0]) {
    totalRecords = countResult[0].totalRecords
  }

  // res.status(200).json({
  //   currentPage,
  //   list,
  //   pageSize,
  //   totalRecords,
  //   totalPages: Math.ceil(totalRecords / pageSize),
  // });
  return list
})

// Get Question Details By Id
exports.getQuestionById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Question = await Question.findById(id)
  await Question.populate(["category", "survey", "topic", "subcategory"])
  console.log(Question)
  res.status(200).json(Question)
})

//  To Update a Question Profile
exports.updateQuestion = catchAsync(async (req, res, next) => {
  const { name, description, surveyId, categoryId, TopicId, subcategoryId } =
    req.body

  const questionUpdate = {
    name,
    description,
    survey: surveyId,
    topic: TopicId,
    category: categoryId,
    subcategory: subcategoryId,
  }
  try {
    const question = await Question.findByIdAndUpdate(
      req.body.id,
      questionUpdate,
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    )
    res.status(200).json(question)
  } catch (error) {
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

// Delete Question from list
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const Question = await Question.findById(req.params.id)
  await Question.deleteOne

  res.status(200).json({
    message: "Question deleted.",
  })
})
//Add Question in List
exports.createQuestion = catchAsync(async (req, res, next) => {
  // console.log(surveyId);
  const { name, description, categoryId, subcategoryId, surveyId, topicId } =
    req.body
  const questionCreate = {
    name,
    description,
    category: categoryId,
    subcategory: subcategoryId,
    survey: surveyId,
    topic: topicId,
  }
  try {
    const question = await Question.create(questionCreate)
    res.status(200).json(question)
  } catch (error) {
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

exports.createTenQuestions = async (req, res, next) => {
  const questions = []
  for (let i = 0; i < 10; i++) {
    questions.push({
      name: "Question 7",
      email: `Question${i}@example.com`,
      role: "Question",
    })
  }
  // Insert the Question documents into the database.
  const p = await Question.insertMany(questions)
  res.status(200).json({
    success: true,
    p,
  })
}

exports.createMultipleQuestions = catchAsync(async (req, res, next) => {
  const { questionCreates, surveyId } = req.body
  if (questionCreates) {
    questionCreates.forEach(async (questionCreate) => {
      questionCreate.survey = surveyId
      await Question.create(questionCreate)

      // if (questionCreate.answerCreates) {
      //   for (const answerCreate of questionCreate.answerCreates) {
      //     answerCreate.question = question._id
      //     await answerController.createAnswer(answerCreate)
      //   }
      // }
    })
  }
})
