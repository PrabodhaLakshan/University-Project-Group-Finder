import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

/**
 * GET /api/unimart/orders/seller
 * Get all orders for products owned by the logged-in seller
 * Query params: status (optional), startDate (optional), endDate (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Get and verify JWT token
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(authHeader) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const sellerId = decoded.userId;
    console.log("[Seller Orders API] Fetching orders for seller:", sellerId);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = {
      product: {
        sellerId: sellerId,
      },
    };

    if (statusFilter) {
      where.paymentStatus = statusFilter;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    console.log("[Seller Orders API] Where clause:", JSON.stringify(where, null, 2));

    // Fetch orders for seller's products
    const orders = await prismaDelegates.uniMartOrder.findMany({
      where,
      include: {
        product: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            student_id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("[Seller Orders API] Found", orders.length, "orders");

    // Handle null buyer relations due to RLS policies
    const processedOrders = await Promise.all(
      orders.map(async (order: any) => {
        let buyer = order.buyer;
        
        // If buyer is null, try to fetch it separately
        if (!buyer) {
          try {
            buyer = await prismaDelegates.users.findUnique({
              where: { id: order.buyerId },
              select: {
                id: true,
                name: true,
                email: true,
                student_id: true,
              },
            });
          } catch (e) {
            console.warn("[Seller Orders API] Could not fetch buyer:", e);
          }
        }
        
        return {
          ...order,
          buyer: buyer || { id: "", name: "Anonymous", email: "", student_id: "" },
        };
      })
    );

    return NextResponse.json({ orders: processedOrders }, { status: 200 });
  } catch (error) {
    console.error("[Seller Orders API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Seller Orders API] Error details:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch seller orders", details: errorMessage },
      { status: 500 }
    );
  }
}
