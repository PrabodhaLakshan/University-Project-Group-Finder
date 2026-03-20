import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

// GET - Fetch all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const seller = searchParams.get("seller"); // seller=me for seller's own products
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 12;

    const where: any = {};

    // Handle seller=me parameter (for seller dashboard)
    if (seller === "me") {
      const authHeader = request.headers.get("authorization");
      const decoded = verifyToken(authHeader || "") as any;
      
      if (!decoded || !decoded.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Seller can see their own products with ANY status (AVAILABLE, RESERVED, SOLD)
      where.sellerId = decoded.userId;
    } else {
      // Browse page: Only show AVAILABLE products (hide RESERVED and SOLD)
      where.status = "AVAILABLE";
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    try {
      const total = await prismaDelegates.uniMartProducts.count({ where });
      const products = await prismaDelegates.uniMartProducts.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
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
        sellerId: p.seller?.id || p.sellerId,
      }));

      return NextResponse.json({
        items,
        total,
        page,
        pageSize,
      });
    } catch (dbError) {
      // Database tables don't exist yet - return empty results
      console.warn("Database tables not yet created, returning empty results");
      return NextResponse.json({
        items: [],
        total: 0,
        page,
        pageSize,
      });
    }
  } catch (error) {
    console.error("GET /api/unimart/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("POST /api/unimart/products - Auth header:", authHeader ? "Present" : "Missing");
    
    const payload: any = verifyToken(authHeader || undefined);
    console.log("Token payload:", payload);

    if (!payload) {
      console.log("Unauthorized: No valid token");
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    const { title, description, price, category, condition, location, images } =
      body;

    // Validate required fields
    if (!title || !description || !price || !category || !condition || !images?.length) {
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (!price) missingFields.push("price");
      if (!category) missingFields.push("category");
      if (!condition) missingFields.push("condition");
      if (!images?.length) missingFields.push("images");
      
      console.log("Missing fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("Creating product for seller:", payload.userId);
    const product = await prismaDelegates.uniMartProducts.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        condition,
        location: location || null,
        images,
        sellerId: payload.userId,
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    console.log("Product created successfully:", product.id);
    
    // Handle case where seller relation is null (due to RLS policies)
    let sellerName = product.seller?.name;
    let sellerEmail = product.seller?.email;
    
    if (!sellerName || !sellerEmail) {
      console.log("Seller relation was null, fetching user data separately for userId:", payload.userId);
      try {
        // Fetch user data directly since relation might be null due to RLS
        const user = await prismaDelegates.users.findUnique({
          where: { id: payload.userId },
          select: { name: true, email: true },
        });
        
        if (user) {
          sellerName = user.name;
          sellerEmail = user.email;
        } else {
          console.warn("User not found in database for userId:", payload.userId);
          // Use placeholder data if user not found
          sellerName = "Unknown Seller";
          sellerEmail = "";
        }
      } catch (userFetchError) {
        console.error("Error fetching user details:", userFetchError);
        sellerName = "Unknown Seller";
        sellerEmail = "";
      }
    }
    
    return NextResponse.json(
      {
        ...product,
        sellerName,
        sellerEmail,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/unimart/products error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error message:", errorMessage);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    
    return NextResponse.json(
      { error: `Failed to create product: ${errorMessage}` },
      { status: 500 }
    );
  }
}
