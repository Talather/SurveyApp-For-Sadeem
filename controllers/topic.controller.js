const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Topic = require("../Models/topic");
const http = require("http");
const express = require("express");

exports.getAllTopics = catchAsync(async (req, res, next) => {
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

  if (req.body.searchKeyword) {
    searchKeyword = req.body.searchKeyword;
  }

  const count = {
    $count: "totalRecords",
  };

  const limit = {
    $limit: pageSize,
  };

  const match = {
    $match: {},
  };

  const skip = {
    $skip: (currentPage - 1) * pageSize,
  };

  if (searchKeyword) {
    match.$match = {
      name: {
        $regex: searchKeyword,
        $options: "i",
      },
    };
  }

  const filter = [match, skip, limit];

  const list = await Topic.aggregate(filter);
  let totalRecords = 0;
  const countResult = await Topic.aggregate([match, count]);
  console.log(countResult);

  if (countResult[0]) {
    totalRecords = countResult[0].totalRecords;
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  });
});

// Get Topic Details By Id
exports.getTopicById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const topic = await Topic.findById(id);
  console.log(topic);
  res.status(200).json(topic);
});

//  To Update a Topic Profile
exports.updateTopic = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  const topicUpdate = {
    name,
    description,
  };
  try {
    const topic = await Topic.findByIdAndUpdate(req.body.id, topicUpdate, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });
    res.status(200).json(topic);
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});

// Delete Topic from list
exports.deleteTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findById(req.params.id);
  await topic.deleteOne;
  console.log("Topic deleted successfully");

  res.status(200).json({
    message: "Topic deleted.",
  });
});
//Add Topic in List
exports.createTopic = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const topicCreate = {
    name: name,
    description: description,
  };
  try {
    const topic = await Topic.create(topicCreate);

    console.log("topic saved successfully:", topic);
    res.status(200).json(topic);
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});

exports.createTenTopics = async (req, res, next) => {
  const Topics = [];
  for (let i = 0; i < 10; i++) {
    Topics.push({
      name: "Topic 7",
      email: `Topic${i}@example.com`,
      role: "Topic",
    });
  }
  // Insert the Topic documents into the database.
  const p = await Topic.insertMany(Topics);
  res.status(200).json({
    success: true,
    p,
  });
};
