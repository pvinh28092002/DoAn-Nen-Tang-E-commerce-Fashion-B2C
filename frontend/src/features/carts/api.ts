import { apiRequest } from "../../lib/api-client";
import type { ApiResponse, CartItem } from "./types";

export async function getCurrentUser() {
  const response = await apiRequest<ApiResponse<CartItem[]>>("/carts");
  if (!response.success) {
    throw new Error("Failed to get cart");
  }
  return response.data;
}
