import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide job title"],
    minLength: [3, "title must contain at least 3 characters!"],
    maxLength: [50, "title cannot exceed  50 characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide job description "],
    minLength: [3, "Job description must contain at least 3 characters!"],
    maxLength: [350, "Job description cannot exceed  350 characters!"],
  },
  category: {
    type: String,
    required: [true, "Job category  is required"],
    maxlength: 100,
  },
  country: {
    type: String,
    required: [true, "Job country  is required"],
  },
  city: {
    type: String,
    required: [true, "Job city  is required"],
  },
  location: {
    type: String,
    required: [true, "Please provide exact location"],
    minLength: [25, "Job location must contain at least 25 characters!"],
  },

  fixedSalary: {
    type: Number,
    required: function () {
      return !this.salaryFrom && !this.salaryTo;
    },
  },
  salaryFrom: {
    type: Number,
    required: function () {
      return !this.fixedSalary;
    },
  },
  salaryTo: {
    type: Number,
    required: function () {
      return !this.fixedSalary;
    },
  },

  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Job", jobSchema);
