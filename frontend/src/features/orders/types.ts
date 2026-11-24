export type PaymentMethod = "COD" | "BANK_TRANSFER";
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface UpdateOrderStatusInput {
  orderStatus?: Exclude<OrderStatus, "CANCELLED">;
  paymentStatus?: PaymentStatus;
}

export interface DeliveryAddress {
  recipient: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface SavedAddress extends DeliveryAddress {
  id: string;
  isDefault: boolean;
}

export type CheckoutRequest =
  | {
      paymentMethod: PaymentMethod;
      addressId: string;
    }
  | {
      paymentMethod: PaymentMethod;
      address: DeliveryAddress;
      saveAddress?: boolean;
    };

export interface CheckoutFormData {
  addressId?: string;
  address?: DeliveryAddress;
  paymentMethod: PaymentMethod;
  saveAddress?: boolean;
}

export interface OrderItem {
  id: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  sku: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  items: OrderItem[];
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
  } | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
