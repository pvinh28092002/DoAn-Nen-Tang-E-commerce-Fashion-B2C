const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, ...requestOptions } = options;

  const response = await fetch(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...requestOptions,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    },
  );

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

// Examples (define Product to match your API response type):
// GET
// const products = await apiRequest<Product[]>("/products");
//
// POST
// const createdProduct = await apiRequest<Product>("/products", {
//   method: "POST",
//   body: { name: "Example product", price: 19.99 },
// });
//
// PUT
// const updatedProduct = await apiRequest<Product>("/products/123", {
//   method: "PUT",
//   body: { name: "Updated product", price: 24.99 },
// });
