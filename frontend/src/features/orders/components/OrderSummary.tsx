import type { CartItem } from "../../carts/types";
import { formatPrice } from "../../../lib/format-price";

interface OrderSummaryProps {
  items: CartItem[];
}

const SHIPPING_FEE = 90000;

export default function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce(
    (total, item) => total + Number(item.variant.price) * item.quantity,
    0,
  );

  const total = subtotal + SHIPPING_FEE;

  return (
    <section className="h-fit border p-6 lg:sticky lg:top-24">
      <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <div>
              <p className="font-medium">
                {item.variant.color} / {item.variant.size}
              </p>
              <p className="text-neutral-500">Quantity: {item.quantity}</p>
            </div>

            <p className="shrink-0">
              {formatPrice(Number(item.variant.price) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="my-6 border-t" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">Shipping Fee</span>
          <span>{formatPrice(SHIPPING_FEE)}</span>
        </div>
      </div>

      <div className="my-6 border-t" />

      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </section>
  );
}
