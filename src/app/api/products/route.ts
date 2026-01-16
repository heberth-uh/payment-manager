import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { CreateProductSchema } from "@/lib/validations/product.schema";
import { NextRequest, NextResponse } from "next/server";

// Get all products
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate the request body
    const data = CreateProductSchema.parse(body);
    const result = await prisma.product.create({
      data: {
        ...data,
        saleDate: new Date(data.saleDate),
        subtotal: data.unitPrice * data.quantity,
        profit: (data.unitPrice - data.purchasePrice) * data.quantity,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Product created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
