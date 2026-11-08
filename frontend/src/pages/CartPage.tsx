import { useState, useEffect } from "react";
import { getCurrentCart } from "../features/carts/api";
import type { CartItem } from "../features/carts/types";
import CartItemCard from "../features/carts/components/CartItemCard";
import { formatPrice } from "../lib/format-price";
import { useNavigate } from "react-router";
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
      } catch (error: unknown) {
        if (isActive) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading cart items.",
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

  if (isLoading) return <p className="text-neutral-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (cartItems.length === 0) return <p>Your cart is empty.</p>;
  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3 mx-4 md:mx-8 lg:mx-16 xl:mx-32">
        <div className="cart-item-list col-span-2">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onRemoveSuccess={handleItemRemoved}
              onQuantityChangeSuccess={handleQuantityChanged}
            />
          ))}
        </div>

        <div className="cart-summary border p-6 h-fit lg:sticky lg:top-24">
          <p>Total items: {itemsCount}</p>
          <p>Shipping Fee: {formatPrice(shippingFee)}</p>
          <p>Subtotal: {formatPrice(subtotal)}</p>
          <div className="divider h-0.5 w-full px-4 bg-black "></div>
          <p>Total: {formatPrice(subtotal + shippingFee)}</p>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-black text-white w-full p-4"
          >
            Check out
          </button>
        </div>
      </div>
    </>
  );
}
