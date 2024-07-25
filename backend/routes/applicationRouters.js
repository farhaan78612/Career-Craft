import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplication,
  postApplication,
} from "../controllers/applicationController.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";
const router = express.Router();

//routes
router.post("/post", isAuthorized, postApplication);
router.get("/employer/getall", isAuthorized, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthorized, jobseekerGetAllApplication);
router.delete("/delete/:id", isAuthorized, jobseekerDeleteApplication);

export default router;
