const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Admin = require("../Models/Administrator");
const http = require("http");
const express = require("express");
const AdminModel = require("../Models/Administrator");

exports.getAllAdmins = catchAsync(async (req, res, next) => {
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

  if (req.body.searchKeyword) {
    searchKeyword = req.body.searchKeyword;
  }

  const count = {
    $count: "totalRecords",
  };

  const limit = {
    $limit: pageSize,
  };

  const match = {
    $match: {},
  };

  const skip = {
    $skip: (currentPage - 1) * pageSize,
  };

  if (searchKeyword) {
    match.$match.$or = [
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
        email: {
          $regex: searchKeyword,
          $options: "i",
        },
      },
    ];
  }

  const filter = [match, skip, limit];

  const list = await Admin.aggregate(filter);
  let totalRecords = 0;
  const countResult = await Admin.aggregate([match, count]);
  console.log(countResult);
  if (countResult[0]) {
    totalRecords = countResult[0].totalRecords;
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
  });
});

// Get Admin Details By Id
exports.getAdminById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const admin = await Admin.findById(id);
  console.log(admin);
  res.status(200).json({
    success: true,
    admin,
  });
});

//  To Update a Admin Profile
exports.updateAdmin = catchAsync(async (req, res, next) => {
  const { firstName, lastName, description, Super, email } = req.body;

  const newDataForAdmin = {
    firstName,
    lastName,
    description,
    Super,
    email,
  };
  try {
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      req.body.id,
      newDataForAdmin,
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    );
    res.status(200).json({
      success: true,
      updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});

// Delete Admin from list
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);

  // delete post & user images
  await admin.deleteOne;
  console.log("admin deleted successfully");

  res.status(200).json({
    success: true,
    message: "Admin Deleted",
  });
});
//Add Admin in List
exports.createAdmin = catchAsync(async (req, res, next) => {
  // Gather admin's name, email, and description from the request
  const { firstName, lastName, email, description, Super } = req.body;

  // Create a new admin object
  const newAdminData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    description: description,
    Super: Super,
  };
  try {
    const newAdmin = await Admin.create(newAdminData);
    console.log("Admin saved successfully:", newAdmin);
    res.status(201).json({
      success: true,
      newAdmin,
    });
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});

exports.createTenAdmins = catchAsync(async (req, res, next) => {
  console.log("started");
  // Create an array of 10 admin documents.
  const admins = [];
  for (let i = 0; i < 10; i++) {
    admins.push({
      firstName: `Admin ${i}`,
      email: `admin${i}@example.com`,
      role: "admin",
    });
    await Admin.deleteMany();
    // Insert the admin documents into the database.
    await Admin.insertMany(admins);
  }
});
