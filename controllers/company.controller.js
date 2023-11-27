const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Company = require("../inspireAppModels/Company")
const http = require("http")
const express = require("express")
const CompanyModels = require("../inspireAppModels/Company")

exports.getAllCompanies = catchAsync(async (req, res, next) => {
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
    list = await Company.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          industry: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          region: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .skip(skip)
      .limit(pageSize)
    totalRecords = await Company.countDocuments({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          industry: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          region: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
  } else {
    console.log("all Companies")
    list = await Company.find().skip(skip).limit(pageSize)
    totalRecords = await Company.countDocuments()
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  })
})

// Get Company Details By Id
exports.getCompanyById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Company = await CompanyModels.findById(id)
  console.log(Company)
  res.status(200).json(Company)
})

//  To Update a Company Profile
exports.updateCompany = catchAsync(async (req, res, next) => {
  const { name, description } = req.body

  const CompanyUpdate = {
    name,
    description,
  }

  const Company = await CompanyModels.findByIdAndUpdate(
    req.body.id,
    CompanyUpdate,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  )
  res.status(200).json(Company)
})

// Delete Company from list
exports.deleteCompany = catchAsync(async (req, res, next) => {
  const Company = await CompanyModels.findById(req.params.id)
  await Company.deleteOne
  console.log("Company deleted successfully")

  res.status(200).json({
    message: "Company deleted.",
  })
})
//Add Company in List
exports.createCompany = catchAsync(async (req, res, next) => {
  // Gather Company's name, email, and description from the request
  const { name, description } = req.body

  // Create a new Company object
  const CompanyCreate = {
    name: name,
    description: description,
  }
  const Company = await CompanyModels.create(CompanyCreate)

  console.log("Company saved successfully:", Company)
  res.status(200).json(Company)
})

exports.createTenCompanies = async (req, res, next) => {
  // Create an array of 10 Company documents.
  const Companies = []
  for (let i = 0; i < 10; i++) {
    Companies.push({
      name: "Company 7",
      email: `Company${i}@example.com`,
      role: "Company",
    })
  }
  // Insert the Company documents into the database.
  const p = await Company.insertMany(Companies)
  res.status(200).json({
    success: true,
    p,
  })
  // createTenCompanies()
  console.log("done")
}
