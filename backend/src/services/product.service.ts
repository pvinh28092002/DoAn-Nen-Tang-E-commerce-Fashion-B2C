import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ProductStatus } from "../generated/prisma/browser.js";
import { Prisma } from "../generated/prisma/client.js";
import { adminProductsQuerySchema } from "../schemas/product.schema.js";
import { z } from "zod";

type AdminProductsQuery = z.infer<typeof adminProductsQuerySchema>;
type CreateProductData = {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  status?: ProductStatus;
};
type UpdateProductData = {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  status?: ProductStatus;
};

export async function getActiveProducts() {
  return prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
    where: { status: "ACTIVE" },
    include: { variants: { where: { isActive: true } } },
  });
}
export async function getProducts(query: AdminProductsQuery) {
  const { page, pageSize, search, categoryId, status } = query;
  const where: Prisma.ProductWhereInput = {
    ...(categoryId && { categoryId }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: [{ name: "asc" }, { id: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { variants: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
}
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  return product;
}

export async function getActiveProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: { id, status: "ACTIVE" },
    include: { variants: { where: { isActive: true } } },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  return product;
}

export async function getVariantsByProductId(id: string) {
  const existingProduct = await prisma.product.findFirst({
    where: { id, status: "ACTIVE" },
  });
  if (!existingProduct) {
    throw new AppError(404, "Product not found");
  }
  return prisma.productVariant.findMany({
    where: { productId: id, isActive: true },
  });
}
//Create

export async function createProduct(data: CreateProductData) {
  const existingProduct = await prisma.product.findUnique({
    where: { slug: data.slug },
  });

  if (existingProduct) {
    throw new AppError(409, "Product with this slug already exists");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!existingCategory) {
    throw new AppError(404, "Category not found");
  }

  const { categoryId, ...productData } = data;

  return prisma.product.create({
    data: {
      ...productData,
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });
}

//Update

export async function updateProduct(id: string, data: UpdateProductData) {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new AppError(404, "Product not found");
  }

  // Check if the category exists if categoryId is provided
  if (data.categoryId) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!existingCategory) {
      throw new AppError(404, "Category not found");
    }
  }

  //check duplicate slug if slug is provided and different from the existing one
  if (data.slug && data.slug !== existingProduct.slug) {
    const slugExists = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (slugExists) {
      throw new AppError(409, "Product with this slug already exists");
    }
  }

  const { categoryId, ...productData } = data;

  return prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(categoryId && {
        category: {
          connect: {
            id: categoryId,
          },
        },
      }),
    },
  });
}
