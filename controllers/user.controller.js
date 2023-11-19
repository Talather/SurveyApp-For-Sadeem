const catchAsync = require("./../middleware/catchAsync");
// const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const UserModel = require("../inspireAppModels/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");

exports.loginUser = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const { email, password } = req.body;
  // Find the user in the database.
  const user = await UserModel.findOne({ email });

  // If the user does not exist, throw an error.
  if (!user) {
    throw new Error("Invalid username or password.");
  }

  // Compare the user's password to the hashed password in the database.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // If the password is not valid, throw an error.
  if (!isPasswordValid) {
    //throw new Error("Invalid username or password.")
    return next(new ErrorHandler("Password doesn't match", 401));
  }
  const token = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  res
    .cookie("x-access-token", token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    }) // maxAge expire after 1 hour
    .header("x-access-token", token)
    .header("x-refresh-token", refreshToken)
    .header("access-control-expose-headers", "x-access-token")
    .send(_.pick(user, ["name", "email", "role", "_id"]));
});

exports.registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  let user = await UserModel.findOne({ email: email });
  if (user) return res.status(400).send("User already registered.");

  user = new UserModel(_.pick(req.body, ["name", "email", "password", "role"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const token = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res
    .header("x-access-token", token)
    .header("x-refresh-token", refreshToken)
    .header("access-control-expose-headers", "x-access-token")
    .status(201)
    .send(_.pick(user, ["_id", "name", "email", "role"]));
});

// const logout = catchAsync(async (req, res) => {
//   res.cookie("x-access-token", null).send("Successfully logout")
// })
//atheris a nice boy
//   const accesstoken = jwt.sign(payload, secret, {
//     expiresIn: Math.floor(Date.now() / 1000) + 15 * 60,
//   });
//   //   sendCookie({ accesstoken, RefreshToken }, 201, res)
//   const refreshtoken = jwt.sign(payload, secret, {
//     expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
//   });

// };
