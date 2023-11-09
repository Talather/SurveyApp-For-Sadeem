const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("./catchAsync");

// exports.isSuperAdminAuthenticated = catchAsync(async (req, res, next) => {
//   const { token } = req.headers;

//   if (!token) {
//     next(new ErrorHandler("Please Login to Access", 401));
//     res.status(401).send("Not Authorized");
//   }
//   const decodedData = jwt.verify(token, process.env.JWT_SECRE);
//   next();
// });

exports.authMiddleware = (req, res, next) => {
  // if (!getEnv("REQUIRES_AUTH")) return next();
  const token = req.header("x-auth-token") || req.cookies["x-auth-token"];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  console.log(token);

  try {
    req.user = jwt.verify(token, "Survey");
    console.log(req.user.role);
    if (req.user.role !== "admin") {
      return res.status(401).send("Access denied");
    }

    next();
  } catch (ex) {
    if (ex.message === JWT_ERRORS.expired)
      return res.status(400).send("Jwt Token is Expired");

    res.status(400).send("Invalid token.");
  }
};
