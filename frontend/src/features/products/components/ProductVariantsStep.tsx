import { useRef, useState } from "react";
import ProductVariantForm, { type ProductVariantFormData } from "./ProductVariantForm";

export interface ProductVariantDraft extends ProductVariantFormData {
  clientId: string;
}

interface ProductVariantsStepProps {
  onChange: (variants: ProductVariantDraft[]) => void;
  onBack: () => void;
  onSkip: () => void;
  onCreate: (variants: ProductVariantDraft[]) => void;
  isSubmitting: boolean;
  savedVariantIds: Set<string>;
}

export default function ProductVariantsStep({
  onChange,
  onBack,
  onSkip,
  onCreate,
  isSubmitting,
  savedVariantIds,
}: ProductVariantsStepProps) {
  const [variants, setVariants] = useState<ProductVariantDraft[]>([]);
  const nextId = useRef(1);

  function addVariant(variant: ProductVariantFormData): boolean {
    if (variants.some((item) => item.sku.trim().toLowerCase() === variant.sku.trim().toLowerCase())) {
      return false;
    }

    const updated = [...variants, { ...variant, clientId: `variant-${nextId.current++}` }];
    setVariants(updated);
    onChange(updated);
    return true;
  }

  function removeVariant(clientId: string) {
    if (savedVariantIds.has(clientId)) return;
    const updated = variants.filter((variant) => variant.clientId !== clientId);
    setVariants(updated);
    onChange(updated);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
        The product is saved. Variants are optional and can be added now or later.
      </div>

      <section aria-labelledby="added-variants-heading" className="space-y-3">
        <h3 id="added-variants-heading" className="font-medium">Added variants ({variants.length})</h3>
        {variants.length === 0 ? (
          <p className="text-sm text-gray-500">No variants added yet.</p>
        ) : variants.map((variant) => {
          const saved = savedVariantIds.has(variant.clientId);
          return (
            <div key={variant.clientId} className="flex items-center justify-between gap-4 rounded-md border p-3">
              <div className="min-w-0 text-sm">
                <p className="font-medium">{variant.size || "No size"} / {variant.color || "No color"}</p>
                <p className="break-all text-gray-600">SKU: {variant.sku}</p>
                <p className="text-gray-600">{variant.price.toLocaleString("vi-VN")} VND · Stock: {variant.stock} · {variant.images.length} images</p>
                {saved && <p className="text-xs font-medium text-green-700">Saved</p>}
              </div>
              <button type="button" onClick={() => removeVariant(variant.clientId)} disabled={isSubmitting || saved} className="shrink-0 text-sm text-red-700 hover:underline disabled:opacity-50">
                Remove
              </button>
            </div>
          );
        })}
      </section>

      <ProductVariantForm onAdd={addVariant} disabled={isSubmitting} />

      <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
        <button type="button" onClick={onBack} disabled={isSubmitting} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Back</button>
        <div className="flex gap-3">
          <button type="button" onClick={onSkip} disabled={isSubmitting} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Skip for now</button>
          <button type="button" onClick={() => onCreate(variants)} disabled={isSubmitting || variants.length === 0} className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
