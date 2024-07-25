import express from "express";
import isAuthorized from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  getMyJobsController,
  getSingleJob,
  updateJobController,
} from "../controllers/jobsController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Job:
 *      type: object
 *      required:
 *        - company
 *        - position
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the job
 *          example: dfsfd
 *        company:
 *          type: string
 *          description: Company name of the job
 *          example: google
 *        position:
 *          type: string
 *          description: Position of the job
 *          example: Full Stack Developer
 *        status:
 *          type: string
 *          description: Status of the job application, e.g., "pending", "interview", "rejected"
 *          example: pending
 *        workType:
 *          type: string
 *          description: Type of work, e.g., "full-time", "part-time", "internship", "contract"
 *          example: full-time
 *        workLocation:
 *          type: string
 *          description: Work location of the job
 *          example: mumbai
 *      example:
 *        id: kdlmslkfna
 *        company: google
 *        position: Full Stack Developer
 *        status: interview
 *        workType: full-time
 *        workLocation: mumbai
 */

/**
 * @swagger
 * tags:
 *   name: Job
 *   description: Job APIs
 */

/**
 * @swagger
 * /api/v1/job/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: Bearer kdhsakhdka
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       500:
 *         description: Internal server error
 */

//  CREATE JOBS || POST
router.post("/create-job", isAuthorized, createJobController);

/**
 * @swagger
 * /api/v1/job/get-job:
 *   get:
 *     summary: Retrieve jobs based on query parameters
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: Bearer kdhsakhdka
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *         description: Sort order
 *         example: a-z
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number
 *         example: 2
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *         example: 40
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Job status
 *         example: reject
 *       - in: query
 *         name: workType
 *         required: false
 *         schema:
 *           type: string
 *         description: Type of work
 *         example: full-time
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search keyword
 *         example: engineer
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       500:
 *         description: Internal server error
 * securityDefinitions:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

//GET ALL JOBS || GET
router.get("/get-jobs", getAllJobsController);

//GET MY JOBS || GET
router.get("/get-my-jobs", isAuthorized, getMyJobsController);

/**
 * @swagger
 * /api/v1/job/update-job/{id}:
 *   patch:
 *     summary: Update a job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: Bearer kdhsakhdka
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       500:
 *         description: Internal server error
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         workType:
 *           type: string
 *         search:
 *           type: string
 */

// UPDATE JOBS || PUT
router.put("/update-job/:id", isAuthorized, updateJobController);

/**
 * @swagger
 * /api/v1/job/delete-job/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: Bearer kdhsakhdka
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID to delete
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         workType:
 *           type: string
 *         search:
 *           type: string
 */

// DELETE JOBS || DELETE
router.delete("/delete-job/:id", isAuthorized, deleteJobController);

//GET SINGLE JOBS|| GET
router.get("/:id", isAuthorized, getSingleJob);

export default router;
