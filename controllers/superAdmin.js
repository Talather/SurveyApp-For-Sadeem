const catchAsync = require("../Middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const Admin = require("../Inspire_App_Models/administrator")
const http = require("http")

exports.findAllAdmins = async function () {
  // Get all admins from the database and send it to client
  try {
    const admins = await Admin.find()
    const totalAdmins = await Admin.countDocuments()

    console.log("Found around :", totalAdmins, admins)
  } catch (error) {
    console.error("Error finding admins:", error)
  }
}

// Get Admin Details
exports.getAdminDetails = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({
    $or: [{ id: req.params.id }, { name: req.params.name }],
  }).populate({
    path: "administratorSurveys",
  })
  res.status(200).json({
    success: true,
    admin,
  })
})

// Get Admin Details By Id
exports.getAdminDetailsById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    success: true,
    user,
  })
})

//  To Update a Admin Profile
exports.updateAdminProfile = catchAsync(async (req, res, next) => {
  const { name, description, email, password } = req.body

  const newDataForAdmin = {
    name,
    description,
    email,
    password,
  }
  // const adminExists = await Admin.findOne({
  //         $or:[{ email }],[{ name }]
  //   })
  const admin = await admin.findById(req.user._id) //To fetch through id we have to send complete document along with id,so that this id could be used further
  await User.findByIdAndUpdate(req.user._id, newDataForAdmin, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })
  res.status(200).json({
    success: true,
  })
})

// Delete Admin from list
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.user._id)
  const adminId = admin._id
  // delete post & user images
  await user.remove()
  console.log("admin deleted successfully")

  //   res.cookie("token", null, {
  //     expires: new Date(Date.now()),
  //     httpOnly: true,
  //   })

  res.status(200).json({
    success: true,
    message: "Admin Deleted",
  })
})
//Add Admin in List
exports.addAdmin = catchAsync(async (req, res, next) => {
  // Gather admin's name, email, and description from the request
  const { name, email, password, description } = req.body

  // Create a new admin object
  const newAdminData = {
    name: name,
    email: email,
    description: description,
    password: password,
  }
  const newAdmin = await Admin.create(newAdminData)
  newAdmin.save((err, user) => {
    if (err) {
      console.error("Error saving user:", err)
      return
    }
    console.log("User saved successfully:", user)
    res.status(201).json({
      success: true,
      newAdmin,
    })
  })
})

// Super Admin Search
exports.searchAdmin = catchAsync(async (req, res, next) => {
  if (req.query.keyword) {
    const users = await Admin.find({
      $or: [
        {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
      ],
    })

    res.status(200).json({
      success: true,
      users,
    })
  }
})
exports.paginationLogic = catchAsync(async (req) => {
  const currentPage = Number(req.query.page) || 1

  const totalPosts = await Admin.countDocuments()
  const skip = (currentPage - 1) * 10
  var limit = 10
  const listOfAdminsPerPage = await Admin.find().skip(skip).limit(limit)
  return {
    listOfAdminsPerPage,
    totalAdmins,
    currentPage,
    totalPages: Math.ceil(totalAdmins / limit),
  }
})
