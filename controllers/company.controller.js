const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const employee = require("../inspireAppModels/employee")
const company = require("../inspireAppModels/company")
const http = require("http")
const express = require("express")
const companyModel = require("../inspireAppModels/company")
const QuestionSchema = require("../inspireAppModels/question")
exports.findAllcompanies = async function () {
  // Get all companies from the database and send it to client
  try {
    const companies = await company.find()
    const totalcompanies = await company.countDocuments()

    console.log("Found around total companies are :", totalcompanies)
  } catch (error) {
    console.error("Error finding companies:", error)
  }
}
  


// Get company Details
exports.getcompanyDetails = catchAsync(async (req, res, next) => {
  const company = await companyModel
    .findOne({
      name: req.body.name,
    })
    // .populate({
    //   path: "",
    // })
  res.status(200).json({
    success: true,
    company,
  })
})

// Get company Details By Id
exports.getcompanyDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const company = await companyModel.findById(id)
  console.log(company)
  res.status(200).json({
    success: true,
    company,
  })
})

//  To Update a company Profile
exports.updatecompanyProfile = catchAsync(async (req, res, next) => {
  const { name, description,headquarter,region,industry} = req.body

  const newDataForcompany = {
    name:name,
    description:description,
    headquarter:headquarter,
    region:region,
    industry:industry,
  }
  console.log(req.params.id)
  
  // const company = await companyModel.f.findById(req.params.id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  const newDoc=await companyModel.findByIdAndUpdate(req.params.id, newDataForcompany,
   {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  newDoc.populate('topic')
  res.status(200).json({
    success: true,
    newDoc
  })
})

// Delete company from list
exports.deletecompany = catchAsync(async (req, res, next) => {
  const company = await companyModel.findById(req.body._id)
  if (company){
    console.log("company found successfully")
  }
  else
  console.log("company  not found ")
  
  await company.deleteOne
  console.log("company deleted successfully")

  res.status(200).json({
    success: true,
    message: "company Deleted successfully",
  })
})
//Add company in List
exports.addcompany = catchAsync(async (req, res, next) => {
  // Gather company's name, email, and description from the request,we shoukd include topic.company document _id in request 
  const { name,description,headquarter,region,industry } = req.body


//count number of employees of a company
const noOfEmployees = catchAsync(async (name) => {
    const count = await employee.countDocuments({ company:name });
    return count;
  })

  // Create a new company object
  const newcompanyData = {
    name: name,
    description:description,
    headquarter:headquarter,
    region:region,
    industry:industry,
    // noOfEmployees:noOfEmployees(name)
  }
  const newcompany = await company.create(newcompanyData)

  //save employyes ids reference in the companyasync function getemployyessBycompanyId(companyId) {
//     try {
//       const employees = await employee.schema.find({ company: newcompany._id }).exec();
//       const questionIds = questions.map(employees => employees._id);
//       // return employeesIds;
//     } catch (error) {
//       console.error('Error fetching employees by company ID:', error.message);
//       throw error;
//     }
//   newcompany.companyEmployes.push(...employeesIds);
//   console.log("subcompany saved successfully:", newcompany)
  res.status(201).json({
    success: true,
    newcompany
  })
})

//function for company Search
exports.searchcompany = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;
  if (keyword) {
    const categories = await company.find({
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
    res.status(200).json({
      success: true,
      categories,
    })
}}
)

exports.paginationPerPage = catchAsync(async (req, res, next) => {
  
  var limit = req.body.limit
  const currentPage =req.params.page || 1
  const totalcompanies = await company.countDocuments()
  const skip = (currentPage - 1) * limit
 
  const listOfcompaniesPerPage = await company.find().skip(skip).limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfcompaniesPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  console.log(listOfcompaniesPerPage)
  res.status(200).json({
    success: true,
    listOfcompaniesPerPage,
  })

  return {
    listOfcompaniesPerPage,
    totalcompanies,
    currentPage,
    totalPages: Math.ceil(totalcompanies / limit),
  }
})
exports.createTencompanies = async (req, res, next) => {
  // Create an array of 10 company documents.
  const companies = []
  for (let i = 0; i < 10; i++) {
    companies.push({
      name: `company ${i}`,
      email: `company${i}@example.com`,
      role: "company",
    })
  }

  // Insert the company documents into the database.
  const insertedCompanies = await company.insertMany(companies)
  console.log(insertedCompanies)
}
// createTencompanies()
console.log("done")
