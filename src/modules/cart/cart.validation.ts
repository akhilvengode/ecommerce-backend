import { z } from "zod";

export const updateCartSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(0),
});
