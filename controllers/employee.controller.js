const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Employee = require("../Models/employee")
const http = require("http")
const express = require("express")
const employeeModels = require("../Models/employee")
const catchAsync = require("../middleware/catchAsync")
exports.getAllEmployees = catchAsync(async (req, res, next) => {
  let companyId = ""
  let currentPage = 1
  let pageSize = 10
  let searchKeyword = ""

  if (req.body.companyId) {
    companyId = req.body.companyId
  }

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
      from: "companies",
      localField: "company",
      foreignField: "_id",
      as: "company",
    },
  }

  const match = {
    $match: {},
  }

  const skip = {
    $skip: (currentPage - 1) * pageSize,
  }

  if (companyId) {
    match.$match.$and = [
      {
        "company._id": {
          $eq: new mongoose.Types.ObjectId(companyId),
        },
      },
    ]
  }

  if (searchKeyword) {
    match.$match.$or = [
      {
        "company.name": {
          $regex: searchKeyword,
          $options: "i",
        },
      },
      {
        firstName: {
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
      {
        industry: {
          $regex: searchKeyword,
          $options: "i",
        },
      },
      {
        region: {
          $regex: searchKeyword,
          $options: "i",
        },
      },
    ]
  }

  const filter = [lookup, match, skip, limit]

  const list = await Employee.aggregate(filter)
  let totalRecords = 0
  const countResult = await Employee.aggregate([lookup, match, count])
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

// Get Employee Details By Id
exports.getEmployeeById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Employee = await EmployeeModels.findById(id)
  console.log(Employee)
  res.status(200).json(Employee)
})

//  To Update a Employee Profile
exports.updateEmployee = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    companyId,
    region,
    email,
    segment,
    designation,
    description,
    subsidiary,
  } = req.body

  const EmployeeUpdate = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    company: companyId,
    region: region,
    segment: segment,
    designation: designation,
    description: description,
    nameOfSubsidiary: subsidiary,
  }
  try {
    const Employee = await employeeModels.findByIdAndUpdate(
      req.body.id,
      EmployeeUpdate,
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    )
    res.status(200).json(Employee)
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error)
    res.status(201).json({
      success: false,
      message: "there is a error",
      error,
    })
  }
})

// Delete Employee from list
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const Employee = await employeeModels.findById(req.params.id)
  await Employee.deleteOne
  console.log("Employee deleted successfully")

  res.status(200).json({
    message: "Employee deleted.",
  })
})
//Add Employee in List
exports.createEmployee = catchAsync(async (req, res, next) => {
  // Gather Employee's name, email, and description from the request
  const {
    firstName,
    lastName,
    description,
    companyId,
    email,
    region,
    segment,
    designation,
    subsidiary,
  } = req.body

  // Create a new Employee object
  const EmployeeCreate = {
    firstName: firstName,
    lastName: lastName,
    description: description,
    email: email,
    company: companyId,
    region: region,
    segment: segment,
    designation: designation,
    description: description,
    nameOfSubsidiary: subsidiary,
  }
  try {
    const Employee = await employeeModels.create(EmployeeCreate)

    console.log("Employee saved successfully:", Employee)
    res.status(200).json(Employee)
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error)
    res.status(201).json({
      success: false,
      error,
    })
  }
})

exports.createTenEmployees = async (req, res, next) => {
  // Create an array of 10 Employee documents.
  const Categories = []
  for (let i = 0; i < 10; i++) {
    Categories.push({
      firstName: "Employee 8",
      email: `Employee${i}@example.com`,
      role: "Category",
    })
  }
  // Insert the Category documents into the database.
  const p = await employeeModels.insertMany(Categories)
  res.status(200).json({
    success: true,
    p,
  })
  // createTenCategories()
  console.log("done")
}
