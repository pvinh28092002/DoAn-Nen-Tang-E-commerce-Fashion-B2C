import { deleteUser, getUsers, updateUser, getUserById, getUserProfile, getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress, } from "../services/user.service.js";
import { createUserAddressSchema, updateUserAddressSchema, updateUserSchema, } from "../schemas/user.schema.js";
export async function handleGetUsers(req, res, next) {
    try {
        const user = await getUsers();
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetUserById(req, res, next) {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleGetUserProfile(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await getUserProfile(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleUpdateUser(req, res, next) {
    try {
        const userId = req.params.id;
        const result = updateUserSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid user data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const updateData = result.data;
        const updatedUser = await updateUser(userId, updateData);
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleDeleteUser(req, res, next) {
    try {
        const userId = req.params.id;
        const deletedUser = await deleteUser(userId);
        res.status(200).json({
            success: true,
            data: deletedUser,
        });
    }
    catch (error) {
        next(error);
    }
}
//Address handlers
export async function handleGetUserAddresses(req, res, next) {
    try {
        const userId = req.user.id;
        const addresses = await getUserAddresses(userId);
        res.status(200).json({
            success: true,
            data: addresses,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleCreateUserAddress(req, res, next) {
    try {
        const userId = req.user.id;
        const result = createUserAddressSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid address data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const addressData = result.data;
        const newAddress = await createUserAddress(userId, addressData);
        res.status(201).json({
            success: true,
            data: newAddress,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleUpdateUserAddress(req, res, next) {
    try {
        const userId = req.user.id;
        const addressId = req.params.addressId;
        const result = updateUserAddressSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid address data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const updateData = result.data;
        const updatedAddress = await updateUserAddress(userId, addressId, updateData);
        res.status(200).json({
            success: true,
            data: updatedAddress,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleDeleteUserAddress(req, res, next) {
    try {
        const userId = req.user.id;
        const addressId = req.params.addressId;
        const deletedAddress = await deleteUserAddress(userId, addressId);
        res.status(200).json({
            success: true,
            data: deletedAddress,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user.controller.js.map