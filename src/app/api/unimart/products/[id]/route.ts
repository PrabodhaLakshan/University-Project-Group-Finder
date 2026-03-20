import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prismaDelegates.uniMartProducts.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, email: true, student_id: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const sellerName = product.seller?.name || "Unknown Seller";
    const sellerEmail = product.seller?.email || "";

    return NextResponse.json({
      ...product,
      sellerName,
      sellerEmail,
    });
  } catch (error) {
    console.error("GET /api/unimart/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const payload: any = verifyToken(authHeader || undefined);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns the product
    const product = await prismaDelegates.uniMartProducts.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.sellerId !== payload.userId) {
      return NextResponse.json(
        { error: "You can only edit your own products" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, price, category, condition, location, images } =
      body;

    const updated = await prismaDelegates.uniMartProducts.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(condition && { condition }),
        location: location || null,
        ...(images && { images }),
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const sellerName = updated.seller?.name || "Unknown Seller";
    const sellerEmail = updated.seller?.email || "";

    return NextResponse.json({
      ...updated,
      sellerName,
      sellerEmail,
    });
  } catch (error) {
    console.error("PUT /api/unimart/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const payload: any = verifyToken(authHeader || undefined);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prismaDelegates.uniMartProducts.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.sellerId !== payload.userId) {
      return NextResponse.json(
        { error: "You can only delete your own products" },
        { status: 403 }
      );
    }

    await prismaDelegates.uniMartProducts.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/unimart/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
