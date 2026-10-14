import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import { signToken } from "../utils/jwt.js";
export async function registerUser(data) {
    const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingEmail) {
        throw new AppError(409, "A user with this email already exists");
    }
    const hashedPassword = await hashPassword(data.password);
    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            role: "CUSTOMER",
            cart: {
                create: {},
            },
        },
    });
    // generate JWT token for the new user
    const token = signToken({
        sub: newUser.id,
        role: newUser.role,
    });
    return {
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
        token: token,
    };
}
export async function loginUser(data) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }
    const isPasswordValid = await verifyPassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError(401, "Invalid email or password");
    }
    const token = signToken({
        sub: user.id,
        role: user.role,
    });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token: token,
    };
}
//# sourceMappingURL=auth.service..js.map