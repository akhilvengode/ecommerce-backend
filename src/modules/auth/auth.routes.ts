import { Router } from "express";
import { login } from "./auth.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { loginSchema } from "./auth.validation";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), login);