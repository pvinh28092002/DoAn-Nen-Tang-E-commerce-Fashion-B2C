import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductTable from "../../features/products/components/ProductTable";
import { getAllProductsAdmin } from "../../features/products/api";
import { getCategories } from "../../features/categories/api";
import type { Product } from "../../features/products/types";
import type { Category } from "../../features/categories/types";
import ProductCreationModal from "../../features/products/components/ProductCreationModal";

export default function ProductsPage() {
  const navigate = useNavigate();
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
        getAllProductsAdmin(),
        getCategories(),
      ]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (loadError: unknown) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([getAllProductsAdmin(), getCategories()])
      .then(([productData, categoryData]) => {
        if (active) {
          setProducts(productData);
          setCategories(categoryData);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : "Failed to load products.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500">
            Manage products, variants, availability, and stock.
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
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
          <button type="button" onClick={() => void fetchData()} className="mt-2 underline">
            Try again
          </button>
        </div>
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
        onEdit={(product) => navigate(`/admin/products/${product.id}`)}
      />
    </div>
  );
}
