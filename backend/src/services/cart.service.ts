import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: { include: { product: { select: { name: true, status: true } } } },
        },
      },
    },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  return cart.items;
}

type CartItemData = {
  variantId: string;
  quantity: number;
};

export async function createCartItem(userId: string, data: CartItemData) {
  const existingCart = await prisma.cart.findUnique({
    where: { userId: userId },
  });
  if (!existingCart) {
    throw new AppError(404, "User's cart not found");
  }

  const existingVariant = await prisma.productVariant.findUnique({
    where: { id: data.variantId },
    include: { product: true },
  });

  if (!existingVariant) {
    throw new AppError(404, "Product variant not found");
  }
  if (!existingVariant.isActive || existingVariant.product.status !== "ACTIVE") {
    throw new AppError(400, "This product variant is not available");
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: { cartId: existingCart.id, variantId: data.variantId },
  });
  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + data.quantity;
    if (newQuantity > existingVariant.stockQuantity) {
      throw new AppError(400, "Requested quantity exceeds available stock");
    }
    return prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: newQuantity,
      },
    });
  }
  if (data.quantity > existingVariant.stockQuantity) {
    throw new AppError(400, "Requested quantity exceeds available stock");
  }
  return prisma.cartItem.create({
    data: {
      cartId: existingCart.id,
      variantId: data.variantId,
      quantity: data.quantity,
    },
  });
}

export async function updateCartItemQuantity(
  userId: string,
  variantId: string,
  quantity: number,
) {
  // 1. Find user's cart
  const existingCart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!existingCart) {
    throw new AppError(404, "User's cart not found");
  }

  // 2. Find the CartItem belonging to this cart + variant
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: existingCart.id,
      variantId,
    },
  });

  if (!existingCartItem) {
    throw new AppError(404, "Cart item not found");
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!variant || !variant.isActive || variant.product.status !== "ACTIVE") {
    throw new AppError(400, "This product variant is not available");
  }
  if (quantity > variant.stockQuantity) {
    throw new AppError(400, "Requested quantity exceeds available stock");
  }

  // 3. Update its quantity
  return prisma.cartItem.update({
    where: { id: existingCartItem.id },
    data: {
      quantity,
    },
  });
}

export async function deleteCartItem(userId: string, variantId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }
  const existingCart = await prisma.cart.findUnique({
    where: { userId: userId },
  });
  if (!existingCart) {
    throw new AppError(404, "Cart not found");
  }
  const existingVariant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!existingVariant) {
    throw new AppError(404, "Product variant not found");
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: existingCart.id,
      variantId: variantId,
    },
  });
  if (!existingCartItem) {
    throw new AppError(404, "cart item not found");
  }
  return prisma.cartItem.delete({ where: { id: existingCartItem.id } });
}

export async function clearCart(userId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }
  const existingCart = await prisma.cart.findUnique({
    where: { userId: userId },
  });
  if (!existingCart) {
    throw new AppError(404, "Cart not found");
  }

  return prisma.cartItem.deleteMany({ where: { cartId: existingCart.id } });
}
