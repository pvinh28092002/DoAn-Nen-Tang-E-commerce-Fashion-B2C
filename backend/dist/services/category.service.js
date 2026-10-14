import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
//Read
export async function getCategories() {
    return prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
export async function getCategoryTree() {
    return prisma.category.findMany({
        where: { parentId: null }, // Roots have no parent
        include: { children: true },
    });
}
export async function getCategoryById(id) {
    const category = await prisma.category.findUnique({
        where: { id },
    });
    if (!category) {
        throw new AppError(404, "CATEGORY_NOT_FOUND");
    }
    return category;
}
//Create
export async function createCategory(data) {
    const existingCategory = await prisma.category.findUnique({
        where: { slug: data.slug },
    });
    if (existingCategory) {
        throw new AppError(409, "A category with this slug already exists");
    }
    return prisma.category.create({
        data,
    });
}
//Update
export async function updateCategory(id, data) {
    const existingCategory = await prisma.category.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        throw new AppError(404, "CATEGORY_NOT_FOUND");
    }
    if (data.slug && data.slug !== existingCategory.slug) {
        const slugExists = await prisma.category.findUnique({
            where: { slug: data.slug },
        });
        if (slugExists) {
            throw new AppError(409, "A category with this slug already exists");
        }
    }
    return prisma.category.update({
        where: { id },
        data,
    });
}
//Delete
export async function deleteCategory(id) {
    const existingCategory = await prisma.category.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        throw new AppError(404, "CATEGORY_NOT_FOUND");
    }
    return prisma.category.delete({
        where: { id },
    });
}
//# sourceMappingURL=category.service.js.map