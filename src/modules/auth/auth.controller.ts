import { Request, Response } from "express";
import { authService } from "./auth.service";
import { asyncHandler } from "../../common/utils/asyncHandler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.login(email, password);

  res.json({
    success: true,
    data: user,
  });
});
