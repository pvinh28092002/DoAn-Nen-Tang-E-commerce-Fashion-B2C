export interface Address {
  id: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  recipient: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
}

export type UpdateAddressInput = Partial<CreateAddressInput>;

export type UserRole = "CUSTOMER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UpdateUserInput = Partial<Pick<AdminUser, "name" | "email" | "role">>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
