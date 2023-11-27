const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Admin = require("../inspireAppModels/Administrator")
const http = require("http")
const express = require("express")
const AdminModel = require("../inspireAppModels/Administrator")

exports.getAllAdmins = catchAsync(async (req, res, next) => {
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
    list = await Admin.find({
      $or: [
        {
          firstName: {
            $regex: searchKeyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchKeyword,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: searchKeyword,
            $options: "i",
          },
        },
      ],
    })
      .skip(skip)
      .limit(pageSize)
    totalRecords = await Admin.countDocuments({
      $or: [
        {
          firstName: {
            $regex: searchKeyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchKeyword,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: searchKeyword,
            $options: "i",
          },
        },
      ],
    })
  } else {
    console.log("all Admins")
    list = await Admin.find().skip(skip).limit(pageSize)
    totalRecords = await Admin.countDocuments()
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  })
})

// Get Admin Details By Id
exports.getAdminById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Admin = await AdminModel.findById(id)
  console.log(Admin)
  res.status(200).json(Admin)
})

//  To Update a Admin Profile
exports.updateAdmin = catchAsync(async (req, res, next) => {
  const { name, description } = req.body

  const AdminUpdate = {
    name,
    description,
  }

  const Admin = await AdminModel.findByIdAndUpdate(req.body.id, AdminUpdate, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  res.status(200).json(Admin)
})

// Delete Admin from list
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const Admin = await AdminModel.findById(req.params.id)
  await Admin.deleteOne
  console.log("Admin deleted successfully")

  res.status(200).json({
    message: "Admin deleted.",
  })
})
//Add Admin in List
exports.createAdmin = catchAsync(async (req, res, next) => {
  // Gather Admin's name, email, and description from the request
  const { name, description } = req.body

  // Create a new Admin object
  const AdminCreate = {
    name: name,
    description: description,
  }
  const Admin = await AdminModel.create(AdminCreate)

  console.log("Admin saved successfully:", Admin)
  res.status(200).json(Admin)
})

exports.createTenAdmins = async (req, res, next) => {
  // Create an array of 10 Admin documents.
  const Admins = []
  for (let i = 0; i < 10; i++) {
    Admins.push({
      name: "Admin 7",
      email: `Admin${i}@example.com`,
      role: "Admin",
    })
  }
  // Insert the Admin documents into the database.
  const p = await Admin.insertMany(Admins)
  res.status(200).json({
    success: true,
    p,
  })
  // createTenAdmins()
  console.log("done")
}
