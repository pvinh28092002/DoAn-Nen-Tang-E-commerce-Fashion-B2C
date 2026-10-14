import { z } from "zod";
export const registerUserSchema = z.object({
    name: z.string().trim().min(1),
    email: z.email().trim().min(1),
    password: z.string().trim().min(1),
});
export const loginUserSchema = z.object({
    email: z.string().email().trim().min(1),
    password: z.string().trim().min(1),
});
//# sourceMappingURL=auth.schema.js.map