import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

type CreateProductVariantData = {
  productId: string;
  price: number;
  stock: number;
  sku: string;
  size?: string;
  color?: string;
};

type UpdateProductVariantData = {
  productId?: string;
  price?: number;
  stock?: number;
  sku?: string;
  size?: string;
  color?: string;
};

//Read

export async function getVariantById(id: string) {
  const variant = await prisma.productVariant.findUnique({ where: { id } });
  if (!variant) {
    throw new AppError(404, "Variant not found");
  }
  return variant;
}

export async function getVariantBySku(sku: string) {
  const variant = await prisma.productVariant.findUnique({
    where: { sku },
  });
  if (!variant) {
    throw new AppError(404, "Variant not found");
  }
  return variant;
}

//Create
export async function createVariant(data: CreateProductVariantData) {
  //Check duplication
  const existingVariant = await prisma.productVariant.findUnique({
    where: { sku: data.sku },
  });
  if (existingVariant) {
    throw new AppError(409, "Variant with this sku already exists");
  }

  // check existing
  const existingProduct = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!existingProduct) {
    throw new AppError(404, "Product Not Found");
  }

  const { productId, stock, ...variantData } = data;

  return prisma.productVariant.create({
    data: {
      ...variantData,
      stockQuantity: stock,
      product: {
        connect: {
          id: productId,
        },
      },
    },
  });
}

//Update
export async function updateVariant(
  id: string,
  data: UpdateProductVariantData,
) {
  const existingVariant = await prisma.productVariant.findUnique({
    where: { id },
  });
  if (!existingVariant) {
    throw new AppError(404, "Variant not found");
  }

  if (data.productId) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }
  }
  //check if sku duplicate
  if (data.sku && data.sku !== existingVariant.sku) {
    const skuExists = await prisma.productVariant.findUnique({
      where: { sku: data.sku },
    });
    if (skuExists) {
      throw new AppError(409, "Variant with this sku already exists");
    }
  }
  const { productId, stock, ...variantData } = data;
  return prisma.productVariant.update({
    where: { id },
    data: {
      ...variantData,
      ...(stock !== undefined && {
        stockQuantity: stock,
      }),
      ...(productId && {
        product: {
          connect: {
            id: productId,
          },
        },
      }),
    },
  });
}

//Delete
export async function deleteVariant(id: string) {
  const existingVariant = await prisma.productVariant.findUnique({
    where: { id },
  });
  if (!existingVariant) {
    throw new AppError(404, "Variant not found");
  }
  return prisma.productVariant.delete({ where: { id } });
}
