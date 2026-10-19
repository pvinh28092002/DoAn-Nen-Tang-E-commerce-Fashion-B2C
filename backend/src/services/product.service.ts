import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ProductStatus } from "../generated/prisma/browser.js";
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

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
    include: { variants: true },
  });
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

export async function getVariantsByProductId(id: string) {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new AppError(404, "Product not found");
  }
  return prisma.productVariant.findMany({
    where: { productId: id },
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

//Delete
export async function deleteProduct(id: string) {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new AppError(404, "Product not found");
  }
  return prisma.product.delete({ where: { id } });
}
