import type { ProductStatus, ProductVariant } from "../products/types";

export type CartProductVariant = ProductVariant & {
  product?: { name: string; status: ProductStatus };
};

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
  variant: CartProductVariant;
}

export interface AddCartItem {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItem{
    variantId: string;
  quantity: number;

}

export interface ClearCartResult {
  count: number;
}
