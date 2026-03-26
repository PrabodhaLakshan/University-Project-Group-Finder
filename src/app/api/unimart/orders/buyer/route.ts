import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

/**
 * GET /api/unimart/orders/buyer
 * Get all orders for the logged-in buyer
 * Query params: status (optional), startDate (optional), endDate (optional)
 */
export async function GET(request: NextRequest) {
  try {
    console.log("[Buyer Orders API] === Request received ===");
    
    // Get and verify JWT token
    const authHeader = request.headers.get("authorization");

    console.log("[Buyer Orders API] Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader) {
      console.log("[Buyer Orders API] ❌ No token provided");
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = verifyToken(authHeader) as any;
    console.log("[Buyer Orders API] Token decoded:", decoded ? "Success" : "Failed");
    
    if (!decoded || !decoded.userId) {
      console.log("[Buyer Orders API] ❌ Invalid token or no userId");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const buyerId = decoded.userId;
    console.log("[Buyer Orders API] ✅ Buyer ID:", buyerId);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = { buyerId };

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

    console.log("[Buyer Orders API] Query where:", JSON.stringify(where, null, 2));

    // Try to fetch orders
    try {
      const orders = await prismaDelegates.uniMartOrder.findMany({
        where,
        include: {
          product: {
            include: {
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  student_id: true,
                },
              },
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("[Buyer Orders API] ✅ Query successful, found", orders.length, "orders");
      
      // Handle null seller relations due to RLS policies
      // Try to fetch missing seller data if needed
      const processedOrders = await Promise.all(
        orders.map(async (order: any) => {
          if (order.product && !order.product.seller) {
            console.log("[Buyer Orders API] ⚠️ Seller not loaded for product:", order.product.id);
            
            // Try to fetch seller separately
            try {
              const seller = await prismaDelegates.users.findUnique({
                where: { id: order.product.sellerId },
                select: { id: true, name: true, email: true, student_id: true },
              });
              
              if (seller) {
                order.product.seller = seller;
                console.log("[Buyer Orders API] ✅ Fetched seller data separately");
              }
            } catch (e) {
              console.warn("[Buyer Orders API] Could not fetch seller separately:", e);
              // Keep it as null, frontend will handle the fallback
            }
          }
          return order;
        })
      );
      
      return NextResponse.json({ orders: processedOrders }, { status: 200 });
    } catch (dbError) {
      console.error("[Buyer Orders API] ❌ Database error:", dbError);
      const dbErrorMessage = dbError instanceof Error ? dbError.message : "Unknown database error";
      
      // Check if it's a "table doesn't exist" error
      if (dbErrorMessage.includes("does not exist") || dbErrorMessage.includes("uniMartOrder")) {
        console.log("[Buyer Orders API] ⚠️ Database tables may not exist, returning empty array");
        return NextResponse.json({ orders: [] }, { status: 200 });
      }
      
      throw dbError; // Re-throw if it's a different error
    }
  } catch (error) {
    console.error("[Buyer Orders API] ❌ Fatal error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Buyer Orders API] Error details:", errorMessage);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch buyer orders", 
        details: errorMessage,
        hint: "Check server console for details"
      },
      { status: 500 }
    );
  }
}
