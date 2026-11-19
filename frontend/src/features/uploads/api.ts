import { apiRequest } from "../../lib/api-client";
import type {
  ApiResponse,
  ImageKitAuth,
  ImageKitUploadResponse,
} from "./types";

export async function getImageKitAuth(): Promise<ImageKitAuth> {
  const response = await apiRequest<ApiResponse<ImageKitAuth>>(
    "/uploads/imagekit-auth",
  );

  return response.data;
}

export async function uploadImage(file: File): Promise<ImageKitUploadResponse> {
  const auth = await getImageKitAuth();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("token", auth.token);
  formData.append("expire", String(auth.expire));
  formData.append("signature", auth.signature);
  formData.append("publicKey", auth.publicKey);

  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to upload image");
  }

  return data as ImageKitUploadResponse;
}

