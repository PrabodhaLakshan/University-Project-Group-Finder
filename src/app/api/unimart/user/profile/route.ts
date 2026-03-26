import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("GET /api/unimart/user/profile - Auth header:", authHeader ? "Present" : "Missing");
    
    const payload: any = verifyToken(authHeader || undefined);
    console.log("Token payload:", payload);

    if (!payload) {
      console.log("Unauthorized: No valid token");
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        student_id: true,
        name: true,
        email: true,
      },
    });

    let userData = user;
    
    if (!userData) {
      console.log("User not found via Prisma query:", payload.userId);
      console.log("Token payload contains:", { userId: payload.userId, student_id: payload.student_id });
      
      // If database query fails (RLS policies or user not synced yet),
      // return a user object with data from the JWT token
      userData = {
        id: payload.userId,
        student_id: payload.student_id || "",
        name: payload.name || "",
        email: payload.email || "",
      };
    }

    // Get seller stats (with fallback if table doesn't exist)
    let totalSales = 0;
    try {
      totalSales = await prismaDelegates.uniMartProducts.count({
        where: { sellerId: userData.id, sold: true },
      });
    } catch (dbError) {
      console.log("uniMartProducts table not found, setting totalSales to 0");
    }

    console.log("Returning user profile:", userData.id);
    return NextResponse.json({
      ...userData,
      bio: null,
      profileImage: null,
      totalSales,
    });
  } catch (error) {
    console.error("GET /api/unimart/user/profile error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    
    return NextResponse.json(
      { error: `Failed to fetch profile: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("PUT /api/unimart/user/profile - Auth header:", authHeader ? "Present" : "Missing");
    
    const payload: any = verifyToken(authHeader || undefined);
    console.log("Token payload:", payload);

    if (!payload) {
      console.log("Unauthorized: No valid token");
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Update data:", body);
    const { name, bio } = body;

    const updated = await prisma.users.update({
      where: { id: payload.userId },
      data: {
        ...(name && { name }),
      },
      select: {
        id: true,
        student_id: true,
        name: true,
        email: true,
      },
    });

    // Get seller stats (with fallback if table doesn't exist)
    let totalSales = 0;
    try {
      totalSales = await prismaDelegates.uniMartProducts.count({
        where: { sellerId: updated.id, sold: true },
      });
    } catch (dbError) {
      console.log("uniMartProducts table not found, setting totalSales to 0");
    }

    console.log("Profile updated successfully:", updated.id);
    return NextResponse.json({
      ...updated,
      bio: bio || null,
      profileImage: null,
      totalSales,
    });
  } catch (error) {
    console.error("PUT /api/unimart/user/profile error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    
    return NextResponse.json(
      { error: `Failed to update profile: ${errorMessage}` },
      { status: 500 }
    );
  }
}
