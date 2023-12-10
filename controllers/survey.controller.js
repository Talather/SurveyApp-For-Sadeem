const catchAsync = require("../middleware/catchAsync")
const ErrorHandler = require("../utils/errorHandler")
const Survey = require("./../Models/survey")
const Question = require("./../Models/question")
const Answer = require("./../Models/answer")
const SurveyModel = require("./../Models/survey")
const questionController = require("./question.controller")

//function to create survey
exports.createSurvey = catchAsync(async (req, res, next) => {
  const { name, description, createdById, questionRequests } = req.body
  const surveyExist = await Survey.findOne({ name: name })

  if (surveyExist) {
    return next(new ErrorHandler("Survey Already Placed", 400))
  }

  try {
    const survey = await Survey.create({
      name: name,
      description: description,
      createdBy: createdById,
    })
    // await survey.populate("createdBy")

    if (questionRequests) {
      // console.log(questionRequests);
      for (const qr of questionRequests) {
        var question = await questionController.createQuestionInDatabase({
          ...qr,
          surveyId: survey._id,
        })
        // console.log( count, question);
        if (qr.answerRequests) {
          for (const ar of qr.answerRequests) {
            // console.log(ar);
            // const answer = await answerController.createAnswerInDatabase({
            //   ar,
            //   question: question._id,
            // });
            // console.log(answer);
          }
        }
      }
    }
    res.status(201).json({
      success: true,
      message: "survey created succesfully",
      survey: survey,
    })
  } catch (error) {
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})
//function to Delete a survey
exports.deleteSurvey = catchAsync(async (req, res, next) => {
  const survey = await Survey.findById(req.params.id)
  await survey.deleteOne
  console.log("survey deleted successfully")

  res.status(200).json({
    message: "survey deleted.",
  })
})

//function to Update a Survey Profile
exports.updateSurvey = catchAsync(async (req, res, next) => {
  const { id, name, description, createById, questionRequests } = req.body
  const { questions } = req.body

  if (surveyId) {
    const SurveyUpdate = {
      name: name,
      description: description,
      createdBy: adminId,
    }
    try {
      const Survey = await SurveyModel.findByIdAndUpdate(
        req.body.surveyId,
        SurveyUpdate,
        {
          new: true,
          runValidators: true,
          useFindAndModify: true,
        }
      )
      res.status(200).json(Survey)
    } catch (error) {
      console.error(error)
      res.status(201).json({
        success: false,
        error,
      })
    }
  }

  const filteredQuestionsById = questions.filter((question) =>
    question.hasOwnProperty("id")
  )
  const filteredQuestionsNoId = questions.filter(
    (question) => !question.hasOwnProperty("id")
  )

  //to update the questions with "id" property
  if (filteredQuestionsById) {
    try {
      for (let i in filteredQuestionsById) {
        const questionUpdate = {
          name: i.name,
          description: i.description,
        }
        const updatedQuestion = await Question.findByIdAndUpdate(
          i.id,
          questionUpdate,
          {
            new: true,
            runValidators: true,
            useFindAndModify: true,
          }
        )
        res.status(200)
        // res.json({ message: "questions updated successfully", success: true });
      }
    } catch (error) {
      console.error(error)
      res.status(201).json({
        success: false,
        error,
      })
    }
  }
  //to create the questions with no "id" property
  if (filteredQuestionsNoId) {
    for (const i of filteredQuestionsNoId) {
      // let newQuestion = await new Question({
      //   name: i.name,
      //   description: i.description,
      //   survey: surveyId,
      // });
      // newQuestion.save();

      let newQuestion = questionController.createQuestion
    }
  }
  //to iterate over question array to get answer array from each question object
  for (let i in questions) {
    let answers = questions[i].answers
    console.log(answers)
    var filteredAnswersById = answers.filter((a) => a.hasOwnProperty("id"))
    var filteredAnswersNoId = answers.filter((a) => !a.hasOwnProperty("id"))
  }
  //to update answers with "id" property
  if (filteredAnswersById) {
    for (let y in filteredAnswersById) {
      const answersUpdate = {
        name: y.name,
        description: y.description,
        score: y.score,
      }
      const updatedAnswer = await Answer.findByIdAndUpdate(
        y.id,
        answersUpdate,
        {
          new: true,
          runValidators: true,
          useFindAndModify: true,
        }
      )
      res.status(200).json({
        message: "answers updated successfully",
        sucess: true,
        updatedAnswer,
      })
    }
  }
  //to create documents with no "Id property"
  if (filteredAnswersNoId) {
    for (let a in filteredAnswersNoId) {
      let newAnswer = await new Answer({
        name: a.name,
        description: a.description,
        score: a.score,
        question: i.id,
      })
      newAnswer.save()
    }
  }
})

//function to get all surveys with search and pagination
exports.getAllSurveys = catchAsync(async (req, res, next) => {
  let currentPage = 1
  let pageSize = 10
  let searchKeyword = ""

  if (req.body.currentPage) {
    currentPage = req.body.currentPage
  }
  if (req.body.adminId) {
    adminId = req.body.adminId
  }

  if (req.body.pageSize) {
    pageSize = req.body.pageSize
  } else if (pageSize === -1) {
    pageSize = 0
  }
  if (req.body.searchKeyword) {
    searchKeyword = req.body.searchKeyword
  }

  const count = {
    $count: "totalRecords",
  }

  const limit = {
    $limit: pageSize,
  }

  const lookup = {
    $lookup: {
      from: "admins",
      localField: "createdBy",
      foreignField: "_id",
      as: "admin",
    },
  }

  const match = {
    $match: {},
  }

  const skip = {
    $skip: (currentPage - 1) * pageSize,
  }

  if (searchKeyword) {
    match.$match.$or = [
      {
        "admin.firstName": {
          $regex: searchKeyword,
          $options: "i",
        },
      },
      {
        name: {
          $regex: searchKeyword,
          $options: "i",
        },
      },
    ]
  }

  const filter = [lookup, match, skip, limit]

  const list = await Survey.aggregate(filter)
  let totalRecords = 0
  const countResult = await Survey.aggregate([lookup, match, count])
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

// function to get Survey Details By Id
exports.getSurveyById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Survey = await SurveyModel.findById(id)
  // console.log(Survey);
  // res.status(200).json(Survey);
  const question = await questionController.getAllQuestions(req, res, next)
  // console.log(question);

  res.status(200).json({ survey: Survey, questions: question })
})
exports.createTenSurveys = async (req, res, next) => {
  const Surveys = []
  for (let i = 0; i < 10; i++) {
    Surveys.push({
      name: "Survey 7",
      email: `Survey${i}@example.com`,
      role: "Survey",
    })
  }
  const p = await Survey.insertMany(Surveys)
  res.status(200).json({
    success: true,
    p,
  })
}
