import { useEffect, useState } from "react";
import { getAllOrdersAdmin } from "../../features/orders/api";
import OrderTable from "../../features/orders/components/OrderTable";
import OrderDetailModal from "../../features/orders/components/OrderDetailModal";
import type { Order } from "../../features/orders/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getAllOrdersAdmin()
      .then((data) => {
        if (isCurrent) {
          setOrders(
            [...data].sort(
              (first, second) =>
                new Date(second.createdAt).getTime() -
                new Date(first.createdAt).getTime(),
            ),
          );
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

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View orders placed in your store.
        </p>
      </header>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-gray-500" role="status">
          Loading orders...
        </p>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : (
        <OrderTable orders={orders} onView={setSelectedOrder} />
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </section>
  );
}
