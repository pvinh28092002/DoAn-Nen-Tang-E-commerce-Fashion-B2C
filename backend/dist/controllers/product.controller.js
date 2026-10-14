import { createProductSchema, updateProductSchema, } from "../schemas/product.schema.js";
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct, getVariantsByProductId, } from "../services/product.service.js";
export async function handleGetProducts(req, res, next) {
    try {
        const products = await getProducts();
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetProductById(req, res, next) {
    try {
        const { id } = req.params;
        const product = await getProductById(id);
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetVariantsByProductId(req, res, next) {
    try {
        const variants = await getVariantsByProductId(req.params.id);
        res.status(200).json({
            success: true,
            data: variants,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleCreateProduct(req, res, next) {
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
    }
    catch (error) {
        next(error);
    }
}
export async function handleUpdateProduct(req, res, next) {
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
    }
    catch (error) {
        next(error);
    }
}
export async function handleDeleteProduct(req, res, next) {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            deletedProduct,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=product.controller.js.map