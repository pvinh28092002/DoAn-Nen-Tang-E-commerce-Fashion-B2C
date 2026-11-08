import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductById } from "../features/products/api";
import type { Product } from "../features/products/types";
import PdpDetail from "../features/products/components/PdpDescription.tsx";
import { formatPrice } from "../lib/format-price";
import { getProductImages } from "../features/products/utils";
//  interface ProductVariant {
//   id: string;
//   productId: string;
//   size: string | null;
//   color: string | null;
//   price: string;
//   sku: string;
//   stockQuantity: number;
//   images: string[];
//   createdAt: string;
//   updatedAt: string;
// }

//  interface Product {
//   id: string;
//   categoryId: string;
//   name: string;
//   slug: string;
//   description: string | null;
//   status: ProductStatus;
//   createdAt: string;
//   updatedAt: string;
//   variants: ProductVariant[];
// }

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

  const productImages = product?.variants.flatMap((variant) => variant.images);

  if (isLoading) return <p className="text-neutral-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="grid gap-12 lg:grid-cols-2 mx-32">
      {/* LEFT: images */}
      <div className="space-y-4">
        {productImages?.map((imageUrl, index) => (
          <div key={index} className="aspect-[3/4]  overflow-hidden ">
            <img
              src={imageUrl + `?tr=w-900,q-80,f-auto`}
              alt={`Product image ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      {/* RIGHT: product info */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <PdpDetail product={product} />
      </div>
    </div>
  );
}
