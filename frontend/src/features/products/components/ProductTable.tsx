import type { Product } from "../types";
import type { Category } from "../../categories/types";
import { formatPrice } from "../../../lib/format-price";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
}

export default function ProductTable({
  products,
  categories,
  onEdit,
}: ProductTableProps) {
  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "Unknown"
    );
  };

  const getPriceRange = (product: Product) => {
    if (product.variants.length === 0) return "No variants";

    const prices = product.variants.map((variant) => Number(variant.price));

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) return formatPrice(minPrice);

    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce(
      (total, variant) => total + variant.stockQuantity,
      0,
    );
  };

  if (products.length === 0) {
    return <p className="py-8 text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Variants</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.slug}</p>
              </td>

              <td className="px-4 py-3">
                {getCategoryName(product.categoryId)}
              </td>

              <td className="px-4 py-3">{product.variants.length}</td>

              <td className="px-4 py-3 whitespace-nowrap">
                {getPriceRange(product)}
              </td>

              <td className="px-4 py-3">{getTotalStock(product)}</td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                  {product.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
