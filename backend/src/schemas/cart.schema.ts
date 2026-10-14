import { z } from "zod";

export const createCartItemSchema = z.object({
  variantId: z.string().trim().min(1),
  quantity: z.number().int().positive(),
});
export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});
