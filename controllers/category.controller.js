const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const category = require("../inspireAppModels/category");
const http = require("http");
const express = require("express");
const categoryModel = require("../inspireAppModels/category");
const QuestionSchema = require("../inspireAppModels/question");

exports.findAllCategorys = catchAsync(async (req, res, next) => {
  // Get all categorys from the database and send it to client
  let currentPage = 1;
  let pageSize = 10;
  let searchKeyword = "";
  if (req.body.currentPage) {
    currentPage = req.body.currentPage;
    if (req.body.pageSize) {
      pageSize = req.body.pageSize;
      if (req.body.searchKeyword) {
        searchKeyword = req.body.searchKeyword;
        const skip = (currentPage - 1) * pageSize;
        const searchedCategory = await category
          .aggregate([
            {
              $lookup: {
                from: "topics",
                localField: "topic",
                foreignField: "_id",
                as: "topic",
              },
            },
            {
              $match: {
                $or: [
                  {
                    "topic.name": {
                      $regex: keyword,
                      $options: "i",
                    },
                  },
                  {
                    name: {
                      $regex: keyword,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ])
          .skip(skip)
          .limit(pageSize);
        const totalsearchedCategory = await category.countDocuments({
          name: {
            $regex: searchKeyword,
            $options: "i",
          },
        });
        res.status(200).json({
          success: true,
          searchedCategory,
          totalsearchedCategory,
        });
      } else {
        console.log("all Categorys");
        const skip = (currentPage - 1) * pageSize;
        const list = await category.find().skip(skip).limit(pageSize);
        const totalCategory = await category.countDocuments();
        res.status(200).json({
          success: true,
          list,
          totalCategory,
        });
      }
    }
  } else {
    res.status(404).json({
      error: "404",
    });
  }
});

// Get category Details By Id
exports.getCategoryById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const category = await categoryModel.findById(id);
  console.log(category);
  res.status(200).json({
    success: true,
    category,
  });
});

//  To Update a category Profile
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, description, topicId } = req.body;

  const newDataForcategory = {
    name: name,
    description: description,
    topic: topicId,
  };
  const updatedDoc = await categoryModel.findByIdAndUpdate(
    req.body.id,
    newDataForcategory,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  newDoc.populate("topic");
  res.status(200).json({
    success: true,
    updatedDoc,
  });
});

// Delete category from list
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (category) {
    console.log("category found successfully");
  } else console.log("category  not found ");

  await category.deleteOne;
  console.log("category deleted successfully");

  res.status(200).json({
    success: true,
    message: "category Deleted successfully",
  });
});
//Add category in List
exports.createCategory = catchAsync(async (req, res, next) => {
  // Gather category's name, email, and description from the request,we shoukd include topic.category document _id in request
  const { name, description, TopicId } = req.body;

  // Create a new category object
  const newCategoryData = {
    name: name,
    description: description,
    topic: TopicId,
  };
  const newcategory = await category.create(newCategoryData);
  await newcategory.populate("topic");
  //save question ids reference in the categoryasync function getQuestionsByCategoryId(categoryId) {
  //   try {
  //     const questions = await QuestionSchema.find({ category: newcategory._id }).exec();

  //     const questionIds = questions.map(question => question._id);
  //     console.log(questionIds)
  //
  //     // newcategory.categoryQuestions.push(questionIds);
  // console.log("subcategory saved successfully:", newcategory)
  //     // return questionIds;
  //   } catch (error) {
  //     console.error('Error fetching questions by category ID:', error.message);
  //     throw error;
  //   }
  // newcategory.categoryQuestions.push(questionIds);
  // console.log("subcategory saved successfully:", newcategory)
  res.status(201).json({
    success: true,
    newcategory,
  });
});

//function for category Search
exports.searchCategory = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;
  if (keyword) {
    const categories = await category.aggregate([
      {
        $lookup: {
          from: "topics",
          localField: "topic",
          foreignField: "_id",
          as: "topic",
        },
      },
      {
        $match: {
          $or: [
            {
              "topic.name": {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              name: {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  }
});

exports.createTenCategorys = async (req, res, next) => {
  // Create an array of 10 category documents.
  const categorys = [];
  for (let i = 0; i < 10; i++) {
    categorys.push({
      name: `category ${i}`,
      email: `category${i}@example.com`,
      role: "category",
    });
  }

  // Insert the category documents into the database.
  const insertedCats = await category.insertMany(categorys);
  console.log(insertedCats);
};
// createTencategorys()
console.log("done");
