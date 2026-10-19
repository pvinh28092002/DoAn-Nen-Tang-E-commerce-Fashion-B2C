import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductById } from "../features/products/api";
import type { Product } from "../features/products/types";
import { formatPrice } from "../lib/format-price";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    const id = productId;
    let isActive = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProductById(id);

        if (isActive) setProduct(result);
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the product.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [productId]);

  if (isLoading) return <p className="text-neutral-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">{product.name}</h1>
      <p className="mt-2 text-neutral-500">{product.description}</p>

      <ul className="mt-6 space-y-2">
        {product.variants.map((v) => (
          <li key={v.id} className="flex justify-between border p-3">
            <span>
              {v.color} / {v.size}
            </span>
            <span>
              {formatPrice(v.price)}
              {v.stockQuantity === 0 && " (out of stock)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
