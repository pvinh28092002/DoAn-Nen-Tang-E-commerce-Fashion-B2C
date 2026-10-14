import { z } from "zod";
const deliveryAddressSchema = z.object({
    recipient: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    address: z.string().trim().min(1),
    city: z.string().trim().min(1),
    district: z.string().trim().min(1),
    ward: z.string().trim().optional(),
});
const paymentMethodSchema = z.enum(["BANK_TRANSFER", "COD"]);
export const checkoutSchema = z.union([
    z.object({
        paymentMethod: paymentMethodSchema,
        addressId: z.string().trim().min(1),
    }),
    z.object({
        paymentMethod: paymentMethodSchema,
        address: deliveryAddressSchema,
        saveAddress: z.boolean().optional(),
    }),
]);
const orderStatusSchema = z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
]);
const paymentStatusSchema = z.enum([
    "PENDING",
    "COMPLETED",
    "FAILED",
    "REFUNDED",
]);
export const updateOrderStatusSchema = z
    .object({
    orderStatus: orderStatusSchema.optional(),
    paymentStatus: paymentStatusSchema.optional(),
})
    .refine((data) => data.orderStatus !== undefined || data.paymentStatus !== undefined, { message: "At least one field must be provided" });
//# sourceMappingURL=order.schema.js.map