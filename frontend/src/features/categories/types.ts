export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  coverImage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
