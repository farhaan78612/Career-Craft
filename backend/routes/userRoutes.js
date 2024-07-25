import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUserController,
  updateUserController,
  allUsersController,
  singleUserController,
  deleteUserController,
} from "../controllers/userController.js";

//router object
const router = express.Router();

//routers
//GET USER DATA|| GET
router.post("/getUser", userAuth, getUserController);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUserController);

// All USER ADMIN || get
router.get("/allusers", userAuth, allUsersController);

// SINGLE USER  || get
router.get("/singleuser/:userId", userAuth, singleUserController);

export default router;
