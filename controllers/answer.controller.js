const catchAsync = require("../middleware/catchAsync")
const Answer = require("../Models/answer")
const Question = require("../Models/question")
const mongoose = require("mongoose")
exports.getAllAnswers = catchAsync(async (req, res, next) => {
  let currentPage = 1
  let pageSize = 10
  let questionId = ""

  if (req.body.currentPage) {
    currentPage = req.body.currentPage
  }
  if (req.body.questionId) {
    questionId = req.body.questionId
  }
  if (req.body.pageSize) {
    pageSize = req.body.pageSize
  } else if (pageSize === -1) {
    pageSize = 0
  }
  var lookup = {
    $lookup: {
      from: "questions",
      localField: "question",
      foreignField: "_id",
      as: "question",
    },
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

  if (questionId) {
    match.$match.$and = [
      {
        "question._id": {
          $eq: new mongoose.Types.ObjectId(questionId),
        },
      },
    ]
  }

  const filter = [lookup, match, skip, limit]

  const list = await Answer.aggregate(filter)
  let totalRecords = 0
  const countResult = await Answer.aggregate([lookup, match, count])
  console.log(countResult)

  if (countResult[0]) {
    totalRecords = countResult[0].totalRecords
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
    totalPages: Math.ceil(totalRecords / pageSize),
  })
})

// Get Answer Details By Id
exports.getAnswerById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const answer = await Answer.findById(id)
  await answer.populate("question")
  console.log(answer)
  res.status(200).json(answer)
})

//  To Update a Answer Profile
exports.updateAnswer = catchAsync(async (req, res, next) => {
  const { name, description, questionId, score } = req.body

  const answerUpdate = {
    name,
    description,
    score: score,
    question: questionId,
  }
  try {
    const answer = await Answer.findByIdAndUpdate(req.body.id, answerUpdate, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    })
    res.status(200).json(answer)
  } catch (error) {
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

// Delete Answer from list
exports.deleteAnswer = catchAsync(async (req, res, next) => {
  const Answer = await AnswerModel.findById(req.params.id)
  await Answer.deleteOne

  res.status(200).json({
    message: "Answer deleted.",
  })
})
//Add Answer in List
exports.createAnswer = catchAsync(async (req, res, next) => {
  const { name, description, score, questionId } = req.body
  const answerCreate = {
    name,
    description,
    question: questionId,
    score,
  }
  try {
    const answer = await Answer.create(answerCreate)
    res.status(200).json(answer)
  } catch (error) {
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

exports.createTenAnswers = async (req, res, next) => {
  for (let i = 0; i < 10; i++) {
    Answer.push({
      name: `Answer${i}`,
      email: `Answer${i}@example.com`,
      role: "Answer",
      sscore: 4,
    })
  }
  // Insert the Answer documents into the database.
  const p = await Answer.insertMany(Answer)
  res.status(200).json({
    success: true,
    p,
  })
  exports.createMultipleAnswers = catchAsync(async (req, res, next) => {
    let answerCreates = []
    const { questionCreates } = req.body
    if (questionCreates) {
      questionCreates.forEach(async (i) => {
        const question = await Question.find(questionCreates[i].name)
        const answerRequests = questionCreates[i].answerRequests
        //answerRequests is array of answer objects
        answerRequests.forEach((j) => {
          j.question = question._id
          answerCreates.push(j)
        })
      })
      Answer.create(answerCreates)
    }
  })
}
