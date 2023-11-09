const catchAsync = require("./../middleware/catchAsync");
// const sendCookie = require("../utils/sendCookie");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const UserModel = require("./../inspireAppModels/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const loginUser = catchAsync(async (req, res, next) => {
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
  const token = user.generateAuthToken();
  res
    .cookie("x-auth-token", token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    }) // maxAge expire after 1 hour
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["name", "email", "role", "_id"]));
});

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  let user = await UserModel.findOne({ email: email });
  if (user) return res.status(400).send("User already registered.");

  user = new UserModel(_.pick(req.body, ["name", "email", "password", "role"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .status(201)
    .send(_.pick(user, ["_id", "name", "email", "role"]));
});

const logout = catchAsync(async (req, res) => {
  res.cookie("x-auth-token", null).send("Successfully logout");
});

// const logoutUser = catchAsync(async (req, res) => {
//   const token = request.header["authorization"];
//   // Invalidate the JWT token.
//   jwt.destroy(token, (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });
// });

// const secret = process.env.JWT_SECRET;

// //code to generate a access token
// const generateAccessToken = (req) => {
//   const values = req.body || tokenValues;
//   const payload = {
//     id: values.id,
//     name: values.name,
//     email: values.email,
//     ref: "AT101010",
//   };

//   const accesstoken = jwt.sign(payload, secret, {
//     expiresIn: Math.floor(Date.now() / 1000) + 15 * 60,
//   });
//   //   sendCookie({ accesstoken, RefreshToken }, 201, res);
//   return accesstoken;
// };

// //Code to produce a Refresh token
// const generateRefreshToken = (token, req) => {
//   const values = req.body || token;
//   const payload = {
//     id: values.id,
//     name: values.name,
//     email: values.email,
//     ref: "RT101010",
//   };
//   const refreshtoken = jwt.sign(payload, secret, {
//     expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
//   });
//   //   sendCookie({ refreshtoken }, 201, res);
//   return refreshtoken;
// };

// //verify the access token that comes from user
// const verifyAccessToken = (at = generateAccessToken(req), req) => {
//   try {
//     // decodedAccessToken = jwt.verify(at, sendCookie);
//     // Check if the access token is expired
//     if (decodedAccessToken.exp < Math.floor(Date.now() / 1000)) {
//       throw new Error("Access token is expired");
//     }
//     return true;
//   } catch (error) {
//     return null;
//   }
// };

// //verify the refresh token that comes from user
// const verifyRefreshToken = (rt = generateRefreshToken(req), req) => {
//   try {
//     decodedAccessToken = jwt.verify(rt, secret);
//     // Check if the access token is expired
//     if (decodedAccessToken.exp < Math.floor(Date.now() / 1000)) {
//       throw new Error("Access token is expired");
//     }
//     return true;
//   } catch (error) {
//     return null;
//   }
// };
// //   const refreshToken = crypto.randomBytes(16).toString("hex")

// //Send cookie that contains token to user
// // const sendCookie = (token, statusCode, res) => {
// //   const options = {
// //     expires: new Date(
// //       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
// //     ),
// //     httpOnly: true,
// //   };
// //   res.status(statusCode).cookie("token", token, options).json({
// //     success: true,
// //     user,
// //   });
// // };

// const recreateAccessTokenRoute = async (req, res) => {
//   // Get the refresh token from the request body
//   const REFRESHTOKEN = req.body.refreshToken;
//   verifyRefreshToken(REFRESHTOKEN); //to verify the refresh token.

//   // Refresh the access token
//   const newAccessToken = await generateAccessToken(REFRESHTOKEN, req);

//   // make thenew refresh token
//   const newRefreshToken = await generateRefreshToken(REFRESHTOKEN, req);

//   // Send the new access token to the client
//   //   sendCookie({ newAccessToken, newRefreshToken });
// };

module.exports = {
  //   generateAccessToken,
  //   generateRefreshToken,
  loginUser,
  registerUser,
  logout,
  //   logoutUser,
};
