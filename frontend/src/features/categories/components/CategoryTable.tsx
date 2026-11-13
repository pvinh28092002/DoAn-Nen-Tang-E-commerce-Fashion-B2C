import type { Category } from "../types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "Root category";

    return (
      categories.find((category) => category.id === parentId)?.name ?? "Unknown"
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
          <tr>
            <th className="px-5 py-4 font-medium">Category</th>
            <th className="px-5 py-4 font-medium">Slug</th>
            <th className="px-5 py-4 font-medium">Parent</th>
            <th className="px-5 py-4 font-medium">Description</th>
            <th className="px-5 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-medium text-gray-900">
                {category.name}
              </td>

              <td className="px-5 py-4 text-gray-600">{category.slug}</td>

              <td className="px-5 py-4 text-gray-600">
                {getParentName(category.parentId)}
              </td>

              <td className="max-w-xs truncate px-5 py-4 text-gray-600">
                {category.description || "—"}
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="font-medium text-gray-700 hover:text-black"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
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
