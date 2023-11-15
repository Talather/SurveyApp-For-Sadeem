const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const category = require("../inspireAppModels/categoryistrator")
const http = require("http")
const express = require("express")

exports.findAllcategorys = async function () {
  // Get all categorys from the database and send it to client
  try {
    const categorys = await category.find()
    const totalcategorys = await category.countDocuments()

    console.log("Found around total categorys are :", totalcategorys)
  } catch (error) {
    console.error("Error finding categorys:", error)
  }
}

// Get category Details
exports.getcategoryDetails = catchAsync(async (req, res, next) => {
  const category = await category
    .findOne({
      name: req.body.name,
    })
    .populate({
      path: "categoryistratorSurveys",
    })
  res.status(200).json({
    success: true,
    category,
  })
})

// Get category Details By Id
exports.getcategoryDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const category = await category.findById(id)
  console.log(category)
  res.status(200).json({
    success: true,
    category,
  })
})

//  To Update a category Profile
exports.updatecategoryProfile = catchAsync(async (req, res, next) => {
  const { name, description, email, password } = req.body

  const newDataForcategory = {
    name,
    description,
    email,
    password,
  }
  // const categoryExists = await category.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  const category = await category.findById(req.user._id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  await category.findByIdAndUpdate(req.user._id, newDataForcategory, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  res.status(200).json({
    success: true,
  })
})

// Delete category from list
exports.deletecategory = catchAsync(async (req, res, next) => {
  const category = await category.findById(req.body._id)
  const categoryId = category._id
  // delete post & user images
  await category.deleteOne
  console.log("category deleted successfully")

  res.status(200).json({
    success: true,
    message: "category Deleted",
  })
})
//Add category in List
exports.addcategory = catchAsync(async (req, res, next) => {
  // Gather category's name, email, and description from the request
  const { name, email, password, description } = req.body

  // Create a new category object
  const newcategoryData = {
    name: name,
    email: email,
    description: description,
    password: password,
  }
  const newcategory = await category.create(newcategoryData)
  // newcategory.save((err, user) => {
  //   if (err) {
  //     console.error("Error saving user:", err)
  //     return
  //   }
  console.log("User saved successfully:", newcategory)
  res.status(201).json({
    success: true,
    newcategory,
  })
})

// Super category Search
exports.searchcategory = catchAsync(async (req, res, next) => {
  const keyword = decodeURIComponent(req.query.keyword)
  if (keyword) {
    const users = await category.find({
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
    })

    res.status(200).json({
      success: true,
      users,
    })
  }
})

exports.paginationPerPage = catchAsync(async (req, res, next) => {
  // const currentPage = Number(req.query.page) || 1
  const currentPage = 1
  const totalcategorys = await category.countDocuments()
  const skip = (currentPage - 1) * 10
  var limit = 10
  const listOfcategorysPerPage = await category.find().skip(skip).limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfcategorysPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  console.log(listOfcategorysPerPage)
  res.status(200).json({
    success: true,
    listOfcategorysPerPage,
  })

  return {
    listOfcategorysPerPage,
    totalcategorys,
    currentPage,
    totalPages: Math.ceil(totalcategorys / limit),
  }
})
exports.createTencategorys = async (req, res, next) => {
  // Create an array of 10 category documents.
  const categorys = []
  for (let i = 0; i < 10; i++) {
    categorys.push({
      name: `category ${i}`,
      email: `category${i}@example.com`,
      role: "category",
    })
  }

  // Insert the category documents into the database.
  await category.insertMany(categorys)
}
// createTencategorys()
console.log("done")
