import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

const secretKey = new TextEncoder().encode(secret);

export type SessionPayload = {
    userId: string;
    email: string;
    name: string;
};

export async function signSessionToken(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secretKey);
}

export async function verifySessionToken(token: string) {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as SessionPayload & {
        iat?: number;
        exp?: number;
    };
}