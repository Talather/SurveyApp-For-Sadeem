const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const category = require("../inspireAppModels/category")
const http = require("http")
const express = require("express")
const categoryModel = require("../inspireAppModels/category")

exports.findAllCategorys = async function () {
  // Get all categorys from the database and send it to client
  try {
    const categorys = await category.find()
    const totalcategorys = await category.countDocuments()

    console.log("Found around total categorys are :", totalcategorys)
  } catch (error) {
    console.error("Error finding categorys:", error)
  }
}

// Get category Details
exports.getCategoryDetails = catchAsync(async (req, res, next) => {
  const category = await categoryModel
    .findOne({
      name: req.body.name,
    })
    // .populate({
    //   path: "",
    // })
  res.status(200).json({
    success: true,
    category,
  })
})

// Get category Details By Id
exports.getCategoryDetailsById = catchAsync(async (req, res, next) => {
  var id = req.params.id
  const category = await categoryModel.findById(id)
  console.log(category)
  res.status(200).json({
    success: true,
    category,
  })
})

//  To Update a category Profile
exports.updateCategoryProfile = catchAsync(async (req, res, next) => {
  const { name, description } = req.body

  const newDataForcategory = {
    name,
    description,
  }
  // const categoryExists = await category.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  // const category = await categoryModel.f.findById(req.params.id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  await categoryModel.findByIdAndUpdate(req.params.id, newDataForcategory,
   {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  res.status(200).json({
    success: true,
  })
})

// Delete category from list
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await categoryModel.findById(req.body._id)
  if (category){
    console.log("category found successfully")
  }
  else
  console.log("category  not found successfully")
  
  const categoryId = category._id
  // delete post & user images
  await category.deleteOne
  console.log("category deleted successfully")

  res.status(200).json({
    success: true,
    message: "category Deleted",
  })
})
//Add category in List
exports.addCategory = catchAsync(async (req, res, next) => {
  // Gather category's name, email, and description from the request,we shoukd include topic.category document _id in request 
  const { name,description,TopicId } = req.body

  // Create a new category object
  const newCategoryData = {
    name: name,
    description:description,
    topic:TopicId
  }
  const newcategory = await category.create(newCategoryData)

  //save question ids reference in the categoryasync function getQuestionsByCategoryId(categoryId) {
    try {
      const questions = await QuestionSchema.find({ category: newcategory._id }).exec();
      const questionIds = questions.map(question => question._id);
      // return questionIds;
    } catch (error) {
      console.error('Error fetching questions by category ID:', error.message);
      throw error;
    }
  newcategory.categoryQuestions.push(...questionIds);
  console.log("User saved successfully:", newcategory)
  res.status(201).json({
    success: true,
    newcategory,
  })
})

//function for category Search
exports.searchCategory = catchAsync(async (req, res, next) => {
  // const keyword = decodeURIComponent(req.query.keyword)
  // if (keyword) {
// const categories = await categoryModel.findById("655c87f788a33902119dca19").populate('topic').exec();
    //  console.log(categories)
  const categories = await categoryModel.find({
    $or: [
      {
        name: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
    ]})
      

    //   {
    //     $lookup: {
    //       from: 'Topic',
    //       localField: 'topic',
    //       foreignField: '_id',
    //       as: 'matchedTopics',
    //     },
    //   },
    //   {
    //     $match: {
    //       $or: [
    //         { name: { $regex: /.*categoryName.*/i } }, // Search using 'name' field
    //         { 'matchedTopics.name': { $regex: /.*topicName.*/i } }, // Search using 'topics' field
    //       ],
    //     },
    //   },
    // ]);
    // 
    

    res.status(200).json({
      success: true,
      categories,
    })
}
)

exports.paginationPerPage = catchAsync(async (req, res, next) => {
  // const currentPage = Number(req.query.page) || 1
  const currentPage =req.params || 1
  const totalcategorys = await category.countDocuments()
  const skip = (currentPage - 1) * req.body.limit
  var limit = req.body.limit
  const listOfcategorysPerPage = await category.find().skip(skip).limit(limit)
  if (res) {
    res.status(200).json({
      success: true,
      listOfcategorysPerPage,
    })
  } else {
    console.log("Response object is undefined")
    // Handle the error or return an error response
  }
  console.log(listOfcategorysPerPage)
  res.status(200).json({
    success: true,
    listOfcategorysPerPage,
  })

  return {
    listOfcategorysPerPage,
    totalcategorys,
    currentPage,
    totalPages: Math.ceil(totalcategorys / limit),
  }
})
exports.createTenCategorys = async (req, res, next) => {
  // Create an array of 10 category documents.
  const categorys = []
  for (let i = 0; i < 10; i++) {
    categorys.push({
      name: `category ${i}`,
      email: `category${i}@example.com`,
      role: "category",
    })
  }

  // Insert the category documents into the database.
  const insertedCats = await category.insertMany(categorys)
  console.log(insertedCats)
}
// createTencategorys()
console.log("done")
