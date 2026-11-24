import type { OrderStatus, PaymentStatus } from "./types";

export const nextOrderStatuses: Record<
  OrderStatus,
  Exclude<OrderStatus, "CANCELLED">[]
> = {
  PENDING: ["PROCESSING", "SHIPPED", "DELIVERED"],
  PROCESSING: ["PENDING", "SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const nextPaymentStatuses: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ["COMPLETED", "FAILED"],
  COMPLETED: ["REFUNDED"],
  FAILED: ["PENDING", "COMPLETED"],
  REFUNDED: ["PENDING", "COMPLETED", "FAILED"],
};
