import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError, unauthorizedResponse } from "@/lib/utils/api-error";
import { calculateProductTotals } from "@/lib/utils/productTotals";
import { CreateProductSchema } from "@/lib/validations/product.schema";
import { NextRequest, NextResponse } from "next/server";

// Get all products
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const products = await prisma.product.findMany({
      where: {
        userId: session?.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// Create a product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await getServerSession();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Validate the request body
    const data = CreateProductSchema.parse(body);

    // Verify sale ownership
    const sale = await prisma.sale.findUnique({
      where: { id: data.saleId, userId: session.user.id },
      select: { id: true },
    });
    if (!sale) {
      return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
    }

    // Get calculated fields object
    const { storedTotals } = calculateProductTotals(
      data.unitPrice,
      data.purchasePrice,
      data.quantity,
    );
    const result = await prisma.product.create({
      data: {
        ...data,
        ...storedTotals,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Product created successfully", data: result },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
