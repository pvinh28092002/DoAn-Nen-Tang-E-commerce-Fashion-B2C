import z from "zod";
export const createProductVariantSchema = z.object({
    productId: z.string().trim().min(1),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    sku: z.string().trim().min(1),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
    images: z.array(z.string().url()).optional(),
});
export const updateProductVariantSchema = z.object({
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    sku: z.string().trim().min(1).optional(),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
    images: z.array(z.string().url()).optional(),
});
//# sourceMappingURL=product-variant.schema.js.map