import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: groupId } = await params;

        if (!groupId || groupId === 'undefined') {
            return NextResponse.json(
                { success: false, message: "Invalid group id" },
                { status: 400 }
            );
        }

        const messages = await prisma.group_messages.findMany({
            where: {
                group_id: groupId,
            },
            orderBy: {
                created_at: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error("GET messages error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch messages",
            },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: groupId } = await params;

        if (!groupId || groupId === 'undefined') {
            return NextResponse.json(
                { success: false, message: "Invalid group id" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const { sender_id, sender_name, sender_image, message } = body;

        if (!sender_id || !message?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "sender_id and message are required",
                },
                { status: 400 }
            );
        }

        const newMessage = await prisma.group_messages.create({
            data: {
                group_id: groupId,
                sender_id,
                sender_name: sender_name || null,
                sender_image: sender_image || null,
                message: message.trim(),
            },
        });

        return NextResponse.json({
            success: true,
            message: newMessage,
        });
    } catch (error) {
        console.error("POST message error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save message",
            },
            { status: 500 }
        );
    }
}