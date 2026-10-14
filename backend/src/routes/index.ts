import { Router } from "express";
import categoryRouter from "./category.route.js";
import productRouter from "./product.route.js";
import productCategoryRouter from "./product-variant.route.js";
import cartRouter from "./cart.route.js";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import orderRouter from "./order.route.js";
const apiRouter = Router();

// Hook up individual domain routes here
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/product-variants", productCategoryRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/orders", orderRouter);

export default apiRouter;
