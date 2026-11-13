// src/pages/admin/CategoriesPage.tsx

import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../features/categories/api";

import type { Category, CategoryInput } from "../../features/categories/types";

import CategoryTable from "../../features/categories/components/CategoryTable";
import CategoryForm from "../../features/categories/components/CategoryForm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load categories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (submitting) return;

    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data: CategoryInput) => {
    try {
      setSubmitting(true);
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
      } else {
        await createCategory(data);
      }

      setIsFormOpen(false);
      setSelectedCategory(null);

      await fetchCategories();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) return;

    try {
      setError(null);
      await deleteCategory(category.id);
      await fetchCategories();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete category.",
      );
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store's product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 text-sm text-gray-500">
        {categories.length} categories
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">No categories found.</p>
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory ? "Edit category" : "Create category"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCategory
                  ? "Update the category information."
                  : "Add a new category to your store."}
              </p>
            </div>

            <CategoryForm
              key={selectedCategory?.id ?? "new-category"}
              categories={categories}
              category={selectedCategory}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </section>
  );
}
