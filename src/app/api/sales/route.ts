import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, unauthorizedResponse } from "@/lib/utils/api-error";
import { getServerSession } from "@/lib/get-session";
import { CreateSaleSchema } from "@/lib/validations/sale.schema";
import { parseLocalDate } from "@/lib/utils/date";
import { calculateProductTotals } from "@/lib/utils/productTotals";

// Get all sales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const session = await getServerSession();
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const sales = await prisma.sale.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          customer: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      },
      include: { customer: true },
      orderBy: {
        lastSaleDate: "desc",
      },
    });
    return NextResponse.json({ data: sales }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// Create a new sale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await getServerSession();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Validate the request body
    const data = CreateSaleSchema.parse(body);

    const { products, ...saleData } = data;

    // Verify customer ownership
    const customer = await prisma.customer.findUnique({
      where: { id: saleData.customerId, userId: session.user.id },
      select: { id: true },
    });
    if (!customer) {
      return NextResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    const productsToCreate = products?.map((p) => {
      const { storedTotals } = calculateProductTotals(
        p.unitPrice,
        p.purchasePrice,
        p.quantity,
      );
      return {
        ...p,
        ...storedTotals,
        saleDate: parseLocalDate(p.saleDate),
        userId: session.user.id,
      };
    });

    const result = await prisma.sale.create({
      data: {
        ...saleData,
        userId: session.user.id,
        ...(productsToCreate &&
          productsToCreate.length > 0 && {
            products: { create: productsToCreate },
          }),
      },
      include: { customer: true, products: true },
    });
    return NextResponse.json(
      { message: "Sale created successfully", data: result },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
