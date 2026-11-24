import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ProductInformationForm from "../../features/products/components/ProductInformationForm";
import ProductVariantEditor from "../../features/products/components/ProductVariantEditor";
import ProductVariantForm, { type ProductVariantFormData } from "../../features/products/components/ProductVariantForm";
import {
  createProductVariant,
  getProductByIdAdmin,
  updateProduct,
  updateProductVariant,
} from "../../features/products/api";
import { getCategories } from "../../features/categories/api";
import type { Category } from "../../features/categories/types";
import type {
  CreateProductInput,
  Product,
  UpdateProductVariantInput,
} from "../../features/products/types";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedProductId, setLoadedProductId] = useState<string | undefined>();
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) throw new Error("Product ID is missing.");
    const [productData, categoryData] = await Promise.all([
      getProductByIdAdmin(productId),
      getCategories(),
    ]);
    setProduct(productData);
    setCategories(categoryData);
  }, [productId]);

  useEffect(() => {
    let active = true;
    Promise.all([
      productId ? getProductByIdAdmin(productId) : Promise.reject(new Error("Product ID is missing.")),
      getCategories(),
    ])
      .then(([productData, categoryData]) => {
        if (active) {
          setProduct(productData);
          setCategories(categoryData);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load product.");
      })
      .finally(() => {
        if (active) {
          setLoadedProductId(productId);
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [productId]);

  async function handleProductSave(input: CreateProductInput) {
    if (!product) return;
    setError(null);
    setNotice(null);
    setIsSavingProduct(true);
    try {
      const updated = await updateProduct(product.id, input);
      setProduct((current) => current ? { ...current, ...updated } : current);
      setNotice("Product information saved.");
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save product information.");
    } finally {
      setIsSavingProduct(false);
    }
  }

  async function handleVariantSave(id: string, input: UpdateProductVariantInput) {
    const updated = await updateProductVariant(id, input);
    setProduct((current) => current
      ? { ...current, variants: current.variants.map((variant) => variant.id === id ? updated : variant) }
      : current);
    setNotice("Variant updated.");
    setError(null);
  }

  async function handleAddVariant(input: ProductVariantFormData): Promise<boolean> {
    if (!product) return false;
    const created = await createProductVariant({
      productId: product.id,
      sku: input.sku,
      size: input.size || undefined,
      color: input.color || undefined,
      price: input.price,
      stock: input.stock,
      images: input.images,
    });
    setProduct((current) => current ? { ...current, variants: [...current.variants, created] } : current);
    setNotice("Variant added.");
    setError(null);
    return true;
  }

  if (isLoading || loadedProductId !== productId) {
    return <p className="p-6 text-sm text-gray-500" role="status">Loading product...</p>;
  }

  if (error && !product) {
    return (
      <section className="space-y-4 p-6">
        <Link to="/admin/products" className="text-sm underline">Back to products</Link>
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>
        <button type="button" onClick={() => { setIsLoading(true); void loadProduct().catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Could not load product.")).finally(() => setIsLoading(false)); }} className="rounded-md border px-4 py-2 text-sm">Try again</button>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="space-y-8">
      <header>
        <Link to="/admin/products" className="text-sm text-gray-500 hover:text-black">← Products</Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Edit product</h1>
            <p className="mt-1 text-sm text-gray-500">Update product details, variant availability, and stock.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${product.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
            {product.status}
          </span>
        </div>
      </header>

      {(error || notice) && (
        <p role={error ? "alert" : "status"} className={`rounded-md p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {error ?? notice}
        </p>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold">Product information</h2>
        <ProductInformationForm
          key={product.id}
          categories={categories}
          initialValue={{
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            description: product.description ?? "",
            status: product.status,
          }}
          onSubmit={handleProductSave}
          onCancel={() => navigate("/admin/products")}
          isSubmitting={isSavingProduct}
          submitLabel="Save product"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Variants and stock</h2>
          <p className="mt-1 text-sm text-gray-500">
            Edit variant details, set stock to an absolute quantity, or deactivate a variant to hide it from shoppers.
          </p>
        </div>

        {product.variants.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">No variants yet.</p>
        ) : (
          <div className="space-y-3">
            {product.variants.map((variant) => (
              <ProductVariantEditor key={variant.id} variant={variant} onSave={handleVariantSave} />
            ))}
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
          <h3 className="mb-4 font-semibold">Add variant</h3>
          <ProductVariantForm onAdd={handleAddVariant} />
        </div>
      </section>
    </section>
  );
}
