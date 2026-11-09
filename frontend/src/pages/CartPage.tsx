import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";

import { getCurrentCart } from "../features/carts/api";
import type { CartItem } from "../features/carts/types";
import CartItemCard from "../features/carts/components/CartItemCard";
import { formatPrice } from "../lib/format-price";

function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-3 animate-pulse">
      <div className="space-y-5 lg:col-span-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-5 border-b pb-6">
            <div className="h-32 w-28 shrink-0 bg-neutral-200" />
            <div className="flex-1 space-y-4 py-2">
              <div className="h-4 w-2/3 bg-neutral-200" />
              <div className="h-3 w-1/3 bg-neutral-200" />
              <div className="h-4 w-1/4 bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-64 space-y-5 border p-6">
        <div className="h-5 w-1/2 bg-neutral-200" />
        <div className="h-4 w-full bg-neutral-200" />
        <div className="h-4 w-full bg-neutral-200" />
        <div className="h-12 w-full bg-neutral-200" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleItemRemoved = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleQuantityChanged = (itemId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.variant.price) * item.quantity,
    0,
  );

  const itemsCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  const shippingFee = 90000;
  const total = subtotal + shippingFee;

  useEffect(() => {
    let isActive = true;

    async function loadCart() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getCurrentCart();

        if (isActive) {
          setCartItems(result);
        }
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your cart.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
      </div>

      {isLoading ? (
        <CartSkeleton />
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 border border-black px-6 py-3 text-sm"
          >
            Try again
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="mt-3 text-sm text-neutral-500">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="mt-7 inline-block bg-black px-8 py-3 text-sm text-white transition hover:bg-neutral-800"
          >
            Explore products
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <p className="text-sm text-neutral-500">
              {itemsCount} {itemsCount === 1 ? "item" : "items"}
            </p>
            <Link
              to="/products"
              className="text-sm underline underline-offset-4 hover:text-neutral-500"
            >
              Continue shopping
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <section className="space-y-2 lg:col-span-2">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemoveSuccess={handleItemRemoved}
                  onQuantityChangeSuccess={handleQuantityChanged}
                />
              ))}
            </section>

            <aside className="h-fit border border-neutral-200 p-6 lg:sticky lg:top-24">
              <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Items ({itemsCount})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping fee</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                disabled={cartItems.length === 0}
                className="mt-7 w-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
              </button>

              <p className="mt-4 text-center text-xs text-neutral-400">
                Shipping fee is calculated at checkout.
              </p>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
