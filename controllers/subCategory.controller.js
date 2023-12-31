const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Subcategory = require("../Models/subcategory")
const http = require("http")
const express = require("express")
const subCategoryModel = require("../Models/subcategory")

exports.getAllSubcategories = catchAsync(async (req, res, next) => {
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
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
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
        "category.name": {
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

  const list = await Subcategory.aggregate(filter)
  let totalRecords = 0
  const countResult = await Subcategory.aggregate([lookup, match, count])
  console.log(countResult)

  if (countResult[0]) {
    totalRecords = countResult[0].totalRecords
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  })
})
// Get Subcategory Details By Id
exports.getSubcategoryById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Subcategory = await subCategoryModel.findById(id)
  console.log(Subcategory)
  res.status(200).json(Subcategory)
})

//  To Update a Subcategory Profile
exports.updateSubcategory = catchAsync(async (req, res, next) => {
  const { name, description, categoryId } = req.body

  const SubcategoryUpdate = {
    name: name,
    description: description,
    category: categoryId,
  }
  try {
    const Subcategory = await subCategoryModel.findByIdAndUpdate(
      req.body.id,
      SubcategoryUpdate,
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    )
    res.status(200).json(Subcategory)
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

// Delete Subcategory from list
exports.deleteSubcategory = catchAsync(async (req, res, next) => {
  const Subcategory = await subCategoryModel.findById(req.params.id)
  await Subcategory.deleteOne
  console.log("Subcategory deleted successfully")
  res.status(200).json({
    message: "Subcategory deleted.",
  })
})
//Add Subcategory in List
exports.createSubcategory = catchAsync(async (req, res, next) => {
  const { name, description, categoryId } = req.body
  const SubcategoryCreate = {
    name: name,
    description: description,
    category: categoryId,
  }
  try {
    const Subcategory = await subCategoryModel.create(SubcategoryCreate)
    console.log("Subcategory saved successfully:", Subcategory)
    res.status(200).json(Subcategory)
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

exports.createTenCategories = async (req, res, next) => {
  // Create an array of 10 Subcategory documents.
  const Categories = []
  for (let i = 0; i < 10; i++) {
    Categories.push({
      name: "Subcategory 7",
      email: `Subcategory${i}@example.com`,
      role: "Subcategory",
    })
  }
  // Insert the Subcategory documents into the database.
  const p = await Subcategory.insertMany(Categories)
  res.status(200).json({
    success: true,
    p,
  })
  // createTenCategories()
  console.log("done")
}
