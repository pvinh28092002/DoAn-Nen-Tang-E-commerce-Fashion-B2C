import { getVariantById, getVariantBySku, createVariant, updateVariant, deleteVariant, } from "../services/product-variant.service.js";
import { createProductVariantSchema, updateProductVariantSchema, } from "../schemas/product-variant.schema.js";
export async function handleGetVariantById(req, res, next) {
    try {
        const variant = await getVariantById(req.params.id);
        res.status(200).json({
            success: true,
            data: variant,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetVariantsBySku(req, res, next) {
    try {
        const variant = await getVariantBySku(req.params.sku);
        res.status(200).json({
            success: true,
            data: variant,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleCreateVariant(req, res, next) {
    try {
        const result = createProductVariantSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid Variant data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const variantData = result.data;
        const newVariant = await createVariant(variantData);
        res.status(201).json({
            success: true,
            data: newVariant,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleUpdateVariant(req, res, next) {
    try {
        const result = updateProductVariantSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid Variant data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const variantData = result.data;
        const newVariant = await updateVariant(req.params.id, variantData);
        res.status(200).json({
            success: true,
            data: newVariant,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleDeleteVariant(req, res, next) {
    try {
        const variantId = req.params.id;
        const deletedVariant = await deleteVariant(variantId);
        res.status(200).json({
            success: true,
            data: deletedVariant,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=product-variant.controller.js.map