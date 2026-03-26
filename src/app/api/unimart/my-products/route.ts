import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

// GET - Fetch user's products with optional status filter
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const payload: any = verifyToken(authHeader || undefined);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // Support filtering by status

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = { sellerId: payload.userId };
    if (status) {
      where.status = status; // Filter by status if provided
    }

    const products = await prismaDelegates.uniMartProducts.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const items = products.map((p: any) => ({
      ...p,
      sellerName: p.seller?.name || "Unknown Seller",
      sellerEmail: p.seller?.email || "",
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/unimart/my-products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
