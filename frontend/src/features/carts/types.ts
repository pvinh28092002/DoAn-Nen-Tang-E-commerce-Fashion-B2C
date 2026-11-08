import type { ProductVariant } from "../products/types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  variant: ProductVariant;
}

export interface AddCartItem {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItem{
    variantId: string;
  quantity: number;

}