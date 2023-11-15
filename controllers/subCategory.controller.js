const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const subCategory = require("../inspireAppModels/subCategoryistrator")
const http = require("http")
const express = require("express")

exports.findAllsubCategorys = async function () {
  // Get all subCategorys from the database and send it to client
  try {
    const subCategorys = await subCategory.find()
    const totalsubCategorys = await subCategory.countDocuments()

    console.log("Found around total subCategorys are :", totalsubCategorys)
  } catch (error) {
    console.error("Error finding subCategorys:", error)
  }
}

// Get subCategory Details
exports.getsubCategoryDetails = catchAsync(async (req, res, next) => {
  const subCategory = await subCategory
    .findOne({
      name: req.body.name,
    })
    .populate({
      path: "subCategoryistratorSurveys",
    })
  res.status(200).json({
    success: true,
    subCategory,
  })
})

// Get subCategory Details By Id
exports.getsubCategoryDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const subCategory = await subCategory.findById(id)
  console.log(subCategory)
  res.status(200).json({
    success: true,
    subCategory,
  })
})

//  To Update a subCategory Profile
exports.updatesubCategoryProfile = catchAsync(async (req, res, next) => {
  const { name, description, email, password } = req.body

  const newDataForsubCategory = {
    name,
    description,
    email,
    password,
  }
  // const subCategoryExists = await subCategory.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  const subCategory = await subCategory.findById(req.user._id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  await subCategory.findByIdAndUpdate(req.user._id, newDataForsubCategory, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  res.status(200).json({
    success: true,
  })
})

// Delete subCategory from list
exports.deletesubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await subCategory.findById(req.body._id)
  const subCategoryId = subCategory._id
  // delete post & user images
  await subCategory.deleteOne
  console.log("subCategory deleted successfully")

  res.status(200).json({
    success: true,
    message: "subCategory Deleted",
  })
})
//Add subCategory in List
exports.addsubCategory = catchAsync(async (req, res, next) => {
  // Gather subCategory's name, email, and description from the request
  const { name, email, password, description } = req.body

  // Create a new subCategory object
  const newsubCategoryData = {
    name: name,
    email: email,
    description: description,
    password: password,
  }
  const newsubCategory = await subCategory.create(newsubCategoryData)
  // newsubCategory.save((err, user) => {
  //   if (err) {
  //     console.error("Error saving user:", err)
  //     return
  //   }
  console.log("User saved successfully:", newsubCategory)
  res.status(201).json({
    success: true,
    newsubCategory,
  })
})

// Super subCategory Search
exports.searchsubCategory = catchAsync(async (req, res, next) => {
  const keyword = decodeURIComponent(req.query.keyword)
  if (keyword) {
    const users = await subCategory.find({
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
  const totalsubCategorys = await subCategory.countDocuments()
  const skip = (currentPage - 1) * 10
  var limit = 10
  const listOfsubCategorysPerPage = await subCategory
    .find()
    .skip(skip)
    .limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfsubCategorysPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  console.log(listOfsubCategorysPerPage)
  res.status(200).json({
    success: true,
    listOfsubCategorysPerPage,
  })

  return {
    listOfsubCategorysPerPage,
    totalsubCategorys,
    currentPage,
    totalPages: Math.ceil(totalsubCategorys / limit),
  }
})
exports.createTensubCategorys = async (req, res, next) => {
  // Create an array of 10 subCategory documents.
  const subCategorys = []
  for (let i = 0; i < 10; i++) {
    subCategorys.push({
      name: `subCategory ${i}`,
      email: `subCategory${i}@example.com`,
      role: "subCategory",
    })
  }

  // Insert the subCategory documents into the database.
  await subCategory.insertMany(subCategorys)
}
// createTensubCategorys()
console.log("done")
