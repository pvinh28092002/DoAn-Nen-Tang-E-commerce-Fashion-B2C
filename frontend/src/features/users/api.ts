import { apiRequest } from "../../lib/api-client";
import type { Address, ApiResponse } from "./types";

export async function getUserAddresses(): Promise<Address[]> {
  const response = await apiRequest<ApiResponse<Address[]>>(
    "/users/me/addresses",
  );

  if (!response.success) {
    throw new Error("Failed to fetch addresses");
  }

  return response.data;
}