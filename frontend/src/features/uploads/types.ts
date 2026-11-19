export interface ImageKitAuth {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  filePath: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
