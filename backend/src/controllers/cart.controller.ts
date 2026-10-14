import { Request, Response, NextFunction } from "express";
import {
  getCart,
  createCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
} from "../services/cart.service.js";
import {
  createCartItemSchema,
  updateCartItemSchema,
} from "../schemas/cart.schema.js";

export async function handleGetCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const cart = await getCart(userId);
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

//router.post("/items")
export async function handleCreateCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = createCartItemSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Cart Item data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const cartItemData = result.data;
    const newItemData = await createCartItem(req.user!.id, cartItemData);
    res.status(201).json({
      success: true,
      data: newItemData,
    });
  } catch (error) {
    next(error);
  }
}

//router.put("/items/:variantId")
export async function handleUpdateCartItem(
  req: Request<{ variantId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = updateCartItemSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Cart Item data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    const userId = req.user!.id;
    const variantId = req.params.variantId;
    const cartItemQuantityData = result.data.quantity;
    const newcartItemQuantity = await updateCartItemQuantity(
      userId,
      variantId,
      cartItemQuantityData,
    );
    res.status(200).json({
      success: true,
      data: newcartItemQuantity,
    });
  } catch (error) {
    next(error);
  }
}
//router.delete("/items/:variantId"
export async function handleDeleteCartItem(
  req: Request<{ variantId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const variantId = req.params.variantId;
    const deletedCartItem = await deleteCartItem(userId, variantId);
    res.status(200).json({
      success: true,
      data: deletedCartItem,
    });
  } catch (error) {
    next(error);
  }
}

//router.delete("/items")
export async function handleClearCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const clearedCart = await clearCart(userId);
    res.status(200).json({
      success: true,
      data: clearedCart,
    });
  } catch (error) {
    next(error);
  }
}
