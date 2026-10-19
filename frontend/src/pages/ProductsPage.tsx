import { useEffect, useState } from "react";
import { getProducts } from "../features/products/api";
import type { Product } from "../features/products/types";
import ProductCard from "../features/products/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProducts();

        if (isActive) {
          setProducts(result);
        }
      } catch (error: unknown) {
        if (isActive) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading products.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10 border-b border-neutral-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          The collection
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              All products
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Explore everyday essentials and timeless pieces from our
              collection.
            </p>
          </div>

          {!isLoading && !error && (
            <p className="text-sm text-neutral-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
          aria-label="Loading products"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index}>
              <div className="aspect-[4/5] animate-pulse bg-neutral-100" />
              <div className="mt-4 h-3 w-1/3 animate-pulse bg-neutral-100" />
              <div className="mt-3 h-4 w-2/3 animate-pulse bg-neutral-100" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="border border-red-200 bg-red-50 px-6 py-8">
          <h2 className="font-medium text-red-900">Unable to load products</h2>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 border border-red-300 px-5 py-2 text-sm font-medium text-red-900 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="font-display text-2xl font-semibold">
            No products yet
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            Check back soon for our latest collection.
          </p>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
