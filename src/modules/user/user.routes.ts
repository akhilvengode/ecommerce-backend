import { Router } from "express";
import { createUser, getUsers } from "./user.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { createUserSchema } from "./user.validation";
import { authMiddleware } from "../../common/middleware/auth.middleware";

export const userRouter = Router();

userRouter.post("/", authMiddleware, validate(createUserSchema), createUser);
userRouter.get("/", authMiddleware, getUsers);
