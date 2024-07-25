import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// =================CREATE A JOB==================
export const createJobController = async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not allowed to access this resource!",
        400
      )
    );
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details", 400));
  }

  // Check if neither fixedSalary nor ranged salary is provided
  if (!salaryFrom && !salaryTo && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary",
        400
      )
    );
  }

  // Check if both fixedSalary and ranged salary are provided
  if (fixedSalary && (salaryFrom || salaryTo)) {
    return next(
      new ErrorHandler(
        "Cannot enter fixed salary and range salary together",
        400
      )
    );
  }

  const postedBy = req.user._id;
  const job = await jobsModel.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    job,
  });
};

// ================GET ALL JOBS==========
export const getAllJobsController = catchAsyncError(async (req, res, next) => {
  const jobs = await jobsModel.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

//   =============GET MY JOB || GET=================

export const getMyJobsController = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not allowed to access this resourse!",
        400
      )
    );
  }
  const jobs = await jobsModel.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    jobs,
  });
});

//   =============UPDATE JOBS || PUT=================
export const updateJobController = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not allowed to access this resourse!",
        400
      )
    );
  }
  const { id } = req.params;
  let job = await jobsModel.findById(id);
  //validation
  if (!job) {
    return next(new ErrorHandler("Oops Job not found!", 404));
  }
  job = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  //response
  res.status(200).json({
    success: true,
    job,
    message: "Job updated successfully!",
  });
});

//   =============DELETE JOBS || DELETE=================
export const deleteJobController = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not allowed to access this resourse!",
        400
      )
    );
  }

  const { id } = req.params;
  //find job
  const job = await jobsModel.findOne({ _id: id });
  //validation
  if (!job) {
    return next(new ErrorHandler("Oops Job not found!", 404));
  }
  //delete job
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: " Job Deleted  Successfully!",
  });
});

//   =============GET SINGLE JOBS || GET=================
export const getSingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await jobsModel.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid ID/ CastError", 400));
  }
});
