import userModel from "../models/userModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { sendToken } from "../utils/jwtToken.js";

export const registerController = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // validate
  if (!name || !password || !email || !phone || !role) {
    return next(new ErrorHandler("Please fill full registration form", 400));
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already Registered Please Login"));
  }

  const user = await userModel.create({ name, email, password, phone, role });

  sendToken(user, 201, res, "User Registered Successfully");
});

//Login controller
export const loginController = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;
  //validation
  if (!email || !password || !role) {
    return next(
      new ErrorHandler("Please provide email, password and role.", 400)
    );
  }

  //find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  //compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }
  user.password = undefined;
  sendToken(user, 200, res, "User logged in successfully");
});

//Logout
export const logoutController = catchAsyncError(async (req, res, next) => {
  // res.clearCookie("token");

  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User logged out successfully!",
    });
});

//refresh token
export const refreshToken = catchAsyncError(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new Errorhandler("Refresh token not provided", 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(new Errorhandler("Invalid refresh token", 401));
    }

    sendToken(user, 200, res, "Token refreshed successfully");
  } catch (error) {
    console.error("Refresh Token Error: ", error);
    return next(new Errorhandler("Refresh token is expired or invalid", 400));
  }
});

//Get the user
export const getUserController = catchAsyncError(async (req, res, next) => {
  const User = req.user;
  res.status(200).json({
    success: true,
    User,
  });
});
