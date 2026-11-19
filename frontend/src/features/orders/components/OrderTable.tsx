import type { Order, OrderStatus, PaymentStatus } from "../types";
import { formatPrice } from "../../../lib/format-price";

interface OrderTableProps {
  orders: Order[];
  onView: (order: Order) => void;
}

const orderStatusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-violet-100 text-violet-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
};

function formatLabel(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}

export default function OrderTable({ orders, onView }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-12 text-center">
        <h2 className="font-medium text-gray-900">No orders yet</h2>
        <p className="mt-1 text-sm text-gray-500">New customer orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3">Order</th>
            <th scope="col" className="px-4 py-3">Customer</th>
            <th scope="col" className="px-4 py-3">Items</th>
            <th scope="col" className="px-4 py-3">Total</th>
            <th scope="col" className="px-4 py-3">Payment</th>
            <th scope="col" className="px-4 py-3">Order status</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="align-top hover:bg-gray-50">
              <th scope="row" className="px-4 py-4 font-medium text-gray-900">
                <span className="block" title={order.id}>#{order.id.slice(-8).toUpperCase()}</span>
                <span className="mt-1 block font-normal text-gray-500">{formatDate(order.createdAt)}</span>
              </th>
              <td className="px-4 py-4">
                <span className="block font-medium text-gray-900">{order.recipient}</span>
                <span className="mt-1 block text-gray-500">{order.phone}</span>
              </td>
              <td className="px-4 py-4">{order.items.length}</td>
              <td className="whitespace-nowrap px-4 py-4 font-medium">{formatPrice(order.totalAmount)}</td>
              <td className="px-4 py-4">
                <span className="block">{order.payment ? formatLabel(order.payment.method) : "Unknown method"}</span>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${paymentStatusStyles[order.paymentStatus]}`}>
                  {formatLabel(order.paymentStatus)}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${orderStatusStyles[order.status]}`}>
                  {formatLabel(order.status)}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <button type="button" onClick={() => onView(order)} className="font-medium text-blue-700 hover:underline">
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
