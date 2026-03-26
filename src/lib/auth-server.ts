import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prismaClient";

type JwtPayload = {
    userId: string;
    email?: string;
    name?: string;
};

export function verifyToken(authHeader?: string): JwtPayload | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
        return null;
    }
}

export async function getCurrentUserFromRequest(req: Request) {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader);

    if (!decoded?.userId) {
        return null;
    }

    const user = await prisma.users.findUnique({
        where: {
            id: decoded.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            student_id: true,
            specialization: true,
            year: true,
            semester: true,
            skills: true,
            avatar_path: true,
            group_status: true,
        },
    });

    return user;
}

export async function requireUserFromRequest(req: Request) {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
        throw new Error("UNAUTHORIZED");
    }

    return user;
}
