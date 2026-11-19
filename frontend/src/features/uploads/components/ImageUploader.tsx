import { useState } from "react";
import { uploadImage } from "../api";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({
  images,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const result = await uploadImage(file);
        uploadedUrls.push(result.url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      // Preserve any images successfully uploaded before the failure.
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }

      setError(
        error instanceof Error ? error.message : "Failed to upload images",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (imageUrl: string) => {
    onChange(images.filter((image) => image !== imageUrl));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Product Images</label>

      <div className="flex flex-wrap gap-3">
        {images.map((imageUrl) => (
          <div
            key={imageUrl}
            className="relative h-24 w-24 overflow-hidden rounded-lg border"
          >
            <img
              src={imageUrl}
              alt="Product"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => handleRemove(imageUrl)}
              disabled={uploading}
              className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={(event) => {
          void handleUpload(event.target.files);
          event.target.value = "";
        }}
        className="block w-full text-sm"
      />

      {uploading && (
        <p className="text-sm text-gray-500">Uploading images...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
