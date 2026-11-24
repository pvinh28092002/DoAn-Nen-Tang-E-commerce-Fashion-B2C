import { useState } from "react";
import ImageUploader from "../../uploads/components/ImageUploader";

export interface ProductVariantFormData {
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
}

interface ProductVariantFormProps {
  onAdd: (variant: ProductVariantFormData) => boolean | Promise<boolean>;
  disabled?: boolean;
}

export default function ProductVariantForm({
  onAdd,
  disabled = false,
}: ProductVariantFormProps) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd() {
    if (isAdding || disabled) return;
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (
      !sku.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setError(
        "Enter a SKU, a price greater than zero, and a whole number stock value of zero or more.",
      );
      return;
    }

    setIsAdding(true);
    try {
      const added = await onAdd({
        size,
        color,
        sku: sku.trim(),
        price: numericPrice,
        stock: numericStock,
        images,
      });
      if (!added) {
        setError("This SKU is already in the variant list.");
        return;
      }

      setError(null);
      setSize("");
      setColor("");
      setSku("");
      setPrice("");
      setStock("");
      setImages([]);
    } catch (addError: unknown) {
      setError(addError instanceof Error ? addError.message : "Could not add variant.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">New Variant</h3>

      <div>
        <label>Size</label>
        <input
          value={size}
          onChange={(e) => setSize(e.target.value)}
          disabled={disabled || isAdding}
          placeholder="e.g. M, L, XL"
        />
      </div>

      <div>
        <label>Color</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={disabled || isAdding}
        />
      </div>

      <div>
        <label>SKU</label>
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          required
          disabled={disabled || isAdding}
        />
      </div>

      <div>
        <label>Price (VND)</label>
        <input
          type="number"
          min="0.01"
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          disabled={disabled || isAdding}
        />
      </div>

      <div>
        <label>Stock</label>
        <input
          type="number"
          min="0"
          step="1"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          disabled={disabled || isAdding}
        />
      </div>

        <ImageUploader images={images} onChange={setImages} />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled || isAdding || !sku.trim() || !price || !stock}
      >
        {isAdding ? "Adding..." : "Add Variant"}
      </button>
    </div>
  );
}
