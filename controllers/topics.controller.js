const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Topic = require("../inspireAppModels/topic");
const http = require("http");
const express = require("express");
const topicModel = require("../inspireAppModels/topic");

exports.findAllTopics = catchAsync(async (req, res, next) => {
  // Get all Topics from the database and send it to client
  try {
    const topic = await Topic.find();
    console.log("topic collection connected");
    const totaltopics = await Topic.countDocuments();
   

    console.log("Found around :", totaltopics);
    res.status(200).json({
      success: true,
      topic,
      totaltopics
    })

  } catch (error) {
    console.error("Error finding Topics:", error);
  }
})


// Get Topic Details
exports.getTopicDetails = catchAsync(async (req, res, next) => {
  const Topic = await topicModel
    .findOne({
      name: req.body.name,
    })
    // .populate({
    //   path: "topicCategories",
    // })
    // .populate({ path: "topicQuestions" });
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
  const { name, description } = req.body;

  const newDataForTopic = {
    name,
    description,
  };  
  // const Topic = await Topic.findById(req.params.id); 
  const newDoc=await topicModel.findByIdAndUpdate(req.params.id, newDataForTopic, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    newDoc
  });
});

// Delete Topic from list
exports.deleteTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findById(req.body._id);
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
    description: description,
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
  const keyword = decodeURIComponent(req.params.keyword);
  if (keyword) {
    const topics = await Topic.find({
          //  name:keyword,
          name: {
            $regex: keyword,
            $options: "i",
          }, 
    });

    res.status(200).json({
      success: true,
      topics,
    });
  }
});

exports.paginationPerPage = catchAsync(async (req, res, next) => {
  const currentPage = req.params.page || 1
  const limit =req.body.limit
  const totalTopics = await Topic.countDocuments();
  const skip = (currentPage - 1) * limit;
  
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