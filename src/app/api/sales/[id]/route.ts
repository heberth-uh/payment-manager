import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { NextRequest, NextResponse } from "next/server";

// Get a sale
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

    const sale = await prisma.sale.findUnique({
      where: { id, userId: session?.user.id },
    });

    if (!sale) {
      return NextResponse.json(
        { message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sale retrieved successfully", data: sale },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Edit a sale
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

    // TODO: Valitate body

    const result = await prisma.sale.update({
      where: { id, userId: session.user.id },
      data: body,
    });

    return NextResponse.json({
      message: "Sale updated successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a sale
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

    const result = await prisma.sale.delete({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({
      message: "Sale deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
