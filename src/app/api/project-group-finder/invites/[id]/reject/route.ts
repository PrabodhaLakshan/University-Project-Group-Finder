import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: inviteId } = await params;

        const invite = await prisma.project_group_invites.findUnique({
            where: { id: inviteId },
        });

        if (!invite) {
            return NextResponse.json({ error: "Invite not found" }, { status: 404 });
        }

        if (invite.receiver_id !== currentUser.id) {
            return NextResponse.json(
                { error: "You are not allowed to reject this invite" },
                { status: 403 }
            );
        }

        if (invite.status !== "pending") {
            return NextResponse.json(
                { error: "This invite is no longer pending" },
                { status: 400 }
            );
        }

        await prisma.project_group_invites.update({
            where: { id: inviteId },
            data: {
                status: "rejected",
            },
        });

        return NextResponse.json({
            message: "Invite rejected successfully",
        });
    } catch (error) {
        console.error("Reject invite API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to reject invite" },
            { status: 500 }
        );
    }
}