// src/features/cart/components/CartItemCard.tsx
import type { CartItem } from "../types";
import { formatPrice } from "../../../lib/format-price";
import { deleteCartItem, updateCartItem } from "../api";
import { useState } from "react";
interface CartItemCardProps {
  item: CartItem;
  onRemoveSuccess: (itemId: string) => void;
  onQuantityChangeSuccess: (itemId: string, newQuantity: number) => void;
}

export default function CartItemCard({
  item,
  onRemoveSuccess,
  onQuantityChangeSuccess,
}: CartItemCardProps) {
  const { variant, quantity } = item;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUrl = variant.images[0]
    ? `${variant.images[0]}?tr=w-300,q-80,f-auto`
    : null;

  const unitPrice = Number(variant.price);
  const lineTotal = unitPrice * quantity;
  const reachesStockLimit = quantity >= variant.stockQuantity;

  async function handleRemoveItem() {
    try {
      setIsSubmitting(true);
      setError(null);
      await deleteCartItem(variant.id);
      onRemoveSuccess(item.id);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Could not remove cart item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateItemQuantity(newQuantity: number) {
    if (newQuantity < 1) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await updateCartItem({
        variantId: variant.id,
        quantity: newQuantity,
      });
      onQuantityChangeSuccess(item.id, newQuantity);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Could not remove to cart in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="flex gap-4 border-b border-neutral-200 py-6">
      {/* Image */}
      <div className="h-32 w-24 shrink-0 overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${variant.color} ${variant.size}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              VINH.
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div>
            {/* Later: show the product name here once the backend sends it */}
            <h3 className="font-medium tracking-tight">
              {variant.color} / {variant.size}
            </h3>
            <p className="mt-1 text-xs text-neutral-500">SKU: {variant.sku}</p>
            <p className="mt-1 text-sm text-neutral-500">
              {formatPrice(unitPrice)}
            </p>
          </div>

          <p className="text-sm font-medium">{formatPrice(lineTotal)}</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            {/* Quantity stepper */}
            <div className="inline-flex items-center border border-neutral-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || isSubmitting}
                className="h-9 w-9 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
                onClick={() => {
                  handleUpdateItemQuantity(quantity - 1);
                }}
              >
                −
              </button>

              <input
                type="number"
                aria-label="Quantity"
                value={quantity}
                readOnly
                className="h-9 w-12 border-x border-neutral-300 text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <button
                type="button"
                aria-label="Increase quantity"
                className="h-9 w-9 text-neutral-700 hover:bg-neutral-100"
                onClick={() => {
                  handleUpdateItemQuantity(quantity + 1);
                }}
                disabled={reachesStockLimit || isSubmitting}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="text-sm text-neutral-500 underline hover:text-neutral-900"
              onClick={handleRemoveItem}
              disabled={isSubmitting}
            >
              Remove
            </button>
          </div>

          {reachesStockLimit && (
            <p className="mt-2 text-xs text-red-600">
              Maximum available quantity reached.
            </p>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </article>
  );
}
