const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Employee = require("../inspireAppModels/employee")
const http = require("http")
const express = require("express")
const company = require("../inspireAppModels/company")
const QuestionSchema = require("../inspireAppModels/question")
const employeeModels = require("../inspireAppModels/employee")
exports.findAllEmployees = catchAsync(async (req, res, next) => {
  // Get all Employees from the database and send it to client
  try {
    const Employees = await Employee.find()
    const totalEmployees = await Employee.countDocuments()

    console.log("Found around total Employees are :", totalEmployees)
    res.status(200).json({
      success: true,
      Employees,
      totalEmployees
      
    })
  } catch (error) {
    console.error("Error finding Employees:", error)
  }
})
  


// Get Employee Details
exports.getEmployeeDetails = catchAsync(async (req, res, next) => {
  const Employee = await employeeModels
    .findOne({
      name: req.body.name,
    })
    .populate({
      path: "company",
    })
  res.status(200).json({
    success: true,
    Employee,
  })
})

// Get Employee Details By Id
exports.getEmployeeDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const Employee = await employeeModels.findById(id).populate({
    path: "company",
  })
  console.log(Employee)
  res.status(200).json({
    success: true,
    Employee,
  })
})

//  To Update a Employee Profile
exports.updateEmployeeProfile = catchAsync(async (req, res, next) => {
  const { name, description,headquarter,region,industry,companyId} = req.body

  const newDataForEmployee = {
    name:name,
    description:description,
    headquarter:headquarter,
    region:region,
    industry:industry,
    company:companyId
    // noOfEmployees: will come from 
  }
  console.log(req.params.id)
  
  // const Employee = await EmployeeModel.f.findById(req.params.id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  const newDoc=await employeeModels.findByIdAndUpdate(req.params.id, newDataForEmployee,
   {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  await newDoc.populate('company')
  res.status(200).json({
    success: true,
    newDoc
  })
})

// Delete Employee from list
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const Employee = await employeeModels.findById(req.body._id)
  if (Employee){
    console.log("Employee found successfully")
  }
  else
  console.log("Employee  not found ")
  
  await Employee.deleteOne
  console.log("Employee deleted successfully")

  res.status(200).json({
    success: true,
    message: "Employee Deleted successfully",
  })
})
//Add Employee in List
exports.addEmployee = catchAsync(async (req, res, next) => {
  // Gather Employee's name, email, and description from the request,we shoukd include topic.Employee document _id in request 
  const { name,description,headquarter,region,industry,companyId } = req.body


//count number of employees of a Employee
// const noOfEmployees = catchAsync(async (name) => {
//     const count = await Employee.countDocuments({ company:name });
//     return count;
//   })

  // Create a new Employee object
  const newEmployeeData = {
    name: name,
    description:description,
    headquarter:headquarter,
    region:region,
    industry:industry,
    company:companyId
    // noOfEmployees:noOfEmployees(name)
  }
  const newEmployee = await Employee.create(newEmployeeData)
   await newEmployee.populate('company')
//save employyes ids reference in the Employeeasync function getemployyessByEmployeeId(EmployeeId) {
//     try {
//       const employees = await employee.schema.find({ Employee: newEmployee._id }).exec();
//       const questionIds = questions.map(employees => employees._id);
//       // return employeesIds;
//     } catch (error) {
//       console.error('Error fetching employees by Employee ID:', error.message);
//       throw error;
//     }
//   newEmployee.EmployeeEmployes.push(...employeesIds);
//   console.log("subEmployee saved successfully:", newEmployee)
  res.status(201).json({
    success: true,
    newEmployee
  })
})

//function for Employee Search
exports.searchEmployee = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;
  if (keyword) {
    const categories = await Employee.find({
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
  const totalEmployees = await Employee.countDocuments()
  const skip = (currentPage - 1) * limit
 
  const listOfEmployeesPerPage = await Employee.find().skip(skip).limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfEmployeesPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  console.log(listOfEmployeesPerPage)
  res.status(200).json({
    success: true,
    listOfEmployeesPerPage,
  })

  return {
    listOfEmployeesPerPage,
    totalEmployees,
    currentPage,
    totalPages: Math.ceil(totalEmployees / limit),
  }
})
exports.createTenEmployees = async (req, res, next) => {
  // Create an array of 10 Employee documents.
  const Employees = []
  for (let i = 0; i < 10; i++) {
    Employees.push({
      name: `Employee ${i}`,
      email: `Employee${i}@example.com`,
      role: "Employee",
    })
  }

  // Insert the Employee documents into the database.
  const insertedEmployees = await Employee.insertMany(Employees)
  console.log(insertedEmployees)
}
// createTenEmployees()
console.log("done")
