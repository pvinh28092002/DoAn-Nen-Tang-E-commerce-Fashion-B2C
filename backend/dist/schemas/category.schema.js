import { z } from "zod";
export const createCategorySchema = z.object({
    name: z.string().trim().min(1),
    slug: z.string().trim().min(1),
    description: z.string().trim().optional(),
    parentId: z.string().optional(),
    coverImage: z.string().trim().optional(),
});
export const updateCategorySchema = z.object({
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    parentId: z.string().optional(),
    coverImage: z.string().trim().optional(),
});
//# sourceMappingURL=category.schema.js.map