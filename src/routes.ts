import { Router } from "express";
import { userRouter } from "./modules/user/user.routes";
import { cartRouter } from "./modules/cart/cart.routes";
import { productRouter } from "./modules/product/product.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { checkoutRouter } from "./modules/checkout/checkout.routes";

export const routes = Router();

routes.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

routes.use("/users", userRouter);
routes.use("/cart", cartRouter);
routes.use("/products", productRouter);
routes.use("/auth", authRouter);
routes.use("/checkout", checkoutRouter);
