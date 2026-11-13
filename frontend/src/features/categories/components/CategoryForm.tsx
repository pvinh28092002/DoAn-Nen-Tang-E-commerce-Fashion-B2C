// src/features/categories/components/CategoryForm.tsx

import { useState } from "react";
import type { SubmitEvent } from "react";

import type { Category, CategoryInput } from "../types";

interface CategoryFormProps {
  categories: Category[];
  category?: Category | null;
  submitting: boolean;
  onSubmit: (data: CategoryInput) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({
  categories,
  category,
  submitting,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState(() => ({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    parentId: category?.parentId ?? "",
    coverImage: category?.coverImage ?? "",
  }));
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        parentId: formData.parentId || null,
        coverImage: formData.coverImage.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
    }
  };

  const availableParents = categories.filter(
    (item) => item.id !== category?.id,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="category-name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Category name
        </label>
        <input
          id="category-name"
          value={formData.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          placeholder="e.g. Men's Clothing"
        />
      </div>

      <div>
        <label
          htmlFor="category-slug"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Slug
        </label>
        <input
          id="category-slug"
          value={formData.slug}
          onChange={(event) => updateField("slug", event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          placeholder="mens-clothing"
        />
      </div>

      <div>
        <label
          htmlFor="category-parent"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Parent category
        </label>
        <select
          id="category-parent"
          value={formData.parentId}
          onChange={(event) => updateField("parentId", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
        >
          <option value="">Root category</option>
          {availableParents.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="category-description"
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          placeholder="Describe this category..."
        />
      </div>

      <div>
        <label
          htmlFor="category-cover"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Cover image URL
        </label>
        <input
          id="category-cover"
          type="url"
          value={formData.coverImage}
          onChange={(event) => updateField("coverImage", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          placeholder="https://..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : category
              ? "Save changes"
              : "Create category"}
        </button>
      </div>
    </form>
  );
}
