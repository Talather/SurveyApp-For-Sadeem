const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const subCategory = require("../inspireAppModels/subcategories")
const http = require("http")
const express = require("express")
const subCategoryModel = require("../inspireAppModels/subcategories")

exports.findAllsubCategories = async function () {
  // Get all subCategories from the database and send it to client
  try {
    const subCategories = await subCategory.find()
    const totalsubCategories = await subCategory.countDocuments()

    console.log("Found around total subCategories are :", totalsubCategories)
  } catch (error) {
    console.error("Error finding subCategories:", error)
  }
}

// Get subCategory Details
exports.getsubCategoryDetails = catchAsync(async (req, res, next) => {
  const subCategory = await subCategory
    .findOne({
      name: req.body.name,
    })
    .populate({
      path: "category",
    })
  res.status(200).json({
    success: true,
    subCategory,
  })
})

// Get subCategory Details By Id
exports.getsubCategoryDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const subCategory = await subCategoryModel.findById(id)
  console.log(subCategory)
  res.status(200).json({
    success: true,
    subCategory,
  })
})

//  To Update a subCategory Profile    {"name":"Azar jawaz","description":"chl bhaag yehan se","newCategoryId":"655c490f8b3a7c6e7e82447d"}
exports.updatesubCategoryProfile = catchAsync(async (req, res, next) => {
  const { name, description,newCategoryId} = req.body
console.log("yh rhi subcat id",req.params)
// const subid = new ObjectId('655d9710adecb7dbf6c0f811');
  const newDataForsubCategory = {
    name:name,
    description:description,
    category:newCategoryId
  }
  // const subCategoryExists = await subCategory.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  const subCategory = await subCategoryModel.findById(req.params.id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  const newDoc=await subCategoryModel.findByIdAndUpdate(req.params.id, newDataForsubCategory, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  console.log(newDoc)
await newDoc.populate('category')

  res.status(200).json({
    success: true,
    newDoc
  })
})

// Delete subCategory from list
exports.deletesubCategory = catchAsync(async (req, res, next) => {
  
  const subCategory = await subCategoryModel.findById(req.body._id)
  if (subCategory){console.log("subcategory found")}
  
  await subCategory.deleteOne
  console.log("subCategory deleted successfully")

  res.status(200).json({
    success: true,
    message: "subCategory Deleted",
  })
})
//Add subCategory in List
exports.addsubCategory = catchAsync(async (req, res, next) => {
  // Gather subCategory's name, email, and description from the request
  const { name,description,categoryId } = req.body

  // Create a new subCategory object
  const newsubCategoryData = {
    name: name,
    description:description,
    category:categoryId
  }
  const newsubCategory = new subCategory({
    name,
    description,
    category:categoryId
  });
  await newsubCategory.save
  await newsubCategory.populate('category')
  console.log(newsubCategory)
  
  console.log("User saved successfully:", newsubCategory)
  res.status(201).json({
    success: true,
    newsubCategory
  })
})

// Super subCategory Search
exports.searchsubCategory = catchAsync(async (req, res, next) => {
  // const keyword = decodeURIComponent(req.params)
  const { keyword } = req.params;
  if (keyword) {
    const subcategories = await subCategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $match: {
          $or: [
            {
              "category.name": {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              name: {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json({
      success: true,
      subcategories,
    })
  }
})

exports.paginationPerPage = catchAsync(async (req, res, next) => {
  const currentPage = Number(req.params.page) 
  var limit = req.body.limit
  console.log(limit)
  // const currentPage = 1
  const totalsubCategories = await subCategory.countDocuments()
  const skip = (currentPage - 1) * limit
  
  const listOfsubCategoriesPerPage = await subCategory
    .find()
    .skip(skip)
    .limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfsubCategoriesPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  console.log(listOfsubCategoriesPerPage)
  console.log(totalsubCategories)
  res.status(200).json({
    success: true,
    listOfsubCategoriesPerPage,
  })

  return {
    listOfsubCategoriesPerPage,
    totalsubCategories,
    currentPage,
    totalPages: Math.ceil(totalsubCategories / limit),
  }
})
exports.createTensubCategories = async (req, res, next) => {
  // Create an array of 10 subCategory documents.
  const subCategories = []
  for (let i = 0; i < 10; i++) {
    subCategories.push({
      name: `subCategory ${i}`,
      email: `subCategory${i}@example.com`,
      role: "subCategory",
    })
  }

  // Insert the subCategory documents into the database.
  await subCategory.insertMany(subCategories)
}
// createTensubCategories()
console.log("done")
