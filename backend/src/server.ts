import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";

import "dotenv/config";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json" with { type: "json" };
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

//Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Error handling middleware
app.use(errorMiddleware);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
