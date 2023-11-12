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
  const token = req.header("x-access-token") || req.cookies["x-access-token"];
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

exports.authenticate = (req, res, next) => {
  const accessToken =
    req.header("x-access-token") || req.cookies["x-access-token"];
  // const accessToken = req.headers['authorization'];
  const refreshToken =
    req.header("x-refresh-token") || req.cookies["x-refresh-token"];
  const secretKey = "Survey";

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    req.user = jwt.verify(accessToken, secretKey);
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken, secretKey);
      const payload = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        ref: "AT101010",
      };
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      res
        .cookie("x-access-token", accessToken, {
          httpOnly: true,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        })
        .header("x-access-token", accessToken)
        .header("x-refresh-token", refreshToken)
        .send(decoded);
    } catch (error) {
      return res.status(400).send("Invalid Token.");
    }
  }
};
