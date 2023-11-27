const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Survey = require("./../Models/survey");
const http = require("http");
const Question = require("./../Models/question");
const Answer = require("./../Models/answer");
const val = require("ajv");
const SurveyModel = require("./../Models/survey");

// create survey
exports.createSurvey = catchAsync(async (req, res, next) => {
  const { Name, description, questions, adminId } = req.body;
  const surveyExist = await Survey.findOne({ name });

  if (surveyExist) {
    return next(new ErrorHandler("Survey Already Placed", 400));
  }
});

let newSurvey = await Survey.create({
  name: Name,
  description: description,
  createdBy: adminId,
});
await Survey.populate("createdBy");
console.log(survey);
for (let question of questions) {
  let newQuestion = await Question.create({
    name: question.name,
    description: question.description,
    survey: newSurvey._id,
  });
}
for (let answer of question.answers) {
  let answerId = await Answer.create({
    name: answer.name,
    description: answer.description,
    score: answer.score,
    question: newQuestion._id,
  });
}

// this data should come from frontend
// survey name : "Survey for animals"
// description : "How should Animals Survive ? "
// questions : [{ name : "question1" , description : "" , answers: [] }]
// answers : [{name : "answer1" ,  description : "", score: 1}]

//   let questionIds = [];

//   for (let question of questions) {
//     let answerIds = [];

//     for (let answer of question.answers) {
//       let answerId = await Answer.create({
//         name: answer.name,
//         description: answer.description,
//         score: answer.score,
//       });
//       answerIds.push(answerId.id);
//     }

//     let questionId = await Question.create({
//       name: question.name,
//       description: question.description,
//       questionAnswers: answerIds,
//     });
//     questionIds.push(questionId.id);
//   }

//   let survey = await Survey.create({
//     name: name,
//     description: description,
//     surveyQuestions: questionIds,
//   });
//   console.log(survey);

//   res.status(200).json({
//     success: true,
//     message: "Survey created Successfully",
//     survey,
//   });
// });

exports.deleteSurvey = catchAsync(async (req, res, next) => {
  const survey = await Survey.findById(req.params.id);
  await survey.deleteOne;
  console.log("survey deleted successfully");

  res.status(200).json({
    message: "survey deleted.",
  });
});

//  To Update a Survey Profile
exports.updateSurvey = catchAsync(async (req, res, next) => {
  const { name, description, AdminId } = req.body;

  const SurveyUpdate = {
    name,
    description,
    creayedBy: AdminId,
  };
  // const Survey = await Survey.findById(req.params.id);
  const Survey = await SurveyModel.findByIdAndUpdate(
    req.params.id,
    SurveyUpdate,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  res.status(200).json(Survey);
});

exports.getAllSurveys = catchAsync(async (req, res, next) => {
  let currentPage = 1;
  let pageSize = 10;
  let searchKeyword = "";

  if (req.body.currentPage) {
    currentPage = req.body.currentPage;
  }

  if (req.body.pageSize) {
    pageSize = req.body.pageSize;
  } else if (pageSize === -1) {
    pageSize = 0;
  }

  const skip = (currentPage - 1) * pageSize;

  let list = [];
  let totalRecords = 0;

  if (req.body.searchKeyword) {
    let filter = {
      name: {
        $regex: searchKeyword,
        $options: "i",
      },
    };
    searchKeyword = req.body.searchKeyword;
    list = await Survey.find(filter).skip(skip).limit(pageSize);
    totalRecords = await Survey.countDocuments(filter);
  } else {
    console.log("all Surveys");
    list = await Survey.find().skip(skip).limit(pageSize);
    totalRecords = await Survey.countDocuments();
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  });
});

// Get Survey Details By Id
exports.getSurveyById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const Survey = await SurveyModel.findById(id);
  console.log(Survey);
  res.status(200).json(Survey);
});
