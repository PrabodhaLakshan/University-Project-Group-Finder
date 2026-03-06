import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { receiverId } = body;

        const senderId = "CURRENT_LOGGED_USER_ID"; // session walin passe ganna

        if (!receiverId) {
            return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
        }

        const existingInvite = await prisma.invites.findFirst({
            where: {
                sender_id: senderId,
                receiver_id: receiverId,
                status: "pending",
            },
        });

        if (existingInvite) {
            return NextResponse.json({ error: "Invite already sent" }, { status: 400 });
        }

        const invite = await prisma.invites.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                status: "pending",
            },
        });

        return NextResponse.json({
            message: "Invite sent successfully",
            invite,
        });
    } catch (error) {
        console.error("Invite API error:", error);
        return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
    }
}