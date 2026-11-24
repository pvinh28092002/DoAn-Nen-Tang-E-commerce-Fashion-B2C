import { useState } from "react";
import type { Order, UpdateOrderStatusInput } from "../types";
import { nextOrderStatuses, nextPaymentStatuses } from "../status-rules";
import { formatPrice } from "../../../lib/format-price";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, input: UpdateOrderStatusInput) => Promise<Order>;
}

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function saveStatus(input: UpdateOrderStatusInput) {
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      await onUpdateStatus(order.id, input);
      setNotice("Status updated successfully.");
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update order status.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const availableOrderStatuses = nextOrderStatuses[order.status];
  const availablePaymentStatuses = nextPaymentStatuses[order.paymentStatus];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="order-detail-title" className="text-xl font-semibold">
              Order details
            </h2>
            <p className="mt-1 break-all text-sm text-gray-500">
              Order ID: {order.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="rounded-md px-2 py-1 text-xl leading-none text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Customer</dt>
            <dd className="mt-1 font-medium">{order.recipient}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd className="mt-1 font-medium">{order.phone}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-500">Delivery address</dt>
            <dd className="mt-1 font-medium">
              {[order.address, order.ward, order.district, order.city]
                .filter(Boolean)
                .join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Order status</dt>
            <dd className="mt-1 font-medium">
              {order.status.replaceAll("_", " ")}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment</dt>
            <dd className="mt-1 font-medium">
              {order.payment
                ? `${order.payment.method.replaceAll("_", " ")} · ${order.paymentStatus}`
                : "Payment record unavailable"}
            </dd>
          </div>
        </dl>

        <section
          aria-labelledby="order-status-title"
          className="mt-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsEditingStatus((editing) => !editing)}
              disabled={isSaving || order.status === "CANCELLED"}
              className="rounded-md border border-gray-300 px-3 py-2 w-full text-sm font-medium  text-white bg-black hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditingStatus ? "Done" : "Update status"}
            </button>
          </div>

          {isEditingStatus && order.status !== "CANCELLED" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-gray-600">Order status</span>
                <select
                  value={order.status}
                  onChange={(event) =>
                    void saveStatus({
                      orderStatus: event.target.value as NonNullable<
                        UpdateOrderStatusInput["orderStatus"]
                      >,
                    })
                  }
                  disabled={isSaving || availableOrderStatuses.length === 0}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 disabled:bg-gray-100"
                >
                  <option value={order.status}>
                    {order.status.replaceAll("_", " ")}
                  </option>
                  {availableOrderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              {order.payment ? (
                <label className="text-sm">
                  <span className="mb-1 block text-gray-600">
                    Payment status
                  </span>
                  <select
                    value={order.paymentStatus}
                    onChange={(event) =>
                      void saveStatus({
                        paymentStatus: event.target
                          .value as Order["paymentStatus"],
                      })
                    }
                    disabled={isSaving || availablePaymentStatuses.length === 0}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 disabled:bg-gray-100"
                  >
                    <option value={order.paymentStatus}>
                      {order.paymentStatus.replaceAll("_", " ")}
                    </option>
                    {availablePaymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="self-center text-sm text-gray-500">
                  Payment status unavailable because this order has no payment
                  record.
                </p>
              )}
            </div>
          )}

          {order.status === "CANCELLED" && (
            <p className="text-sm text-gray-500">
              Status changes are unavailable for cancelled orders.
            </p>
          )}
          {isEditingStatus &&
            order.status !== "CANCELLED" &&
            availableOrderStatuses.length === 0 &&
            availablePaymentStatuses.length === 0 && (
              <p className="text-sm text-gray-500">
                No further status changes are available.
              </p>
            )}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="text-sm text-green-700">
              {notice}
            </p>
          )}
        </section>

        <section aria-labelledby="order-items-title" className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 id="order-items-title" className="font-semibold">
              Items
            </h3>
            <span className="text-sm text-gray-500">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {order.items.length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-center text-sm text-gray-500">
              No items were included in this order.
            </p>
          ) : (
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">
                        {item.productName}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Size: {item.size || "Not specified"} · Color:{" "}
                        {item.color || "Not specified"}
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-gray-500">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        {formatPrice(item.price)} each
                      </p>
                      <p className="mt-1 text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm">
                    <span className="text-gray-500">Line total</span>
                    <span className="font-semibold">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between rounded-md bg-gray-50 p-4">
          <span className="font-medium text-gray-700">Order total</span>
          <span className="text-lg font-semibold">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md  px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Close"}
          </button>
        </div>
      </section>
    </div>
  );
}
