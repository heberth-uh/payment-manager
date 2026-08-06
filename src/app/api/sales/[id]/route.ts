import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { calculateProductTotals } from "@/lib/utils/productTotals";
import { UpdateSaleSchema } from "@/lib/validations/sale.schema";
import { NextRequest, NextResponse } from "next/server";

// Get a sale
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sale = await prisma.sale.findUnique({
      include: { customer: true, products: true },
      where: { id, userId: session?.user.id },
    });

    if (!sale) {
      return NextResponse.json(
        { message: "Venta no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Sale retrieved successfully", data: sale },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Edit a sale
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate the request body
    const parsed = UpdateSaleSchema.parse(body);
    const { products, ...saleData } = parsed;

    const updatedSale = await prisma.$transaction(async (tx) => {
      // Product deletes
      if (products?.deleteIds.length) {
        await tx.product.deleteMany({
          where: { id: { in: products.deleteIds }, saleId: id },
        });
      }

      // Product updates
      for (const { id: productId, ...changes } of products?.update ?? []) {
        let updateData = { ...changes };
        const shouldRecalculateTotals =
          "unitPrice" in changes ||
          "purchasePrice" in changes ||
          "quantity" in changes;
        if (shouldRecalculateTotals) {
          const currentProduct = await tx.product.findUnique({
            where: { id: productId, saleId: id },
          });
          if (!currentProduct) {
            throw new Error(
              `Product with id ${productId} not found for sale ${id}`,
            );
          }
          const merged = { ...currentProduct, ...changes };
          const { storedTotals } = calculateProductTotals(
            merged.unitPrice,
            merged.purchasePrice,
            merged.quantity,
          );
          updateData = { ...changes, ...storedTotals };
        }
        await tx.product.update({
          where: { id: productId, saleId: id },
          data: updateData,
        });
      }

      // Product creates
      for (const product of products?.create ?? []) {
        const { storedTotals } = calculateProductTotals(
          product.unitPrice,
          product.purchasePrice,
          product.quantity,
        );
        await tx.product.create({
          data: {
            ...product,
            ...storedTotals,
            saleId: id,
            userId: session.user.id,
          },
        });
      }

      // Sale update
      return tx.sale.update({
        where: { id, userId: session.user.id },
        data: saleData,
        include: { customer: true, products: true },
      });
    });

    return NextResponse.json({
      message: "Sale updated successfully",
      data: updatedSale,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a sale
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
