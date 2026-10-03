import { Request, Response } from "express";
import { cartService } from "./cart.service";
import { asyncHandler } from "../../common/utils/asyncHandler";

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.userId;

  const cartItem = await cartService.addToCart({
    userId,
    productId,
    quantity,
  });

  res.json(cartItem);
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const cart = await cartService.getCart(userId);

  res.json({
    success: true,
    data: cart,
  });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { productId, quantity } = req.body;

  const result = await cartService.updateCartItem({
    userId,
    productId,
    quantity,
  });

  res.json({
    success: true,
    data: result,
  });
});
