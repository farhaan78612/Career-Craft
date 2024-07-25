// Import necessary packages and modules
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import xss from "xss-clean";
import cloudinary from "cloudinary";
import mongoSanitize from "express-mongo-sanitize";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRouter.js";
import jobsRoutes from "./routes/jobsRouter.js";
import userRoutes from "./routes/userRoutes.js";
import applicationRouters from "./routes/applicationRouters.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import bodyParser from "body-parser";

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable Access-Control-Allow-Credentials
  allowedHeaders: "Content-Type, Authorization", // Add other headers if needed
};

// Configure environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Swagger API documentation setup
const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Career Craft",
      description:
        "The 'Career Craft' is a cutting-edge platform that revolutionizes the job search and career development process. Leveraging the power of artificial intelligence and natural language processing, this virtual coach provides personalized guidance to job seekers at every stage of their career journey",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options);

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

// Body parser middleware
app.use(bodyParser.json());

app.use(morgan("dev"));

// Route setup
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);
app.use("/api/v1/application", applicationRouters);

// Swagger documentation route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// Error middleware should be the last middleware
app.use(errorMiddleware);

// Set up the server port
const PORT = process.env.PORT || 8080;

//cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Node server running in ${process.env.DEV_MODE} MODE: http://localhost:${PORT} `
      .bgRed.blue
  );
});
