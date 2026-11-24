export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface ProductVariant {
  id: string;
  productId: string;
  isActive: boolean;
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

/** Payload accepted by POST /products. */
export interface CreateProductInput {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  status?: ProductStatus;
}

/** Payload accepted by PUT /products/:id. */
export type UpdateProductInput = Partial<CreateProductInput>;

/** API accepts `stock`; responses expose the database field `stockQuantity`. */
export interface CreateProductVariantInput {
  productId: string;
  price: number;
  stock: number;
  sku: string;
  size?: string;
  color?: string;
  images?: string[];
}

/** Payload accepted by PUT /product-variants/:id. */
export type UpdateProductVariantInput = Partial<
  Omit<CreateProductVariantInput, "productId">
> & { isActive?: boolean };

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
