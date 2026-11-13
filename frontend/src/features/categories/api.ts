import { apiRequest } from "../../lib/api-client";
import type { ApiResponse, Category, CategoryInput } from "./types";

export async function getCategories(): Promise<Category[]> {
  const response = await apiRequest<ApiResponse<Category[]>>("/categories");
  return response.data;
}

export async function getCategoryById(id: string): Promise<Category> {
  const response = await apiRequest<ApiResponse<Category>>(`/categories/${id}`);
  return response.data;
}

export async function createCategory(data: CategoryInput): Promise<Category> {
  const response = await apiRequest<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: data,
  });
  return response.data;
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryInput>,
): Promise<Category> {
  const response = await apiRequest<ApiResponse<Category>>(
    `/categories/${id}`,
    {
      method: "PUT",
      body: data,
    },
  );
  return response.data;
}

export async function deleteCategory(id: string): Promise<Category> {
  const response = await apiRequest<ApiResponse<Category>>(
    `/categories/${id}`,
    {
      method: "DELETE",
    },
  );
  return response.data;
}
