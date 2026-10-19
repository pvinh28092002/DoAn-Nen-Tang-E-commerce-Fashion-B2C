import type { Product } from "./types";

export function getProductThumbnail(product: Product): string | null {
  return (
    product.variants
      .flatMap((variant) => variant.images)
      .find((url) => url.trim().length > 0) ?? null
  );
}

export function getProductPrice(product: Product): number | null {
  const prices = product.variants
    .filter((variant) => variant.stockQuantity > 0)
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  return prices.length > 0 ? Math.min(...prices) : null;
}

export function formatPrice(value: string | number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
