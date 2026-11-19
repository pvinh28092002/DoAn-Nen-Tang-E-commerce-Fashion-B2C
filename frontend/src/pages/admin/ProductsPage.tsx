import { useEffect, useState } from "react";
import ProductTable from "../../features/products/components/ProductTable";
import {
  getProducts,
  deleteProduct,
} from "../../features/products/api";
import { getCategories } from "../../features/categories/api";
import type { Product } from "../../features/products/types";
import type { Category } from "../../features/categories/types";
import ProductCreationModal from "../../features/products/components/ProductCreationModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    try {
      setError(null);
      await deleteProduct(product.id);
      await fetchData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete product",
      );
    }
  };

  const handleEdit = (product: Product) => {
    // We'll implement the edit form next.
    console.log("Edit product:", product);
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your store products and variants.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
          onClick={() => setShowForm(true)}
        >
          Add Product
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}
      {showForm && (
        <ProductCreationModal
          categories={categories}
          onClose={(productCreated) => {
            setShowForm(false);
            if (productCreated) void fetchData();
          }}
        />
      )}
      <ProductTable
        products={products}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
