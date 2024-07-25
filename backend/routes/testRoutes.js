import express from "express";
import { testPostController } from "../controllers/testController.js";

//router object
const router = express.Router();

//routers
router.post("/posttest", testPostController);

export default router;
