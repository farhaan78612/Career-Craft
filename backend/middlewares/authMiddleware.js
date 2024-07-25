import { catchAsyncError } from "./catchAsyncError.js";
import Errorhandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthorized = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhandler("User not Authorized", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token: ", decoded);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new Errorhandler("User not found", 404));
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error: ", error);
    return next(new Errorhandler("Json Web Token is expired, try again", 400));
  }
});

export default isAuthorized;
