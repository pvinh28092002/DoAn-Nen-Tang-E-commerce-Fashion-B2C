import { useState, type FormEvent } from "react";
import type { ProductVariant, UpdateProductVariantInput } from "../types";
import { formatPrice } from "../../../lib/format-price";
import ImageUploader from "../../uploads/components/ImageUploader";

interface ProductVariantEditorProps {
  variant: ProductVariant;
  onSave: (id: string, input: UpdateProductVariantInput) => Promise<void>;
}

export default function ProductVariantEditor({
  variant,
  onSave,
}: ProductVariantEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sku, setSku] = useState(variant.sku);
  const [size, setSize] = useState(variant.size ?? "");
  const [color, setColor] = useState(variant.color ?? "");
  const [price, setPrice] = useState(variant.price);
  const [stock, setStock] = useState(String(variant.stockQuantity));
  const [images, setImages] = useState(variant.images);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(variant.id, {
        sku: sku.trim(),
        size: size.trim() || undefined,
        color: color.trim() || undefined,
        price: Number(price),
        stock: Number(stock),
        images,
      });
      setIsEditing(false);
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not update variant.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleAvailability() {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(variant.id, { isActive: !variant.isActive });
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not update variant availability.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-medium text-gray-900">
            {variant.size || "No size"} / {variant.color || "No color"}
          </p>
          <p className="mt-1 text-sm text-gray-600">SKU: {variant.sku}</p>
          <p className="mt-1 text-sm text-gray-600">
            {formatPrice(variant.price)} · Stock: {variant.stockQuantity}
          </p>
          <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${variant.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
            {variant.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsEditing((editing) => !editing)}
            disabled={isSaving}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {isEditing ? "Cancel edit" : "Edit variant"}
          </button>
          <button
            type="button"
            onClick={() => void toggleAvailability()}
            disabled={isSaving}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : variant.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={(event) => void save(event)} className="space-y-4 border-t border-gray-100 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">SKU</span>
              <input value={sku} onChange={(event) => setSku(event.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Price (VND)</span>
              <input type="number" min="0.01" step="any" value={price} onChange={(event) => setPrice(event.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Size</span>
              <input value={size} onChange={(event) => setSize(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Color</span>
              <input value={color} onChange={(event) => setColor(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">Stock quantity</span>
              <input type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
              <span className="mt-1 block text-xs text-gray-500">Enter the new total stock quantity.</span>
            </label>
          </div>
          <ImageUploader images={images} onChange={setImages} />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
              {isSaving ? "Saving..." : "Save variant"}
            </button>
          </div>
        </form>
      )}
      {!isEditing && error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </article>
  );
}
