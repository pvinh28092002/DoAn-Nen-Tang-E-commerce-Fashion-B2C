import { apiRequest } from "../../lib/api-client";
import type {
  ApiResponse,
  CartItem,
  AddCartItem,
  UpdateCartItem,
} from "./types";

export async function getCurrentCart() {
  const response = await apiRequest<ApiResponse<CartItem[]>>("/carts");
  if (!response.success) {
    throw new Error("Failed to get cart");
  }
  return response.data;
}

export async function createCartItem(data: AddCartItem) {
  const response = await apiRequest<ApiResponse<CartItem>>("/carts/items", {
    method: "POST",
    body: data,
  });
  if (!response.success) {
    throw new Error("Failed to add cart");
  }
  return response.data;
}

export async function updateCartItem(data: UpdateCartItem) {
  const response = await apiRequest<ApiResponse<CartItem>>(
    "/carts/items/" + data.variantId,
    {
      method: "PUT",
      body: { quantity: data.quantity },
    },
  );
  if (!response.success) {
    throw new Error("Failed to update cart");
  }
  return response.data;
}

export async function deleteCartItem(data: string) {
  const response = await apiRequest<ApiResponse<CartItem>>(
    "/carts/items/" + data,
    {
      method: "DELETE",
    },
  );
  if (!response.success) {
    throw new Error("Failed to remove cart item");
  }
  return response.data;
}
