import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
export async function getCart(userId) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: true,
        },
    });
    if (!cart) {
        throw new AppError(404, "Cart not found");
    }
    return cart.items;
}
export async function createCartItem(userId, data) {
    const existingCart = await prisma.cart.findUnique({
        where: { userId: userId },
    });
    if (!existingCart) {
        throw new AppError(404, "User's cart not found");
    }
    const existingVariant = await prisma.productVariant.findUnique({
        where: { id: data.variantId },
    });
    if (!existingVariant) {
        throw new AppError(404, "Product variant not found");
    }
    const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: existingCart.id, variantId: data.variantId },
    });
    if (existingCartItem) {
        return prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: existingCartItem.quantity + data.quantity,
            },
        });
    }
    return prisma.cartItem.create({
        data: {
            cartId: existingCart.id,
            variantId: data.variantId,
            quantity: data.quantity,
        },
    });
}
export async function updateCartItemQuantity(userId, variantId, quantity) {
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
    // 3. Update its quantity
    return prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
            quantity,
        },
    });
}
export async function deleteCartItem(userId, variantId) {
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
export async function clearCart(userId) {
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
//# sourceMappingURL=cart.service.js.map