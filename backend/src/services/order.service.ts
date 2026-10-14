import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import {
  checkoutSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema.js";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";

type CheckoutData = z.infer<typeof checkoutSchema>;

export async function createOrder(
  userId: string,
  orderData: CheckoutData,
): Promise<any> {
  const { paymentMethod } = orderData;
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cart: {
        userId: userId,
      },
    },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  });
  const shippingFee = 90000;
  if (!cartItems || cartItems.length === 0) {
    throw new AppError(400, "No items in the cart to create an order.");
  }
  //validate stock availability for each item
  for (const item of cartItems) {
    if (item.variant.stockQuantity < item.quantity) {
      throw new AppError(
        400,
        `Insufficient stock for product: ${item.variant.product.name}`,
      );
    }
  }

  for (const product of cartItems) {
    if (product.variant.product.status !== "ACTIVE") {
      throw new AppError(
        400,
        `Product ${product.variant.product.name} is not available for order.`,
      );
    }
  }
  const subtotal = cartItems.reduce(
    (sum, item) => sum.plus(item.variant.price.mul(item.quantity)),
    new Prisma.Decimal(0),
  );
  const totalAmount = subtotal.plus(shippingFee);
  //Validate address
  let deliveryAddress;
  if ("addressId" in orderData) {
    deliveryAddress = await prisma.address.findFirst({
      where: {
        id: orderData.addressId,
        userId,
      },
    });

    if (!deliveryAddress) {
      throw new AppError(400, "Delivery address not found");
    }
  } else {
    deliveryAddress = orderData.address;
  }

  const saveAddress =
    "saveAddress" in orderData ? orderData.saveAddress : false;
  const newOrderData: Prisma.OrderUncheckedCreateInput = {
    userId: userId,
    status: "PENDING",
    paymentStatus: "PENDING",
    recipient: deliveryAddress.recipient,
    phone: deliveryAddress.phone,
    address: deliveryAddress.address,
    city: deliveryAddress.city,
    district: deliveryAddress.district,
    ward: deliveryAddress.ward,
    totalAmount: totalAmount,
  };
  const orderItemsData = cartItems.map((item) => ({
    variantId: item.variantId,
    productName: item.variant.product.name,
    size: item.variant.size ?? "",
    color: item.variant.color ?? "",
    sku: item.variant.sku,
    price: item.variant.price,
    quantity: item.quantity,
  }));

  const newOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        ...newOrderData,
        items: {
          create: orderItemsData,
        },
        payment: {
          create: {
            method: paymentMethod,
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (saveAddress && !("addressId" in orderData)) {
      await tx.address.create({
        data: {
          userId,
          recipient: deliveryAddress.recipient,
          phone: deliveryAddress.phone,
          address: deliveryAddress.address,
          city: deliveryAddress.city,
          district: deliveryAddress.district,
          ward: deliveryAddress.ward || null,
          isDefault: false,
        },
      });
    }

    const stockUpdatePromises = cartItems.map(async (item) => {
      const result = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stockQuantity: { gte: item.quantity },
        },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });

      if (result.count !== 1) {
        throw new AppError(
          409,
          `Insufficient stock for product: ${item.variant.product.name}`,
        );
      }
    });

    await Promise.all(stockUpdatePromises);
    const deletedItems = await tx.cartItem.deleteMany({
      where: {
        cart: { userId },
      },
    });

    if (deletedItems.count !== cartItems.length) {
      throw new AppError(
        409,
        "Your cart changed during checkout. Please try again.",
      );
    }
    return order;
  });

  return newOrder;
}

export async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      payment: true,
      items: true,
    },
  });
  return orders;
}

export async function cancelOrderById(userId: string, orderId: string) {
  return prisma.$transaction(
    async (tx) => {
      const existingOrder = await tx.order.findFirst({
        where: {
          id: orderId,
          userId,
        },
        include: {
          items: true,
        },
      });

      if (!existingOrder) {
        throw new AppError(404, "Order not found");
      }

      if (existingOrder.status !== "PENDING") {
        throw new AppError(400, "Only pending orders can be cancelled");
      }

      // Change status only if it is still PENDING.
      const result = await tx.order.updateMany({
        where: {
          id: orderId,
          userId,
          status: "PENDING",
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (result.count !== 1) {
        throw new AppError(
          409,
          "Order status changed; cancellation is no longer available",
        );
      }

      // Restore the stock for every item in the order.
      for (const item of existingOrder.items) {
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          payment: true,
        },
      });
    },
    {
      maxWait: 10_000,
      timeout: 20_000,
    },
  );
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: userId },
    include: { items: true, payment: true },
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
}

export async function getAllOrdersAdmin() {
  const orders = await prisma.order.findMany({
    include: { items: true, payment: true },
  });
  return orders;
}

type OrderStatusData = z.infer<typeof updateOrderStatusSchema>;

export async function updateOrderStatus(
  orderId: string,
  updateData: OrderStatusData,
) {
  const { orderStatus, paymentStatus } = updateData;
  if (orderStatus === undefined && paymentStatus === undefined) {
    throw new AppError(400, "Request could not be empty");
  }
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!existingOrder) {
    throw new AppError(404, "Order Not Found");
  }
  const { status } = existingOrder;

  if (status === "CANCELLED") {
    throw new AppError(400, "Cannot change the status of a cancelled order");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(orderStatus !== undefined && {
        status: orderStatus,
      }),
      ...(paymentStatus !== undefined && {
        paymentStatus: paymentStatus,
        payment: {
          update: {
            status: paymentStatus,
          },
        },
      }),
    },
    include: {
      items: true,
      payment: true,
    },
  });

  return updatedOrder;
}
