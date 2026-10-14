import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in .env");
}
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
            "15m"),
    });
}
export function verifyToken(token) {
    // Throws if the signature is wrong OR the token is expired
    return jwt.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map