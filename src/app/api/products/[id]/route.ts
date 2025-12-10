import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { UpdateProductSchema } from "@/lib/validations/product.shcema";
import { NextRequest, NextResponse } from "next/server";

// Get a product
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product retrieved successfully", data: product },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Edit a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate the request body
    const data = UpdateProductSchema.parse(body);

    // Get existing product
    const existing = await prisma.product.findUnique({
      where: { id, userId: session.user.id },
      select: {
        unitPrice: true,
        purchasePrice: true,
        quantity: true,
      },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Update calculated fields
    const unitPrice = data.unitPrice ?? existing.unitPrice;
    const purchasePrice = data.purchasePrice ?? existing.purchasePrice;
    const quantity = data.quantity ?? existing.quantity;

    const subtotal = unitPrice * quantity;
    const profit = (unitPrice - purchasePrice) * quantity;

    // Update product
    const result = await prisma.product.update({
      where: { id, userId: session.user.id },
      data: { ...data, subtotal, profit },
    });

    return NextResponse.json({
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a product
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.product.delete({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
