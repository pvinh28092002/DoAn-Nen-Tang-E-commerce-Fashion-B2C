export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}