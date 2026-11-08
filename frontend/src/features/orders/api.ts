import { apiRequest } from "../../lib/api-client";
import type { ApiResponse, CheckoutRequest, Order } from "./types";

export async function checkout(data: CheckoutRequest): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>("/orders/checkout", {
    method: "POST",
    body: data,
  });

  if (!response.success) {
    throw new Error("Failed to create order");
  }

  return response.data;
}
