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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
