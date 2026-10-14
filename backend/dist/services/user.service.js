import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
const userPublicSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};
//Read
export async function getUsers() {
    return prisma.user.findMany({
        orderBy: {
            name: "asc",
        },
        select: userPublicSelect,
    });
}
export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: userPublicSelect,
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    return user;
}
export async function getUserProfile(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
//Update
export async function updateUser(id, data) {
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }
    if (data.email && data.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (emailExists) {
            throw new AppError(409, "A user with this email already exists");
        }
    }
    const userData = {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
    };
    return prisma.user.update({
        where: { id },
        data: userData,
    });
}
//Delete
export async function deleteUser(id) {
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }
    return prisma.user.delete({
        where: { id },
        select: userPublicSelect,
    });
}
//Address
export async function getUserAddresses(userId) {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }
    return prisma.address.findMany({
        where: { userId },
        orderBy: {
            isDefault: "desc",
        },
    });
}
export async function createUserAddress(userId, data) {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
    }
    return prisma.address.create({
        data: {
            ...data,
            userId,
        },
    });
}
export async function updateUserAddress(userId, addressId, data) {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }
    const existingAddress = await prisma.address.findUnique({
        where: { id: addressId, userId: userId },
    });
    if (!existingAddress) {
        throw new AppError(404, "Address not found");
    }
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
    }
    return prisma.address.update({
        where: { id: addressId },
        data: {
            ...data,
            userId,
        },
    });
}
export async function deleteUserAddress(userId, addressId) {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }
    const existingAddress = await prisma.address.findUnique({
        where: { id: addressId, userId: userId },
    });
    if (!existingAddress) {
        throw new AppError(404, "Address not found");
    }
    return prisma.address.delete({
        where: { id: addressId },
    });
}
//# sourceMappingURL=user.service.js.map