const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Subcategory = require("../inspireAppModels/subcategory")
const http = require("http")
const express = require("express")
const subCategoryModel = require("../inspireAppModels/subcategory")

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

  const skip = (currentPage - 1) * pageSize

  let list = []
  let totalRecords = 0

  if (req.body.searchKeyword) {
    searchKeyword = req.body.searchKeyword
    list = await Subcategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $match: {
          $or: [
            {
              "category.name": {
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
    totalRecords = await Subcategory.countDocuments()
  } else {
    console.log("all Subcategories")
    list = await Subcategory.find().skip(skip).limit(pageSize)
    totalRecords = await Subcategory.countDocuments(
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $match: {
          $or: [
            {
              "category.name": {
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
  // Gather Subcategory's name, email, and description from the request
  const { name, description } = req.body

  // Create a new Subcategory object
  const SubcategoryCreate = {
    name: name,
    description: description,
  }
  const Subcategory = await subCategoryModel.create(SubcategoryCreate)

  console.log("Subcategory saved successfully:", Subcategory)
  res.status(200).json(Subcategory)
})

exports.createTenSubcategories = async (req, res, next) => {
  // Create an array of 10 Subcategory documents.
  const Subcategories = []
  for (let i = 0; i < 10; i++) {
    Subcategories.push({
      name: "Subcategory 7",
      email: `Subcategory${i}@example.com`,
      role: "Subcategory",
    })
  }
  // Insert the Subcategory documents into the database.
  const p = await Subcategory.insertMany(Subcategories)
  res.status(200).json({
    success: true,
    p,
  })
  // createTenSubcategories()
  console.log("done")
}
