import { Request, Response } from "express";
import { productService } from "./product.service";
import { asyncHandler } from "../../common/utils/asyncHandler";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;

  const product = await productService.createProduct({
    name,
    description,
    price,
    stock,
  });

  res.json(product);
});

export const getProducts = asyncHandler(async (_: Request, res: Response) => {
  const products = await productService.getProducts();

  res.json(products);
});
