import { useState } from "react";
import type { Product } from "../types";
import { getProductThumbnail, getProductPrice, formatPrice } from "../utils";
import { Link } from "react-router";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageThumbnailUrl = getProductThumbnail(product);
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = imageThumbnailUrl !== null && !imageFailed;
  const price = getProductPrice(product);

  // Add ImageKit transformations before the image path.
  const optimizedImageUrl = imageThumbnailUrl
    ? `${imageThumbnailUrl}?tr=w-600,q-80,f-auto`
    : null;

  return (
    <article className="group">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
          {showImage && optimizedImageUrl ? (
            <img
              src={optimizedImageUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <div className="text-center">
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  VINH.
                </span>
                <p className="mt-3 text-sm text-neutral-500">
                  Product image coming soon
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <p className="text-xs text-neutral-500">
            {product.status === "ACTIVE" ? "Available" : "Unavailable"}
          </p>

          <h2 className="mt-1 font-medium tracking-tight">{product.name}</h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
            {product.description || "Discover this piece from our collection."}
          </p>

          <p className="mt-3 text-sm font-medium">
            {price !== null ? formatPrice(price) : "Currently unavailable"}
          </p>
        </div>
      </Link>
    </article>
  );
}
