const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Category = require("../inspireAppModels/Category")
const http = require("http")
const express = require("express")
const categoryModel = require("../inspireAppModels/Category")

exports.getAllCategorys = catchAsync(async (req, res, next) => {
  let currentPage = 1
  let pageSize = 10
  let searchKeyword = ""

  if (req.body.currentPage) {
    currentPage = req.body.currentPage
  }

  if (req.body.pageSize) {
    pageSize = req.body.pageSize
  } else if (pageSize === -1) {
    pageSize = 0
  }

  const skip = (currentPage - 1) * pageSize

  let list = []
  let totalRecords = 0

  if (req.body.searchKeyword) {
    searchKeyword = req.body.searchKeyword
    list = await Category.aggregate([
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
      .limit(pageSize)
    totalRecords = await Category.countDocuments(
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
      }
    )
  } else {
    console.log("all Categorys")
    list = await Category.find().skip(skip).limit(pageSize)
    totalRecords = await Category.countDocuments()
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  })
})

// Get Category Details By Id
exports.getCategoryById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Category = await categoryModel.findById(id)
  console.log(Category)
  res.status(200).json(Category)
})

//  To Update a Category Profile
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body

  const CategoryUpdate = {
    name,
    description,
  }
  // const Category = await Category.findById(req.params.id);
  const Category = await categoryModel.findByIdAndUpdate(
    req.body.id,
    CategoryUpdate,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  )
  res.status(200).json(Category)
})

// Delete Category from list
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const Category = await categoryModel.findById(req.params.id)
  await Category.deleteOne
  console.log("Category deleted successfully")

  res.status(200).json({
    message: "Category deleted.",
  })
})
//Add Category in List
exports.createCategory = catchAsync(async (req, res, next) => {
  // Gather Category's name, email, and description from the request
  const { name, description } = req.body

  // Create a new Category object
  const CategoryCreate = {
    name: name,
    description: description,
  }
  const Category = await categoryModel.create(CategoryCreate)

  console.log("Category saved successfully:", Category)
  res.status(200).json(Category)
})

exports.createTenCategorys = async (req, res, next) => {
  // Create an array of 10 Category documents.
  const Categorys = []
  for (let i = 0; i < 10; i++) {
    Categorys.push({
      name: "Category 7",
      email: `Category${i}@example.com`,
      role: "Category",
    })
  }
  // Insert the Category documents into the database.
  const p = await Category.insertMany(Categorys)
  res.status(200).json({
    success: true,
    p,
  })
  // createTenCategorys()
  console.log("done")
}
