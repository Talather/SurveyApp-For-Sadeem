const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Topic = require("../inspireAppModels/topic");
const http = require("http");
const express = require("express");
const topicModel = require("../inspireAppModels/topic");

exports.findAllTopics = async function () {
  // Get all Topics from the database and send it to client
  try {
    const topic = await Topic.find();
    console.log("topic collection connected");
    const totaltopics = await Topic.countDocuments();
    console.log("topic documents counted");

    console.log("Found around :", totaltopics, topic);
  } catch (error) {
    console.error("Error finding Topics:", error);
  }
};

// Get Topic Details
exports.getTopicDetails = catchAsync(async (req, res, next) => {
  const Topic = await topicModel
    .findOne({
      name: req.body.name,
    })
    .populate({
      path: "topicCategories",
    })
    .populate({ path: "topicQuestions" });
  res.status(200).json({
    success: true,
    Topic,
  });
});

// Get Topic Details By Id
exports.getTopicDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const Topic = await topicModel.findById(id);
  console.log(Topic);
  res.status(200).json({
    success: true,
    Topic,
  });
});

//  To Update a Topic Profile
exports.updateTopicProfile = catchAsync(async (req, res, next) => {
  const { name, description, email, password } = req.body;

  const newDataForTopic = {
    name,
    description,
  };
  // const TopicExists = await Topic.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  const Topic = await Topic.findById(req.user._id); //To fetch through id we have to send complete document along with id,so that this id could be used further
  await Topic.findByIdAndUpdate(req.user._id, newDataForTopic, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
  });
});

// Delete Topic from list
exports.deleteTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findById(req.body._id);
  const TopicId = Topic._id;
  // delete post & user images
  await topic.deleteOne;
  console.log("Topic deleted successfully");

  res.status(200).json({
    success: true,
    message: "Topic Deleted",
  });
});
//Add Topic in List
exports.addTopic = catchAsync(async (req, res, next) => {
  // Gather Topic's name, email, and description from the request
  const { name, description } = req.body;

  // Create a new Topic object
  const newTopicData = {
    name: name,
    email: email,
  };
  const newTopic = await Topic.create(newTopicData);

  console.log("topic saved successfully:", newTopic);
  res.status(201).json({
    success: true,
    newTopic,
  });
});

// Super Topic Search
exports.searchTopic = catchAsync(async (req, res, next) => {
  const keyword = decodeURIComponent(req.query.keyword);
  if (keyword) {
    const users = await Topic.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  }
});

exports.paginationPerPage = catchAsync(async (req, res, next) => {
  // const currentPage = Number(req.query.page) || 1
  const currentPage = 1;
  const totalTopics = await Topic.countDocuments();
  const skip = (currentPage - 1) * 10;
  var limit = 10;
  const listOfTopicsPerPage = await Topic.find().skip(skip).limit(limit);
  if (res) {
    res.status(200).json({
      success: true,
      listOfTopicsPerPage,
    });
  } else {
    console.log("Response object is undefined");
    // Handle the error or return an error response
  }
  res.status(200).json({
    success: true,
    listOfTopicsPerPage,
  });

  return {
    listOfTopicsPerPage,
    totalTopics,
    currentPage,
    totalPages: Math.ceil(totalTopics / limit),
  };
});
exports.createTenTopics = async (req, res, next) => {
  // Create an array of 10 Topic documents.
  const Topics = [];
  for (let i = 0; i < 10; i++) {
    Topics.push({
      name: `Topic ${i}`,
      email: `Topic${i}@example.com`,
      role: "Topic",
    });
  }

  // Insert the Topic documents into the database.
  await Topic.insertMany(Topics);

// createTenTopics()
console.log("done");
};