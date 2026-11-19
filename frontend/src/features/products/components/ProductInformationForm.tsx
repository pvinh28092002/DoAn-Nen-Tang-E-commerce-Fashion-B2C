import { useState, type FormEvent } from "react";
import type { Category } from "../../categories/types";
import type { CreateProductInput, ProductStatus } from "../types";

interface ProductInformationFormProps {
  categories: Category[];
  onSubmit: (product: CreateProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialValue?: CreateProductInput;
  submitLabel: string;
}

export default function ProductInformationForm({
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
  initialValue,
  submitLabel,
}: ProductInformationFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [categoryId, setCategoryId] = useState(initialValue?.categoryId ?? "");
  const [description, setDescription] = useState(initialValue?.description ?? "");
  const [status, setStatus] = useState<ProductStatus>(initialValue?.status ?? "ACTIVE");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      categoryId,
      description: description.trim(),
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="product-name" className="mb-1 block text-sm font-medium">Product name</label>
        <input id="product-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={160} className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="product-slug" className="mb-1 block text-sm font-medium">Slug</label>
        <input id="product-slug" value={slug} onChange={(event) => setSlug(event.target.value)} required maxLength={180} className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="product-category" className="mb-1 block text-sm font-medium">Category</label>
        <select id="product-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2">
          <option value="">Select category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="product-description" className="mb-1 block text-sm font-medium">Description</label>
        <textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="product-status" className="mb-1 block text-sm font-medium">Status</label>
        <select id="product-status" value={status} onChange={(event) => setStatus(event.target.value as ProductStatus)} className="w-full rounded-md border border-gray-300 px-3 py-2">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={isSubmitting || categories.length === 0} className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
      {categories.length === 0 && <p className="text-sm text-amber-700">Create a category before adding a product.</p>}
    </form>
  );
}
