import type { Order } from "../types";
import { formatPrice } from "../../../lib/format-price";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="order-detail-title" className="text-xl font-semibold">Order details</h2>
            <p className="mt-1 break-all text-sm text-gray-500">Order ID: {order.id}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close order details" className="rounded-md px-2 py-1 text-xl leading-none text-gray-500 hover:bg-gray-100">×</button>
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
          <div>
            <dt className="text-gray-500">Order status</dt>
            <dd className="mt-1 font-medium">{order.status.replaceAll("_", " ")}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment</dt>
            <dd className="mt-1 font-medium">
              {order.payment
                ? `${order.payment.method.replaceAll("_", " ")} · ${order.paymentStatus}`
                : "Payment record unavailable"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-500">Delivery address</dt>
            <dd className="mt-1 font-medium">
              {[order.address, order.ward, order.district, order.city].filter(Boolean).join(", ")}
            </dd>
          </div>
        </dl>

        <section aria-labelledby="order-items-title" className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 id="order-items-title" className="font-semibold">Items</h3>
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
                <li key={item.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Size: {item.size || "Not specified"} · Color: {item.color || "Not specified"}
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{formatPrice(item.price)} each</p>
                      <p className="mt-1 text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm">
                    <span className="text-gray-500">Line total</span>
                    <span className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between rounded-md bg-gray-50 p-4">
          <span className="font-medium text-gray-700">Order total</span>
          <span className="text-lg font-semibold">{formatPrice(order.totalAmount)}</span>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Close</button>
        </div>
      </section>
    </div>
  );
}
