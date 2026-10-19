import { apiRequest } from "../../lib/api-client";
import type {
  ApiResponse,
  User,
  UserProfile,
  RegisterUserInput,
  LoginUserInput,
  MessageResponse,
} from "./types";

export async function registerUser(data: RegisterUserInput): Promise<User> {
  const response = await apiRequest<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: data,
  });
  if (!response.success) {
    throw new Error("Failed to register");
  }
  return response.data;
}

export async function loginUser(data: LoginUserInput): Promise<User> {
  const response = await apiRequest<ApiResponse<User>>("/auth/login", {
    method: "POST",
    body: data,
  });
  if (!response.success) {
    throw new Error("Failed to login");
  }
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiRequest<ApiResponse<UserProfile>>("/users/me");
  if (!response.success) {
    throw new Error("Failed to get current user");
  }
  return response.data;
}

export async function logOutUser() {
  const response = await apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
  });
  if (!response.success) {
    throw new Error("Failed to logout");
  }
  return response.message;
}
