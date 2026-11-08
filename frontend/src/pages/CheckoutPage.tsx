import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getCurrentCart } from "../features/carts/api";
import type { CartItem } from "../features/carts/types";

import { getUserAddresses } from "../features/users/api";
import type { Address } from "../features/users/types";

import { checkout } from "../features/orders/api";
import type { CheckoutRequest } from "../features/orders/types";

import CheckoutForm from "../features/orders/components/CheckoutForm";
import OrderSummary from "../features/orders/components/OrderSummary";

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

  if (isLoading) {
    return <p className="p-8 text-neutral-500">Loading checkout...</p>;
  }

  if (error && cartItems.length === 0) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-neutral-500">
          Add some products before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <main className="mx-4 py-10 md:mx-8 lg:mx-16 xl:mx-32">
      <h1 className="mb-8 text-2xl font-semibold">Checkout</h1>

      {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            addresses={addresses}
            onSubmit={handleCheckout}
            isSubmitting={isSubmitting}
          />
        </div>

        <OrderSummary items={cartItems} />
      </div>
    </main>
  );
}
