import { Router } from "express";
import { createProduct, getProducts } from "./product.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";

export const productRouter = Router();
productRouter.post("/", authMiddleware, createProduct);
productRouter.get("/", getProducts);
