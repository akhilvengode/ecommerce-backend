import { Router } from "express";
import { addToCart, getCart, updateCartItem } from "./cart.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { updateCartSchema } from "./cart.validation";
import { validate } from "../../common/middleware/validate.middleware";

export const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.post("/items", addToCart);
cartRouter.get("/", getCart);
cartRouter.patch("/items", validate(updateCartSchema), updateCartItem);
