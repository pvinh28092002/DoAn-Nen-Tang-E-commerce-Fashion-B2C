import { apiRequest } from "../../lib/api-client";
import type {
  ApiResponse,
  AdminOrdersQuery,
  CheckoutRequest,
  Order,
  PaginatedResult,
  UpdateOrderStatusInput,
} from "./types";

export async function checkout(data: CheckoutRequest): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>("/orders/checkout", {
    method: "POST",
    body: data,
  });

  if (!response.success) {
    throw new Error("Failed to create order");
  }

  return response.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>(`/orders/${id}`);

  if (!response.success) {
    throw new Error("Failed to fetch order");
  }

  return response.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiRequest<ApiResponse<Order[]>>("/orders");
  if (!response.success) throw new Error("Failed to fetch orders");
  return response.data;
}

export async function cancelOrder(id: string): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>(
    `/orders/${encodeURIComponent(id)}/cancel`,
    { method: "POST" },
  );
  if (!response.success) throw new Error("Failed to cancel order");
  return response.data;
}

//Admin
export async function getAllOrdersAdmin(
  query: AdminOrdersQuery,
): Promise<PaginatedResult<Order>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.status) params.set("status", query.status);
  if (query.paymentStatus) params.set("paymentStatus", query.paymentStatus);

  const response = await apiRequest<ApiResponse<PaginatedResult<Order>>>(
    `/orders/admin/all?${params.toString()}`,
  );
  if (!response.success) throw new Error("Failed to fetch all orders");
  return response.data;
}

export async function updateOrderStatusAdmin(
  id: string,
  input: UpdateOrderStatusInput,
): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>(
    `/orders/admin/${encodeURIComponent(id)}/status`,
    { method: "PATCH", body: input },
  );
  if (!response.success) throw new Error("Failed to update order status");
  return response.data;
}
