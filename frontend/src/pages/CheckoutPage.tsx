import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";

import { getCurrentCart } from "../features/carts/api";
import type { CartItem } from "../features/carts/types";

import { getUserAddresses } from "../features/users/api";
import type { Address } from "../features/users/types";

import { checkout } from "../features/orders/api";
import type { CheckoutRequest } from "../features/orders/types";

import CheckoutForm from "../features/orders/components/CheckoutForm";
import OrderSummary from "../features/orders/components/OrderSummary";

function CheckoutSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section className="space-y-5">
          <div className="h-6 w-48 bg-neutral-200" />
          <div className="h-12 w-full bg-neutral-200" />
          <div className="h-12 w-full bg-neutral-200" />
          <div className="h-12 w-full bg-neutral-200" />
          <div className="h-12 w-full bg-neutral-200" />
        </section>

        <section className="space-y-5">
          <div className="h-6 w-40 bg-neutral-200" />
          <div className="h-16 w-full bg-neutral-200" />
          <div className="h-16 w-full bg-neutral-200" />
        </section>
      </div>

      <div className="h-80 space-y-5 border p-6">
        <div className="h-6 w-1/2 bg-neutral-200" />
        <div className="h-16 w-full bg-neutral-200" />
        <div className="h-4 w-full bg-neutral-200" />
        <div className="h-4 w-full bg-neutral-200" />
        <div className="h-12 w-full bg-neutral-200" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCheckoutData() {
      try {
        setIsLoading(true);
        setError(null);

        const [cart, userAddresses] = await Promise.all([
          getCurrentCart(),
          getUserAddresses(),
        ]);

        if (isActive) {
          setCartItems(cart);
          setAddresses(userAddresses);
        }
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load checkout information.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCheckoutData();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleCheckout(data: CheckoutRequest) {
    try {
      setIsSubmitting(true);
      setError(null);

      const order = await checkout(data);

      navigate(`/orders/${order.id}/success`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during checkout.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <Link
          to="/cart"
          className="mb-5 inline-block text-sm text-neutral-500 hover:text-black"
        >
          ← Back to cart
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Complete your delivery and payment information.
        </p>
      </div>

      {isLoading ? (
        <CheckoutSkeleton />
      ) : error && cartItems.length === 0 ? (
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
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-3 text-sm text-neutral-500">
            Add some products before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="mt-7 inline-block bg-black px-8 py-3 text-sm text-white hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <CheckoutForm
                addresses={addresses}
                onSubmit={handleCheckout}
                isSubmitting={isSubmitting}
              />
            </section>

            <aside className="h-fit lg:sticky lg:top-24">
              <OrderSummary items={cartItems} />
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
