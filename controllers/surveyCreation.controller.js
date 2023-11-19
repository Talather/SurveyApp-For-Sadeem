const catchAsync = require("../middleware/catchAsync")
const sendCookie = require("../utils/sendCookie")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const survey = require("../Inspire_App_Models/survey")
const http = require("http")
const Survey = require("../Inspire_App_Models/survey")
const Question = require("../Inspire_App_Models/question")
const Answer = require("../Inspire_App_Models/answer")
const Questions = require("../Inspire_App_Models/question")
const val = require("ajv")

// create survey
exports.createSurvey = catchAsync(async (req, res, next) => {
  const { name, description, questions, answers } = req.body
  // const questions = JSON.parse(req.body.questions)
  // const answers = JSON.parse(req.body.answers)
  // const QuestionNode = [{}]
  // for (const i in questions) {
  //   QuestionNode[key] = []
  // }
  const surveyExist = await Survey.findOne({ name })

  if (surveyExist) {
    return next(new ErrorHandler("Survey Already Placed", 400))
  }

  //To validate the parsed version of data
  // const questionSchema = {
  //   name: { type: "string", required: false },
  //   description: [{ type: "string", required: false }],
  // }
  // const isValid = validate(questionSchema, parsedQuestion)
  // if (!isValid) {
  //   return res.status(400).send("Invalid question format")
  // }

  const surveyData = { name, description, questions, answers }
  // Create a answer Document for that survey document so that it could be refernced
  addAnswerDocument = await Answer.create(answers)
  //Create a Question Document for that survey document so that it could be refernced
  questionData = { survey: createdSurvey._id, questions }
  addQuestionDocument = await Questions.create(questionData)
  const createdSurvey = await Survey.create({
    name: name,
    description: description,
    surveyQuestions: addQuestionDocument._id,
  })

  res.status(200).json({
    success: true,
    message: "Survey created Successfully",
  })
})

// // Step 1: Define Schemas
// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   profiles: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'UserProfile'
//   }]
// });

// const userProfileSchema = new mongoose.Schema({
//   name: String,
//   bio: String
// });

// // Step 2: Create Model Instances
// const User = mongoose.model('User', userSchema);
// const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// // Step 3: Create and Save UserProfile Documents
// const userProfile1 = new UserProfile({
//   name: 'John Doe',
//   bio: 'A brief bio for John Doe...'
// });

// const userProfile2 = new UserProfile({
//   name: 'Jane Doe',
//   bio: 'A brief bio for Jane Doe...'
// });

// UserProfile.insertMany([userProfile1, userProfile2])
//   .then(savedProfiles => {
//     // Step 4: Create User Document with References
//     const user = new User({
//       username: 'john_doe',
//       email: 'john@example.com',
//       profiles: savedProfiles.map(profile => profile._id) // Array of references
//     });

//     // Step 5: Save User Document
//     user.save().then(savedUser => {
//       console.log('User saved with profile references:', savedUser);
//     }).catch(err => {
//       console.error('Error saving user:', err);
//     });
//   })
//   .catch(err => {
//     console.error('Error saving user profiles:', err);
//   });
