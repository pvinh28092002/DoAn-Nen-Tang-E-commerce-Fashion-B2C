import { useEffect, useState } from "react";
import type { Product } from "../types";
import { formatPrice } from "../utils";
import { createCartItem } from "../../carts/api";

interface ProductCardProps {
  product: Product;
}

const ProductSelector: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Get colors that have at least one in-stock variant.
  const availableColors = Array.from(
    new Set(
      product.variants
        .filter((variant) => variant.stockQuantity > 0)
        .map((variant) => variant.color)
        .filter((color): color is string => Boolean(color)),
    ),
  );

  // 2. Get sizes that are in stock for the selected color.
  const availableSizes = Array.from(
    new Set(
      product.variants
        .filter((variant) => variant.color === selectedColor)
        .filter((variant) => variant.stockQuantity > 0)
        .map((variant) => variant.size)
        .filter((size): size is string => Boolean(size)),
    ),
  );

  // 3. Find the matching variant.
  const activeVariant = product.variants.find(
    (variant) =>
      variant.color === selectedColor &&
      variant.size === selectedSize &&
      variant.stockQuantity > 0,
  );

  // 4. Set an initial color and size.
  useEffect(() => {
    const defaultOption = product.variants.find(
      (variant) => variant.stockQuantity > 0,
    );

    if (defaultOption) {
      setSelectedColor(defaultOption.color);
      setSelectedSize(defaultOption.size);
    } else {
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product]);

  // 5. Handle color selection.

  function handleColorChange(color: string) {
    const firstAvailableVariant = product.variants.find(
      (variant) => variant.color === color && variant.stockQuantity > 0,
    );

    setSelectedColor(color);
    setSelectedSize(firstAvailableVariant?.size ?? null);

    setError(null);
    setIsSuccess(false);
  }
  // 6. Handle adding the selected variant to cart.
  async function handleAddToCart() {
    if (!activeVariant) {
      setError("Please select an available color and size.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      await createCartItem({
        variantId: activeVariant.id,
        quantity: 1,
      });

      setIsSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Could not add item to cart.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {/* Price */}
      <p className="mt-2 text-neutral-500">
        {activeVariant ? formatPrice(activeVariant.price) : "Price unavailable"}
      </p>
      {/* Colors */}
      <div className="mb-4">
        <span className="block font-semibold mb-2">Available Colors:</span>

        <div className="flex gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              aria-pressed={selectedColor === color}
              className={`px-3 py-1 border rounded ${
                selectedColor === color
                  ? "border-black bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-4">
        <span className="block font-semibold mb-2">Available Sizes:</span>

        <div className="flex gap-2">
          {availableSizes.length > 0 ? (
            availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setError(null);
                  setIsSuccess(false);
                }}
                aria-pressed={selectedSize === size}
                className={`px-3 py-1 border rounded ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))
          ) : (
            <p className="text-sm text-neutral-500">
              No available sizes for this color.
            </p>
          )}
        </div>
      </div>

      {/* Current selection */}
      <div className="mb-4">
        <p className="font-semibold">Current selection:</p>

        {activeVariant ? (
          <p>
            {activeVariant.color} / {activeVariant.size}
          </p>
        ) : (
          <p className="text-neutral-500">Please select a color and size.</p>
        )}
      </div>

      {/* Add to cart */}
      <button
        type="button"
        disabled={isSubmitting || !activeVariant}
        onClick={handleAddToCart}
        className="px-5 py-3 bg-black text-white disabled:opacity-50"
      >
        {isSubmitting
          ? "Adding to cart..."
          : isSuccess
            ? "Added ✓"
            : "Add to cart"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default function PdpDetail({ product }: ProductCardProps) {
  const { name, description } = product;

  return (
    <div className="product-detail">
      <h1 className="text-2xl font-medium tracking-tight">{name}</h1>
      <p className="mt-2 text-neutral-500">{description}</p>
      <ProductSelector product={product} />
    </div>
  );
}
