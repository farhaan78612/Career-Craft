import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { ApplicationModel } from "../models/applicationModel.js";
import jobsModel from "../models/jobsModel.js";
import cloudinary from "cloudinary";
//GET ALL Employer  APPLICATION || GET
export const employerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler(
          "Job Seeker is not allowed to access this resource!",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await ApplicationModel.find({
      "employerID.user": _id,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

//GET ALL job seeker APPLICATION || GET
export const jobseekerGetAllApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resource!",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await ApplicationModel.find({
      "applicantID.user": _id,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

// DELETE JOB SEEKER  APPLICATIONN  || GET
export const jobseekerDeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resource!",
          400
        )
      );
    }
    const { id } = req.params;
    const applications = await ApplicationModel.findById(id);
    if (!applications) {
      return next(new ErrorHandler("Oops, Application not found!", 404));
    }
    await applications.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application deleted successfully!",
    });
  }
);

// POST THE APPLICATION || POST
import mongoose from "mongoose";

export const postApplication = catchAsyncError(async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resource!",
          400
        )
      );
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Resume file is required!", 400));
    }

    const { resume } = req.files;
    const allowedFormats = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ];
    if (!allowedFormats.includes(resume.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid file type. Please upload your resume in a PNG, JPG, or WEBP format.",
          400
        )
      );
    }

    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
      );
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return next(
        new ErrorHandler("Failed to upload resume to Cloudinary.", 500)
      );
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    if (!jobId) {
      return next(new ErrorHandler("Job ID is required!", 400));
    }

    // Check if the jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return next(new ErrorHandler("Invalid Job ID format!", 400));
    }

    console.log(`Looking for job with ID: ${jobId}`);

    let jobDetails;
    try {
      jobDetails = await jobsModel.findById(jobId);

      if (!jobDetails) {
        console.error(`Job with ID ${jobId} not found in the database.`);
        return next(new ErrorHandler("Job not found!", 404));
      } else {
        console.log(`Found job details: ${JSON.stringify(jobDetails)}`);
      }
    } catch (error) {
      console.error("Database Error:", error);
      return next(
        new ErrorHandler(
          "Database error occurred while fetching job details.",
          500
        )
      );
    }

    const applicantID = {
      user: req.user._id,
      role: "Job Seeker",
    };

    const employerID = {
      user: jobDetails.postedBy,
      role: "Employer",
    };

    if (!name || !email || !coverLetter || !phone || !address || !resume) {
      return next(new ErrorHandler("Please fill all the fields!", 400));
    }

    let application;
    try {
      application = await ApplicationModel.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      });
    } catch (error) {
      console.error("Database Error:", error);
      return next(new ErrorHandler("Failed to create application.", 500));
    }

    res.status(201).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    console.error("General Error:", error);
    next(
      new ErrorHandler(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
  }
});
