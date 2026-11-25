import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductTable from "../../features/products/components/ProductTable";
import { getAllProductsAdmin } from "../../features/products/api";
import { getCategories } from "../../features/categories/api";
import type { Product, ProductStatus } from "../../features/products/types";
import type { Category } from "../../features/categories/types";
import ProductCreationModal from "../../features/products/components/ProductCreationModal";
import Pagination from "../../components/Pagination";

const productStatuses: ProductStatus[] = ["ACTIVE", "INACTIVE", "ARCHIVED"];

function formatStatus(value: ProductStatus) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [productsRefresh, setProductsRefresh] = useState(0);
  const [categoriesRefresh, setCategoriesRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((categoryData) => {
        if (active) {
          setCategories(categoryData);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setCategoriesError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load categories.",
          );
        }
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [categoriesRefresh]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      getAllProductsAdmin({
        page,
        pageSize,
        search,
        ...(categoryId && { categoryId }),
        ...(status && { status }),
      })
        .then((result) => {
          if (!active) return;
          setProducts(result.items);
          setTotalItems(result.totalItems);
          if (result.totalPages > 0 && page > result.totalPages) {
            setPage(result.totalPages);
          } else if (result.totalPages === 0 && page !== 1) {
            setPage(1);
          }
        })
        .catch((loadError: unknown) => {
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Failed to load products.",
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [page, pageSize, search, categoryId, status, productsRefresh]);

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
          disabled={categoriesLoading || categories.length === 0}
        >
          Add Product
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-gray-700">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Product name or slug"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="product-category-filter" className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="product-category-filter"
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setPage(1);
            }}
            disabled={categoriesLoading || categories.length === 0}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="product-status-filter" className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="product-status-filter"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ProductStatus | "");
              setPage(1);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {productStatuses.map((productStatus) => (
              <option key={productStatus} value={productStatus}>
                {formatStatus(productStatus)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categoriesError && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>{categoriesError}</p>
          <button
            type="button"
            onClick={() => {
              setCategoriesLoading(true);
              setCategoriesError(null);
              setCategoriesRefresh((refresh) => refresh + 1);
            }}
            className="mt-2 underline"
          >
            Try loading categories again
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setProductsRefresh((refresh) => refresh + 1)}
            className="mt-2 underline"
          >
            Try again
          </button>
        </div>
      )}
      {showForm && (
        <ProductCreationModal
          categories={categories}
          onClose={(productCreated) => {
            setShowForm(false);
            if (productCreated) {
              setProductsRefresh((refresh) => refresh + 1);
            }
          }}
        />
      )}
      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500" role="status">
          Loading products...
        </div>
      ) : error ? null : (
        <>
          <ProductTable
            products={products}
            categories={categories}
            onEdit={(product) => navigate(`/admin/products/${product.id}`)}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
