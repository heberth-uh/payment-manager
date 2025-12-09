import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
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
