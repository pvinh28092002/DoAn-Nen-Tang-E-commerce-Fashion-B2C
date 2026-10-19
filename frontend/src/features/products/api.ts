import { apiRequest } from "../../lib/api-client";
import type { ApiResponse, Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const response = await apiRequest<ApiResponse<Product[]>>("/products");
  if (!response.success) {
    throw new Error("Failed to fetch products");
  }
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await apiRequest<ApiResponse<Product>>(`/products/${id}`);
  if (!response.success) {
    throw new Error("Failed to fetch product");
  }
  return response.data;
}
