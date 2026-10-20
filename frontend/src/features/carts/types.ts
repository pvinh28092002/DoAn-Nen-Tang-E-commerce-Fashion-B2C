export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CartItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cartId: string;
  variantId: string;
  quantity: number;
}
