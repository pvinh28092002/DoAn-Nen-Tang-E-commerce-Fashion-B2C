import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryTree,
  updateCategory,
  getCategoryById,
} from "../services/category.service.js";
import { Request, Response, NextFunction } from "express";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";

export async function handleGetCategories(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await getCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}
export async function handleGetCategoryById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetCategoryTree(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categoryTree = await getCategoryTree();
    res.status(200).json({
      success: true,
      data: categoryTree,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid category data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const categoryData = result.data;
    const newCategory = await createCategory(categoryData);
    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categoryId = req.params.id;
    const result = updateCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid category data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    const updateData = result.data;

    const updatedCategory = await updateCategory(categoryId, updateData);
    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await deleteCategory(categoryId);
    res.status(200).json({
      success: true,
      data: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
}
