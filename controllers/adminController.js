const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Admin = require("../inspireAppModels/administrator")
const http = require("http")
const express = require("express")

exports.findAllAdmins = async function () {
  // Get all admins from the database and send it to client
  try {
    const admins = await Admin.find()
    const totalAdmins = await Admin.countDocuments()

    console.log("Found around :", totalAdmins, admins)
  } catch (error) {
    console.error("Error finding admins:", error)
  }
}

// Get Admin Details
exports.getAdminDetails = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({
    name: req.body.name,
  }).populate({
    path: "administratorSurveys",
  })
  res.status(200).json({
    success: true,
    admin,
  })
})

// Get Admin Details By Id
exports.getAdminDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const admin = await Admin.findById(id)
  console.log(admin)
  res.status(200).json({
    success: true,
    admin,
  })
})

//  To Update a Admin Profile
exports.updateAdminProfile = catchAsync(async (req, res, next) => {
  const { name, description, email, password } = req.body

  const newDataForAdmin = {
    name,
    description,
    email,
    password,
  }
  // const adminExists = await Admin.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  const admin = await Admin.findById(req.user._id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  await admin.findByIdAndUpdate(req.user._id, newDataForAdmin, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  res.status(200).json({
    success: true,
  })
})

// Delete Admin from list
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.body._id)
  const adminId = admin._id
  // delete post & user images
  await admin.deleteOne
  console.log("admin deleted successfully")

  res.status(200).json({
    success: true,
    message: "Admin Deleted",
  })
})
//Add Admin in List
exports.addAdmin = catchAsync(async (req, res, next) => {
  // Gather admin's name, email, and description from the request
  const { name, email, password, description } = req.body

  // Create a new admin object
  const newAdminData = {
    name: name,
    email: email,
    description: description,
    password: password,
  }
  const newAdmin = await Admin.create(newAdminData)
  // newAdmin.save((err, user) => {
  //   if (err) {
  //     console.error("Error saving user:", err)
  //     return
  //   }
  console.log("User saved successfully:", newAdmin)
  res.status(201).json({
    success: true,
    newAdmin,
  })
})

// Super Admin Search
exports.searchAdmin = catchAsync(async (req, res, next) => {
  const keyword = decodeURIComponent(req.query.keyword)
  if (keyword) {
    const users = await Admin.find({
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
  const totalAdmins = await Admin.countDocuments()
  const skip = (currentPage - 1) * 10
  var limit = 10
  const listOfAdminsPerPage = await Admin.find().skip(skip).limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfAdminsPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  res.status(200).json({
    success: true,
    listOfAdminsPerPage,
  })

  return {
    listOfAdminsPerPage,
    totalAdmins,
    currentPage,
    totalPages: Math.ceil(totalAdmins / limit),
  }
})
exports.createTenAdmins = async (req, res, next) => {
  // Create an array of 10 admin documents.
  const admins = []
  for (let i = 0; i < 10; i++) {
    admins.push({
      name: `Admin ${i}`,
      email: `admin${i}@example.com`,
      role: "admin",
    })
  }

  // Insert the admin documents into the database.
  await Admin.insertMany(admins)
}
// createTenAdmins()
console.log("done")
