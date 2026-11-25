import {
  adminProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

import { Request, Response, NextFunction } from "express";
import {
  createProduct,
  getActiveProductById,
  getActiveProducts,
  getProductById,
  getProducts,
  updateProduct,
  getVariantsByProductId,
} from "../services/product.service.js";

export async function handleGetActiveProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await getActiveProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductsAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = adminProductsQuerySchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid product query parameters",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const products = await getProducts(result.data);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const product = await getActiveProductById(id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductByIdAdmin(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}
export async function handleGetVariantsByProductId(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const variants = await getVariantsByProductId(req.params.id);
    res.status(200).json({
      success: true,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    const newProduct = result.data;
    const createdProduct = await createProduct(newProduct);
    res.status(201).json({
      success: true,
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    const updateData = result.data;
    const updatedProduct = await updateProduct(req.params.id, updateData);
    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}
