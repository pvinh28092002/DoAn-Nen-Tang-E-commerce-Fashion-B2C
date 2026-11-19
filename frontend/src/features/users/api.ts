import { apiRequest } from "../../lib/api-client";
import type {
  Address,
  AdminUser,
  ApiResponse,
  CreateAddressInput,
  UpdateAddressInput,
  UpdateUserInput,
} from "./types";

export async function getUserAddresses(): Promise<Address[]> {
  const response = await apiRequest<ApiResponse<Address[]>>(
    "/users/me/addresses",
  );

  if (!response.success) {
    throw new Error("Failed to fetch addresses");
  }

  return response.data;
}

export async function createUserAddress(
  input: CreateAddressInput,
): Promise<Address> {
  const response = await apiRequest<ApiResponse<Address>>(
    "/users/me/addresses",
    { method: "POST", body: input },
  );
  if (!response.success) throw new Error("Failed to create address");
  return response.data;
}

export async function updateUserAddress(
  addressId: string,
  input: UpdateAddressInput,
): Promise<Address> {
  const response = await apiRequest<ApiResponse<Address>>(
    `/users/me/addresses/${encodeURIComponent(addressId)}`,
    { method: "PUT", body: input },
  );
  if (!response.success) throw new Error("Failed to update address");
  return response.data;
}

export async function deleteUserAddress(addressId: string): Promise<Address> {
  const response = await apiRequest<ApiResponse<Address>>(
    `/users/me/addresses/${encodeURIComponent(addressId)}`,
    { method: "DELETE" },
  );
  if (!response.success) throw new Error("Failed to delete address");
  return response.data;
}

export async function getUsers(): Promise<AdminUser[]> {
  const response = await apiRequest<ApiResponse<AdminUser[]>>("/users");
  if (!response.success) throw new Error("Failed to fetch users");
  return response.data;
}

export async function getUserById(id: string): Promise<AdminUser> {
  const response = await apiRequest<ApiResponse<AdminUser>>(
    `/users/${encodeURIComponent(id)}`,
  );
  if (!response.success) throw new Error("Failed to fetch user");
  return response.data;
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<AdminUser> {
  const response = await apiRequest<ApiResponse<AdminUser>>(
    `/users/${encodeURIComponent(id)}`,
    { method: "PUT", body: input },
  );
  if (!response.success) throw new Error("Failed to update user");
  return response.data;
}

export async function deleteUser(id: string): Promise<AdminUser> {
  const response = await apiRequest<ApiResponse<AdminUser>>(
    `/users/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!response.success) throw new Error("Failed to delete user");
  return response.data;
}
