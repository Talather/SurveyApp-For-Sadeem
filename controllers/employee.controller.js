const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Employee = require("../Models/employee");
const http = require("http");
const express = require("express");
const employeeModels = require("../Models/employee");

exports.getAllEmployees = catchAsync(async (req, res, next) => {
  let currentPage = 1;
  let pageSize = 10;
  let searchKeyword = "";

  if (req.body.currentPage) {
    currentPage = req.body.currentPage;
  }

  if (req.body.pageSize) {
    pageSize = req.body.pageSize;
  } else if (pageSize === -1) {
    pageSize = 0;
  }

  const skip = (currentPage - 1) * pageSize;

  let list = [];
  let totalRecords = 0;

  if (req.body.searchKeyword) {
    searchKeyword = req.body.searchKeyword;
    let filter = {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    };
    let options = {
      $match: {
        $or: [
          {
            "company.name": {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            firstName: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            lastName: {
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
      },
    };
    list = await Employee.aggregate([filter, options]);
    totalRecords = await Employee.countDocuments({ filter, options });
  } else {
    console.log("all Categories");
    list = await Employee.find().skip(skip).limit(pageSize);
    totalRecords = await Employee.countDocuments();
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  });
});

// Get Employee Details By Id
exports.getEmployeeById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const Employee = await EmployeeModels.findById(id);
  console.log(Employee);
  res.status(200).json(Employee);
});

//  To Update a Employee Profile
exports.updateEmployee = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    companyId,
    region,
    segment,
    designation,
    description,
    subsidiary,
  } = req.body;

  const EmployeeUpdate = {
    firstName: firstName,
    lastName: lastName,
    company: companyId,
    region: region,
    segment: segment,
    designation: designation,
    description: description,
    subsidiary: subsidiary,
  };
  // const Employee = await Employee.findById(req.params.id);
  const Employee = await employeeModels.findByIdAndUpdate(
    req.body.id,
    EmployeeUpdate,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  res.status(200).json(Employee);
});

// Delete Employee from list
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const Employee = await employeeModels.findById(req.params.id);
  await Employee.deleteOne;
  console.log("Employee deleted successfully");

  res.status(200).json({
    message: "Employee deleted.",
  });
});
//Add Employee in List
exports.createEmployee = catchAsync(async (req, res, next) => {
  // Gather Employee's name, email, and description from the request
  const {
    firstName,
    lastName,
    description,
    companyId,
    region,
    segment,
    designation,

    subsidiary,
  } = req.body;

  // Create a new Employee object
  const EmployeeCreate = {
    firstName: firstName,
    lastName: lastName,
    description: description,
    company: companyId,
    region: region,
    segment: segment,
    designation: designation,
    description: description,
    subsidiary: subsidiary,
  };
  const Employee = await employeeModels.create(EmployeeCreate);

  console.log("Employee saved successfully:", Employee);
  res.status(200).json(Employee);
});

exports.createTenEmployees = async (req, res, next) => {
  // Create an array of 10 Employee documents.
  const Categories = [];
  for (let i = 0; i < 10; i++) {
    Categories.push({
      name: "Employee 7",
      email: `Employee${i}@example.com`,
      role: "Category",
    });
  }
  // Insert the Category documents into the database.
  const p = await employeeModels.insertMany(Categories);
  res.status(200).json({
    success: true,
    p,
  });
  // createTenCategories()
  console.log("done");
};
