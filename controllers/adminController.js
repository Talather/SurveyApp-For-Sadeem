const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Admin = require("../inspireAppModels/administrator");
const http = require("http");
const express = require("express");
const AdminModel = require("../inspireAppModels/administrator");

//Get list of Admins on search or pagination
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  let currentPage = 1;
  let pageSize = 10;
  let searchKeyword = "";
  if (req.body.currentPage) {
    currentPage = req.body.currentPage;
    if (req.body.pageSize) {
      pageSize = req.body.pageSize;
      if (req.body.searchKeyword) {
        searchKeyword = req.body.searchKeyword;
        const skip = (currentPage - 1) * pageSize;
        const searchedAdmin = await Admin.find({
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
          .limit(pageSize);
        const totalsearchedAdmin = await Admin.countDocuments({
          name: {
            $regex: searchKeyword,
            $options: "i",
          },
        });
        res.status(200).json({
          success: true,
          searchedAdmin,
          totalsearchedAdmin,
        });
      } else {
        console.log("all Admins");
        const skip = (currentPage - 1) * pageSize;
        const list = await Admin.find().skip(skip).limit(pageSize);
        const totalAdmin = await Admin.countDocuments();
        res.status(200).json({
          success: true,
          list,
          totalAdmin,
        });
      }
    }
  } else {
    res.status(404).json({
      error: "404",
    });
  }
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
  const { firstName, lastName, description, email, password } = req.body;

  const newDataForAdmin = {
    firstName,
    lastName,
    description,
    email,
    password,
  };

  const admin = await Admin.findById(req.body.id); //To fetch through id we have to send complete document along with id,so that this id could be used further
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
  const { firstName, lastName, email, password, description } = req.body;

  // Create a new admin object
  const newAdminData = {
    firstNameame: firstName,
    lastName: lastName,
    email: email,
    description: description,
    password: password,
  };
  const newAdmin = await Admin.create(newAdminData);

  console.log("Admin saved successfully:", newAdmin);
  res.status(201).json({
    success: true,
    newAdmin,
  });
});

//  Admin Search
exports.searchAdmin = catchAsync(async (req, res, next) => {
  const keyword = req.params.keyword;
  if (keyword) {
    const searchedAdmins = await Admin.find({
      $or: [
        {
          firstName: {
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
        {
          lastName: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });
    console.log(searchedAdmins);
    res.status(200).json({
      success: true,
      users: searchedAdmins,
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

exports.pagination = catchAsync(async (req, res, next) => {
  const currentPage = req.params.page;
  // const currentPage = 1;
  const totalAdmins = await Admin.countDocuments();
  var limit = req.body.limit;
  const skip = (currentPage - 1) * limit;
  const totalpgs = Math.ceil(totalAdmins / limit);
  const listOfAdminsPerPage = await Admin.find().skip(skip).limit(limit);
  console.log(totalAdmins, totalpgs);
  // console.log(listOfAdminsPerPage);
  res.status(200).json({
    success: true,
    totalAdmins,
    totalPages: totalpgs,
    listOfAdminsPerPage,
  });
});
