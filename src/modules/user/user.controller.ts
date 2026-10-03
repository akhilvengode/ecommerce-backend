import { Request, Response } from "express";
import { userService } from "./user.service";
import { asyncHandler } from "../../common/utils/asyncHandler";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.createUser(email, password);
  const { password: hashedPassword, ...safeUser} = user;
  res.json(safeUser);
});

export const getUsers = asyncHandler(async (_: Request, res: Response) => {
  const users = await userService.getUsers();

  res.json(users);
});
