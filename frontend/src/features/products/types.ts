export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface ProductVariant {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  price: string;
  sku: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
