import { apiRequest } from "../../lib/api-client";
import type {
  ApiResponse,
  CreateProductInput,
  CreateProductVariantInput,
  DeleteProductResponse,
  Product,
  ProductVariant,
  UpdateProductInput,
  UpdateProductVariantInput,
} from "./types";

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

export async function getProductVariants(
  productId: string,
): Promise<ProductVariant[]> {
  const response = await apiRequest<ApiResponse<ProductVariant[]>>(
    `/products/${encodeURIComponent(productId)}/variants`,
  );
  if (!response.success) throw new Error("Failed to fetch product variants");
  return response.data;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const response = await apiRequest<ApiResponse<Product>>("/products", {
    method: "POST",
    body: input,
  });
  if (!response.success) throw new Error("Failed to create product");
  return response.data;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const response = await apiRequest<ApiResponse<Product>>(
    `/products/${encodeURIComponent(id)}`,
    { method: "PUT", body: input },
  );
  if (!response.success) throw new Error("Failed to update product");
  return response.data;
}

export async function deleteProduct(
  id: string,
): Promise<DeleteProductResponse<Product>> {
  const response = await apiRequest<DeleteProductResponse<Product>>(
    `/products/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!response.success) throw new Error("Failed to delete product");
  return response;
}

export async function getProductVariantById(
  id: string,
): Promise<ProductVariant> {
  const response = await apiRequest<ApiResponse<ProductVariant>>(
    `/product-variants/${encodeURIComponent(id)}`,
  );
  if (!response.success) throw new Error("Failed to fetch product variant");
  return response.data;
}

export async function getProductVariantBySku(
  sku: string,
): Promise<ProductVariant> {
  const response = await apiRequest<ApiResponse<ProductVariant>>(
    `/product-variants/sku/${encodeURIComponent(sku)}`,
  );
  if (!response.success) throw new Error("Failed to fetch product variant");
  return response.data;
}

export async function createProductVariant(
  input: CreateProductVariantInput,
): Promise<ProductVariant> {
  const response = await apiRequest<ApiResponse<ProductVariant>>(
    "/product-variants",
    { method: "POST", body: input },
  );
  if (!response.success) throw new Error("Failed to create product variant");
  return response.data;
}

export async function updateProductVariant(
  id: string,
  input: UpdateProductVariantInput,
): Promise<ProductVariant> {
  const response = await apiRequest<ApiResponse<ProductVariant>>(
    `/product-variants/${encodeURIComponent(id)}`,
    { method: "PUT", body: input },
  );
  if (!response.success) throw new Error("Failed to update product variant");
  return response.data;
}

export async function deleteProductVariant(
  id: string,
): Promise<ProductVariant> {
  const response = await apiRequest<ApiResponse<ProductVariant>>(
    `/product-variants/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!response.success) throw new Error("Failed to delete product variant");
  return response.data;
}
