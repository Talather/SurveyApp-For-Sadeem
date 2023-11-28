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
  const { name, adminId, description } = req.body;
  const surveyExist = await Survey.findOne({ name: name });

  if (surveyExist) {
    return next(new ErrorHandler("Survey Already Placed", 400));
  }
  try {
    const newSurvey = await Survey.create({
      name: name,
      description: description,
      createdBy: adminId,
    });
    // await Survey.populate("createdBy");
    console.log(newSurvey);
    const { questions } = req.body;
    // console.log(questions);
    for (const i of questions) {
      // console.log(i);
      // console.log(newSurvey._id);
      let newQuestion = await new Question({
        name: i.name,
        description: i.description,
        survey: newSurvey._id,
      });
      // console.log(newQuestion);
      newQuestion.save();
      for (const a of i.answers) {
        // console.log(i);
        // console.log(newSurvey._id);
        let newAnswer = await new Answer({
          name: a.name,
          description: a.description,
          score: a.score,
          question: newQuestion._id,
        });
        // console.log(newAnswer);
        newAnswer.save();
      }
    }
    res
      .status(200)
      .json({ success: true, message: "survey created Successfully" });
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});
// this data should come from frontend
// survey name : "Survey for animals"
// description : "How should Animals Survive ? "
// questions : [{ name : "question1" , description : "" , answers: [] }]
// answers : [{name : "answer1" ,  description : "", score: 1}]

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
  try {
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
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
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
exports.createTenSurveys = async (req, res, next) => {
  const Surveys = [];
  for (let i = 0; i < 10; i++) {
    Surveys.push({
      name: "Survey 7",
      email: `Survey${i}@example.com`,
      role: "Survey",
    });
  }
  // Insert the Survey documents into the database.
  const p = await Survey.insertMany(Surveys);
  res.status(200).json({
    success: true,
    p,
  });
};
