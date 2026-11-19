import ImageKit from "imagekit";
import { AppError } from "../errors/app-error.js";

function getImageKitClient() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new AppError(500, "ImageKit environment variables are missing");
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

export function generateImageKitAuth() {
  const imagekit = getImageKitClient();

  return {
    ...imagekit.getAuthenticationParameters(),
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  };
}
