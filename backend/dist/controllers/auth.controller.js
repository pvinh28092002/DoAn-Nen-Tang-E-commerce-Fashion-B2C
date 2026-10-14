import { registerUser, loginUser } from "../services/auth.service..js";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema.js";
export async function handleRegister(req, res, next) {
    try {
        const result = registerUserSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid user data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const userData = result.data;
        const newUser = await registerUser(userData);
        res.cookie("token", newUser.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            data: newUser.user,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleLogin(req, res, next) {
    try {
        const result = loginUserSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid login data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const userData = result.data;
        const user = await loginUser(userData);
        res.cookie("token", user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            data: user.user,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function handleLogout(req, res, next) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map