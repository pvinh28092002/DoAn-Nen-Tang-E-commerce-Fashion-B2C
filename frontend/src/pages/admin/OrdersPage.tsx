import { useEffect, useState } from "react";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../../features/orders/api";
import OrderTable from "../../features/orders/components/OrderTable";
import OrderDetailModal from "../../features/orders/components/OrderDetailModal";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  UpdateOrderStatusInput,
} from "../../features/orders/types";
import Pagination from "../../components/Pagination";

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
];

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const handleUpdateStatus = async (
    id: string,
    input: UpdateOrderStatusInput,
  ): Promise<Order> => {
    const updated = await updateOrderStatusAdmin(id, input);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
    setRefreshVersion((version) => version + 1);
    return updated;
  };

  useEffect(() => {
    let isCurrent = true;
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      getAllOrdersAdmin({
        page,
        pageSize,
        search,
        ...(orderStatus && { status: orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      })
        .then((result) => {
          if (isCurrent) {
            setTotalItems(result.totalItems);
            setOrders(result.items);
            if (result.totalPages > 0 && page > result.totalPages) {
              setPage(result.totalPages);
            } else if (result.totalPages === 0 && page !== 1) {
              setPage(1);
            }
          }
        })
        .catch((loadError: unknown) => {
          if (isCurrent) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Failed to load orders.",
            );
          }
        })
        .finally(() => {
          if (isCurrent) setIsLoading(false);
        });
    }, 300);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [page, pageSize, search, orderStatus, paymentStatus, refreshVersion]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View orders placed in your store.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="order-search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search orders
          </label>
          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Order ID, recipient, or phone"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="order-status-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Order status
          </label>
          <select
            id="order-status-filter"
            value={orderStatus}
            onChange={(event) => {
              setOrderStatus(event.target.value as OrderStatus | "");
              setPage(1);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="payment-status-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Payment status
          </label>
          <select
            id="payment-status-filter"
            value={paymentStatus}
            onChange={(event) => {
              setPaymentStatus(event.target.value as PaymentStatus | "");
              setPage(1);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All payment statuses</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-gray-500" role="status">
          Loading orders...
        </p>
      ) : error ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      ) : (
        <>
          <OrderTable
            orders={orders}
            onView={setSelectedOrder}
            emptyTitle={
              search || orderStatus || paymentStatus
                ? "No matching orders"
                : "No orders yet"
            }
            emptyMessage={
              search || orderStatus || paymentStatus
                ? "No orders match these filters."
                : "No orders yet. New customer orders will appear here."
            }
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
          />
        </>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </section>
  );
}
