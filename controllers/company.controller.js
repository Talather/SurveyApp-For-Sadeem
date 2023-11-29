<<<<<<< HEAD
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
=======
const catchAsync = require("../middleware/catchAsync");
const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Company = require("../Models/Company");
const http = require("http");
const express = require("express");
const CompanyModels = require("../Models/Company");

exports.getAllCompanies = catchAsync(async (req, res, next) => {
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
        name: {
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
      {
        headquarter: {
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
>>>>>>> d91bd4654c12395c6de7d3683224d31376af55cb
  }

  res.status(200).json({
    currentPage,
    list,
    pageSize,
    totalRecords,
<<<<<<< HEAD
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
=======
  });
});

// Get Company Details By Id
exports.getCompanyById = catchAsync(async (req, res, next) => {
  var id = req.params.id;
  const Company = await CompanyModels.findById(id);
  console.log(Company);
  res.status(200).json(Company);
});

//  To Update a Company Profile
exports.updateCompany = catchAsync(async (req, res, next) => {
  const { name, description, headquarter, region, noOfSubsidaries, industry } =
    req.body;

  const CompanyUpdate = {
    name: name,
    description: description,
    headquarter: headquarter,
    region: region,
    industry: industry,
    numberofsubsidiaries: noOfSubsidaries,
  };
  try {
    const Company = await CompanyModels.findByIdAndUpdate(
      req.body.id,
      CompanyUpdate,
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    );
    res.status(200).json(Company);
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});

// Delete Company from list
exports.deleteCompany = catchAsync(async (req, res, next) => {
  const Company = await CompanyModels.findById(req.params.id);
  await Company.deleteOne;
  console.log("Company deleted successfully");

  res.status(200).json({
    message: "Company deleted.",
  });
});
//Add Company in List
exports.createCompany = catchAsync(async (req, res, next) => {
  // Gather Company's name, email, and description from the request
  const { name, description, headquarter, region, noOfSubsidaries, industry } =
    req.body;
>>>>>>> d91bd4654c12395c6de7d3683224d31376af55cb

  // Create a new Company object
  const CompanyCreate = {
    name: name,
    description: description,
<<<<<<< HEAD
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
=======
    headquarter: headquarter,
    region: region,
    industry: industry,
    numberofsubsidiaries: noOfSubsidaries,
  };
  try {
    const Company = await CompanyModels.create(CompanyCreate);

    console.log("Company saved successfully:", Company);
    res.status(200).json(Company);
  } catch (error) {
    // Code that you want to execute if an error occurs
    console.error(error);
    res.status(201).json({
      success: false,
      error,
    });
  }
});

exports.createTenCompanies = async (req, res, next) => {
  // Create an array of 10 Company documents.
  const Categories = [];
  for (let i = 0; i < 10; i++) {
    Categories.push({
      name: "Company 7",
      email: `Company${i}@example.com`,
      role: "Category",
    });
  }
  // Insert the Company documents into the database.
  const p = await CompanyModels.insertMany(Categories);
  res.status(200).json({
    success: true,
    p,
  });
  console.log("done");
};
>>>>>>> d91bd4654c12395c6de7d3683224d31376af55cb
