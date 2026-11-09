import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getOrderById } from "../features/orders/api";
import type { Order } from "../features/orders/types";
import { formatPrice } from "../lib/format-price";

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let isActive = true;

    async function loadOrder() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getOrderById(orderId!);

        if (isActive) {
          setOrder(result);
        }
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your order.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      isActive = false;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-neutral-500">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-medium">Unable to load order</h1>
        <p className="mt-3 text-sm text-neutral-500">
          {error || "Order not found."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-neutral-900 px-6 py-3 text-sm text-white"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const shippingFee = Number(order.totalAmount) - subtotal;

  const orderDate = new Date(order.createdAt).toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Confirmation */}
      <section className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="text-3xl font-medium tracking-tight">
          Thank you for your order!
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          Your order has been placed successfully.
        </p>

        <p className="mt-4 text-sm">
          Order number: <span className="font-medium">{order.id}</span>
        </p>

        <p className="mt-1 text-xs text-neutral-400">{orderDate}</p>
      </section>

      {/* Order details */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Delivery information */}
        <section className="border border-neutral-200 p-6">
          <h2 className="mb-5 text-lg font-medium">Delivery information</h2>

          <div className="space-y-2 text-sm">
            <p className="font-medium">{order.recipient}</p>
            <p className="text-neutral-600">{order.phone}</p>
            <p className="text-neutral-600">{order.address}</p>
            <p className="text-neutral-600">
              {order.ward}, {order.district}, {order.city}
            </p>
          </div>
        </section>

        {/* Payment information */}
        <section className="border border-neutral-200 p-6">
          <h2 className="mb-5 text-lg font-medium">Payment information</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Payment method</span>
              <span className="font-medium">
                {order.payment.method === "COD"
                  ? "Cash on delivery"
                  : "Bank transfer"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Payment status</span>
              <span className="font-medium">{order.paymentStatus}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Order status</span>
              <span className="font-medium">{order.status}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Purchased items */}
      <section className="mt-10">
        <h2 className="mb-5 text-lg font-medium">Order summary</h2>

        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div>
                <p className="text-sm font-medium">{item.productName}</p>

                <p className="mt-1 text-xs text-neutral-500">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " · "}
                  {item.color && `Color: ${item.color}`}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="shrink-0 text-sm font-medium">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Shipping fee</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </section>

      {/* Continue shopping */}
      <div className="mt-12 text-center">
        <Link
          to="/products"
          className="inline-block bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
