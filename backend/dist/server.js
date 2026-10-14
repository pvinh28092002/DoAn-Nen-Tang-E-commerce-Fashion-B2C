import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import "dotenv/config";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 5000;
//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//Routes
app.use("/api/v1", apiRouter);
//Error handling middleware
app.use(errorMiddleware);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map