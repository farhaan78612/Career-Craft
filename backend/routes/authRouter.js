import express from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshToken,
  getUserController,
} from "../controllers/authController.js";
import { rateLimit } from "express-rate-limit";
import isAuthorized from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//router

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - lastName
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *        name:
 *          type: string
 *          description: User name
 *        lastName:
 *          type: string
 *          description: User last name
 *        email:
 *          type: string
 *          description: User email-id
 *        password:
 *          type: string
 *          description: User password should be greater than 6 character
 *        location:
 *          type: string
 *          description: User location city or country
 *      example:
 *        id: kdlmslkfna
 *        name: john
 *        lastName: Doe
 *        email: johndoe@gmail.com
 *        password: test@123
 *        location: mumbai
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

//REGISTER || POST
router.post("/register", registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login to get the home page
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: login  successfull
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: soomething went wrong
 */

//L0GIN  || POST
router.post("/login", loginController);

//LOGOUT || GET
router.get("/logout", isAuthorized, logoutController);

//Get user || GET
router.get("/getuser", isAuthorized, getUserController);

router.post("/refresh-token", refreshToken);

export default router;
