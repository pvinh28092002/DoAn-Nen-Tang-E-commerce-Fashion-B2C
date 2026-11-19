import { useState } from "react";
import type { Category } from "../../categories/types";
import {
  createProduct,
  createProductVariant,
  getProductVariantBySku,
  updateProduct,
} from "../api";
import type { CreateProductInput, ProductVariant } from "../types";
import ProductInformationForm from "./ProductInformationForm";
import ProductVariantsStep, {
  type ProductVariantDraft,
} from "./ProductVariantsStep";

interface ProductCreationModalProps {
  categories: Category[];
  onClose: (productWasCreated: boolean) => void;
}

function variantMatchesDraft(
  saved: ProductVariant,
  productId: string,
  draft: ProductVariantDraft,
) {
  return (
    saved.productId === productId &&
    saved.sku.trim().toLowerCase() === draft.sku.trim().toLowerCase() &&
    Number(saved.price) === draft.price &&
    saved.stockQuantity === draft.stock &&
    saved.size === (draft.size || null) &&
    saved.color === (draft.color || null) &&
    saved.images.length === draft.images.length &&
    saved.images.every((image, index) => image === draft.images[index])
  );
}

export default function ProductCreationModal({
  categories,
  onClose,
}: ProductCreationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [productInput, setProductInput] = useState<CreateProductInput | null>(
    null,
  );
  const [variants, setVariants] = useState<ProductVariantDraft[]>([]);
  const [savedVariantIds, setSavedVariantIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeModal() {
    const unsavedVariants = variants.filter(
      (variant) => !savedVariantIds.has(variant.clientId),
    );
    if (productId && unsavedVariants.length > 0) {
      const confirmed = window.confirm(
        "This product has already been saved. Close and discard the unsaved variants? The product will remain in your catalog.",
      );
      if (!confirmed) return;
    }
    onClose(productId !== null);
  }

  async function handleProductSubmit(input: CreateProductInput) {
    setError(null);
    setIsSubmitting(true);
    try {
      if (productId) {
        await updateProduct(productId, input);
      } else {
        const product = await createProduct(input);
        setProductId(product.id);
      }
      setProductInput(input);
      setStep(2);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save product information.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateVariants(drafts: ProductVariantDraft[]) {
    if (!productId) return;
    setError(null);
    setIsSubmitting(true);
    const savedIds = new Set(savedVariantIds);
    try {
      for (const variant of drafts) {
        if (savedIds.has(variant.clientId)) continue;

        const payload = {
          productId,
          sku: variant.sku,
          size: variant.size || undefined,
          color: variant.color || undefined,
          price: variant.price,
          stock: variant.stock,
          images: variant.images,
        };

        try {
          await createProductVariant(payload);
        } catch (createError) {
          // A response can be lost after the server commits. Reconcile by the unique SKU before retrying.
          let existing: ProductVariant | null = null;
          try {
            existing = await getProductVariantBySku(variant.sku);
          } catch {
            // Keep the original create error when the lookup also fails.
          }
          if (!existing || !variantMatchesDraft(existing, productId, variant)) {
            const message =
              createError instanceof Error
                ? createError.message
                : "request failed";
            throw new Error(
              `Could not save variant ${variant.sku}: ${message}`,
              { cause: createError },
            );
          }
        }

        savedIds.add(variant.clientId);
        setSavedVariantIds(new Set(savedIds));
      }

      onClose(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save the variants. You can retry without recreating the product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="product-modal-title" className="text-xl font-semibold">
              Create product
            </h2>
            <ol
              aria-label="Creation steps"
              className="mt-4 grid grid-cols-2 gap-2 text-sm"
            >
              <li
                aria-current={step === 1 ? "step" : undefined}
                className={`rounded-md px-3 py-2 ${step === 1 ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
              >
                <span className="font-medium">Step 1</span>
                <span className="ml-2">Product Information</span>
              </li>
              <li
                aria-current={step === 2 ? "step" : undefined}
                className={`rounded-md px-3 py-2 ${step === 2 ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
              >
                <span className="font-medium">Step 2</span>
                <span className="ml-2">Product Variants</span>
              </li>
            </ol>
          </div>
          <button
            type="button"
            aria-label="Close product creation"
            onClick={closeModal}
            disabled={isSubmitting}
            className="rounded-md px-2 py-1 text-xl leading-none text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div hidden={step !== 1}>
          <ProductInformationForm
            key={productId ?? "new-product"}
            categories={categories}
            initialValue={productInput ?? undefined}
            onSubmit={handleProductSubmit}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
            submitLabel={
              productId ? "Save changes and continue" : "Next: Variants"
            }
          />
        </div>

        <div hidden={step !== 2}>
          <ProductVariantsStep
            onChange={setVariants}
            onBack={() => {
              setError(null);
              setStep(1);
            }}
            onSkip={closeModal}
            onCreate={(drafts) => {
              void handleCreateVariants(drafts);
            }}
            isSubmitting={isSubmitting}
            savedVariantIds={savedVariantIds}
          />
        </div>
      </section>
    </div>
  );
}
