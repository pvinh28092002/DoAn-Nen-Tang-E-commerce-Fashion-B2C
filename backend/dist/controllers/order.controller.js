import { checkoutSchema, updateOrderStatusSchema, } from "../schemas/order.schema.js";
import { createOrder, getOrders, getOrderById, cancelOrderById, getAllOrdersAdmin, updateOrderStatus, } from "../services/order.service.js";
export async function handleCreateOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const result = checkoutSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid order data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const orderData = result.data; // contains paymentmethod and either addressId or address object
        const newOrder = await createOrder(userId, orderData);
        res.status(201).json({
            success: true,
            data: newOrder,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetOrders(req, res, next) {
    try {
        const userId = req.user.id;
        const orders = await getOrders(userId);
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetOrderById(req, res, next) {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;
        const orderData = await getOrderById(userId, orderId);
        res.status(200).json({
            success: true,
            data: orderData,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleCancelOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;
        const orderData = await cancelOrderById(userId, orderId);
        res.status(200).json({
            success: true,
            data: orderData,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetAllOrdersAdmin(req, res, next) {
    try {
        const orders = await getAllOrdersAdmin();
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleUpdateOrderStatusAdmin(req, res, next) {
    try {
        const orderId = req.params.orderId;
        const result = updateOrderStatusSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid Order data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const updateData = result.data;
        const updatedOrder = await updateOrderStatus(orderId, updateData);
        res.status(200).json({
            success: true,
            data: updatedOrder,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order.controller.js.map